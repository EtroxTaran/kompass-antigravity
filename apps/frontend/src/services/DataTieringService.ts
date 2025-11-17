/**
 * Data Tiering Service
 *
 * Implements tiered data synchronization strategy for offline PWA.
 * Manages Essential/Recent/Pinned tiers to maximize available information
 * within iOS 50MB storage constraint.
 *
 * Based on: docs/specifications/OFFLINE_PWA_DATA_STRATEGY.md
 *
 * @see KOM-94 - Tiered data synchronization
 */

import { UserRole } from '@kompass/shared';

import type { BaseEntity, User } from '@kompass/shared';

/**
 * Data tier classification
 */
export enum DataTier {
  /** Tier 1: Essential data (5 MB) - Always cached */
  ESSENTIAL = 'essential',
  /** Tier 2: Recent data (10 MB) - Last 30 days activity */
  RECENT = 'recent',
  /** Tier 3: Pinned data (35 MB) - User-selected content */
  PINNED = 'pinned',
  /** Not cached offline */
  NONE = 'none',
}

/**
 * Tier size limits in bytes
 */
export const TIER_LIMITS = {
  ESSENTIAL: 5 * 1024 * 1024, // 5 MB
  RECENT: 10 * 1024 * 1024, // 10 MB
  PINNED: 35 * 1024 * 1024, // 35 MB
  TOTAL: 50 * 1024 * 1024, // 50 MB (iOS limit)
} as const;

/**
 * Tier metadata for an entity
 */
export interface TierMetadata {
  /** Which tier this entity belongs to */
  tier: DataTier;
  /** When entity was classified */
  classifiedAt: Date;
  /** When entity was last accessed (for LRU eviction) */
  lastAccessedAt?: Date;
  /** Whether entity is pinned by user */
  isPinned?: boolean;
  /** Estimated size in bytes */
  estimatedSize?: number;
  /** Reason for tier classification */
  reason?: string;
}

/**
 * Entity with tier metadata
 */
export interface TieredEntity<T extends BaseEntity> {
  entity: T;
  tierMetadata: TierMetadata;
}

/**
 * Tier classification result
 */
export interface TierClassification {
  tier: DataTier;
  reason: string;
  estimatedSize: number;
}

/**
 * Data Tiering Service
 *
 * Classifies entities into tiers based on:
 * - User role and ownership
 * - Recency (last 30 days)
 * - User pinning
 * - Entity type and importance
 */
export class DataTieringService {
  /**
   * Classify an entity into a data tier
   *
   * @param entity - Entity to classify
   * @param user - Current user
   * @param options - Classification options
   * @returns Tier classification
   */
  static classifyEntity<T extends BaseEntity>(
    entity: T,
    user: User | null,
    options: {
      isPinned?: boolean;
      lastAccessedAt?: Date;
      accessCount?: number;
    } = {}
  ): TierClassification {
    if (!user) {
      return {
        tier: DataTier.NONE,
        reason: 'No authenticated user',
        estimatedSize: 0,
      };
    }

    const { isPinned = false, lastAccessedAt, accessCount = 0 } = options;

    // Tier 3: Pinned data (user-selected)
    if (isPinned) {
      return {
        tier: DataTier.PINNED,
        reason: 'User-pinned for offline access',
        estimatedSize: this.estimateEntitySize(entity),
      };
    }

    // Tier 1: Essential data
    const essentialClassification = this.classifyAsEssential(entity, user);
    if (essentialClassification) {
      return essentialClassification;
    }

    // Tier 2: Recent data (last 30 days)
    const recentClassification = this.classifyAsRecent(
      entity,
      lastAccessedAt,
      accessCount
    );
    if (recentClassification) {
      return recentClassification;
    }

    // Not cached offline
    return {
      tier: DataTier.NONE,
      reason: 'Not essential, not recent, not pinned',
      estimatedSize: 0,
    };
  }

  /**
   * Classify entity as Tier 1: Essential
   *
   * Essential data includes:
   * - User profile and permissions
   * - Own customers (ADM role)
   * - Active opportunities
   * - Today's appointments
   * - Today's tasks
   * - Assigned projects (PLAN role)
   * - Offline queue items
   * - Reference data (materials, suppliers)
   */
  private static classifyAsEssential<T extends BaseEntity>(
    entity: T,
    user: User
  ): TierClassification | null {
    // User profile
    if (entity.type === 'user' && entity._id === user._id) {
      return {
        tier: DataTier.ESSENTIAL,
        reason: 'Current user profile',
        estimatedSize: 5 * 1024, // ~5 KB
      };
    }

    // Own customers (ADM role)
    if (entity.type === 'customer') {
      const customer = entity as { owner?: string };
      if (
        customer.owner === user._id &&
        (user.roles.includes(UserRole.ADM) || user.primaryRole === UserRole.ADM)
      ) {
        return {
          tier: DataTier.ESSENTIAL,
          reason: 'Own customer (ADM)',
          estimatedSize: 3 * 1024, // ~3 KB per customer
        };
      }
    }

    // Active opportunities
    if (entity.type === 'opportunity') {
      const opportunity = entity as {
        status?: string;
        owner?: string;
      };
      const activeStatuses = ['New', 'Qualifying', 'Proposal', 'Negotiation'];
      if (
        opportunity.status &&
        activeStatuses.includes(opportunity.status) &&
        opportunity.owner === user._id
      ) {
        return {
          tier: DataTier.ESSENTIAL,
          reason: 'Active opportunity',
          estimatedSize: 2 * 1024, // ~2 KB
        };
      }
    }

    // Today's appointments/activities
    if (entity.type === 'activity' || entity.type === 'meeting') {
      const activity = entity as { date?: Date | string };
      if (activity.date) {
        const activityDate = new Date(activity.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (
          activityDate >= today &&
          activityDate < tomorrow &&
          (entity as { createdBy?: string }).createdBy === user._id
        ) {
          return {
            tier: DataTier.ESSENTIAL,
            reason: "Today's appointment",
            estimatedSize: 1 * 1024, // ~1 KB
          };
        }
      }
    }

    // Today's tasks
    if (entity.type === 'task') {
      const task = entity as {
        dueDate?: Date | string;
        assignedTo?: string;
      };
      if (task.assignedTo === user._id && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dueDate >= today && dueDate < tomorrow) {
          return {
            tier: DataTier.ESSENTIAL,
            reason: "Today's task",
            estimatedSize: 500, // ~500 bytes
          };
        }
      }
    }

    // Assigned projects (PLAN role)
    if (
      entity.type === 'project' &&
      (user.roles.includes(UserRole.PLAN) || user.primaryRole === UserRole.PLAN)
    ) {
      const project = entity as { projectManager?: string };
      if (project.projectManager === user._id) {
        return {
          tier: DataTier.ESSENTIAL,
          reason: 'Assigned project (PLAN)',
          estimatedSize: 5 * 1024, // ~5 KB (summary only)
        };
      }
    }

    // Offline queue items
    if ((entity as { _queuedForSync?: boolean })._queuedForSync) {
      return {
        tier: DataTier.ESSENTIAL,
        reason: 'Pending sync change',
        estimatedSize: 2 * 1024, // ~2 KB
      };
    }

    // Reference data (materials, suppliers) - summaries only
    if (entity.type === 'material' || entity.type === 'supplier') {
      return {
        tier: DataTier.ESSENTIAL,
        reason: 'Reference data (summary)',
        estimatedSize: 1 * 1024, // ~1 KB (summary only)
      };
    }

    return null;
  }

  /**
   * Classify entity as Tier 2: Recent
   *
   * Recent data includes:
   * - Last 30 days activity
   * - Frequently accessed items
   * - Recently viewed entities
   */
  private static classifyAsRecent<T extends BaseEntity>(
    entity: T,
    lastAccessedAt?: Date,
    accessCount: number = 0
  ): TierClassification | null {
    // Check if entity was accessed in last 30 days
    if (lastAccessedAt) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (new Date(lastAccessedAt) >= thirtyDaysAgo) {
        return {
          tier: DataTier.RECENT,
          reason: 'Accessed within last 30 days',
          estimatedSize: this.estimateEntitySize(entity),
        };
      }
    }

    // Check if entity was modified in last 30 days
    if (entity.modifiedAt) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (new Date(entity.modifiedAt) >= thirtyDaysAgo) {
        return {
          tier: DataTier.RECENT,
          reason: 'Modified within last 30 days',
          estimatedSize: this.estimateEntitySize(entity),
        };
      }
    }

    // Frequently accessed items (top 10 by access count)
    if (accessCount > 10) {
      return {
        tier: DataTier.RECENT,
        reason: 'Frequently accessed',
        estimatedSize: this.estimateEntitySize(entity),
      };
    }

    return null;
  }

  /**
   * Estimate entity size in bytes
   *
   * Rough estimation based on entity type and typical data sizes
   */
  private static estimateEntitySize<T extends BaseEntity>(entity: T): number {
    // Base size for metadata
    let size = 500; // Base entity fields

    // Estimate based on entity type
    switch (entity.type) {
      case 'customer':
        size += 3 * 1024; // ~3 KB for customer
        break;
      case 'opportunity':
        size += 2 * 1024; // ~2 KB for opportunity
        break;
      case 'project':
        size += 20 * 1024; // ~20 KB for project detail
        break;
      case 'activity':
      case 'meeting':
        size += 1 * 1024; // ~1 KB for activity
        break;
      case 'protocol':
        size += 3 * 1024; // ~3 KB for protocol
        break;
      case 'document':
        size += 500 * 1024; // ~500 KB for document (if full)
        break;
      case 'task':
        size += 500; // ~500 bytes for task
        break;
      default:
        size += 1 * 1024; // ~1 KB default
    }

    return size;
  }

  /**
   * Get tier priority for sorting
   *
   * Lower number = higher priority
   */
  static getTierPriority(tier: DataTier): number {
    switch (tier) {
      case DataTier.ESSENTIAL:
        return 1;
      case DataTier.RECENT:
        return 2;
      case DataTier.PINNED:
        return 3;
      case DataTier.NONE:
        return 999;
      default:
        return 999;
    }
  }

  /**
   * Check if tier is within quota
   *
   * @param tier - Tier to check
   * @param currentUsage - Current usage in bytes
   * @returns True if within quota
   */
  static isWithinQuota(
    tier: DataTier,
    currentUsage: number
  ): { within: boolean; limit: number; used: number; available: number } {
    const limit = this.getTierLimit(tier);
    const used = currentUsage;
    const available = limit - used;

    return {
      within: used < limit,
      limit,
      used,
      available,
    };
  }

  /**
   * Get tier limit in bytes
   */
  static getTierLimit(tier: DataTier): number {
    switch (tier) {
      case DataTier.ESSENTIAL:
        return TIER_LIMITS.ESSENTIAL;
      case DataTier.RECENT:
        return TIER_LIMITS.RECENT;
      case DataTier.PINNED:
        return TIER_LIMITS.PINNED;
      case DataTier.NONE:
        return 0;
      default:
        return 0;
    }
  }

  /**
   * Get tier display name (German)
   */
  static getTierDisplayName(tier: DataTier): string {
    switch (tier) {
      case DataTier.ESSENTIAL:
        return 'Essenzielle Daten';
      case DataTier.RECENT:
        return 'Kürzlich verwendet';
      case DataTier.PINNED:
        return 'Gepinnte Inhalte';
      case DataTier.NONE:
        return 'Nicht offline';
      default:
        return 'Unbekannt';
    }
  }
}
