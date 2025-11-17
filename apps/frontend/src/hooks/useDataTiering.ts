/**
 * useDataTiering Hook
 *
 * React hook for data tiering functionality.
 * Provides tier classification and management for offline PWA.
 *
 * @see KOM-94 - Tiered data synchronization
 */

import { useMemo, useCallback } from 'react';
import type { BaseEntity } from '@kompass/shared';
import { useAuth } from './useAuth';
import {
  DataTieringService,
  type DataTier,
  type TierClassification,
  TIER_LIMITS,
} from '../services/DataTieringService';

/**
 * Tier classification options
 */
export interface TierClassificationOptions {
  /** Whether entity is pinned by user */
  isPinned?: boolean;
  /** When entity was last accessed */
  lastAccessedAt?: Date;
  /** Access count for frequency-based classification */
  accessCount?: number;
}

/**
 * Tier usage statistics
 */
export interface TierUsage {
  /** Tier name */
  tier: DataTier;
  /** Current usage in bytes */
  used: number;
  /** Limit in bytes */
  limit: number;
  /** Available space in bytes */
  available: number;
  /** Usage percentage (0-100) */
  percentage: number;
  /** Display name (German) */
  displayName: string;
}

/**
 * Data tiering hook return value
 */
export interface UseDataTieringReturn {
  /** Classify an entity into a tier */
  classifyEntity: <T extends BaseEntity>(
    entity: T,
    options?: TierClassificationOptions
  ) => TierClassification;
  /** Get tier priority for sorting */
  getTierPriority: (tier: DataTier) => number;
  /** Check if tier is within quota */
  isWithinQuota: (
    tier: DataTier,
    currentUsage: number
  ) => {
    within: boolean;
    limit: number;
    used: number;
    available: number;
  };
  /** Get tier limit in bytes */
  getTierLimit: (tier: DataTier) => number;
  /** Get tier display name (German) */
  getTierDisplayName: (tier: DataTier) => string;
  /** Get tier usage statistics */
  getTierUsage: (tier: DataTier, currentUsage: number) => TierUsage;
  /** Get all tier limits */
  tierLimits: typeof TIER_LIMITS;
  /** Check if user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Hook for data tiering functionality
 *
 * @example
 * ```tsx
 * const { classifyEntity, getTierDisplayName } = useDataTiering();
 *
 * const classification = classifyEntity(customer, {
 *   isPinned: true,
 *   lastAccessedAt: new Date(),
 * });
 *
 * console.log(getTierDisplayName(classification.tier)); // "Gepinnte Inhalte"
 * ```
 */
export function useDataTiering(): UseDataTieringReturn {
  const { user, isAuthenticated } = useAuth();

  /**
   * Classify an entity into a tier
   */
  const classifyEntity = useCallback(
    <T extends BaseEntity>(
      entity: T,
      options: TierClassificationOptions = {}
    ): TierClassification => {
      return DataTieringService.classifyEntity(entity, user, options);
    },
    [user]
  );

  /**
   * Get tier priority for sorting
   */
  const getTierPriority = useCallback((tier: DataTier): number => {
    return DataTieringService.getTierPriority(tier);
  }, []);

  /**
   * Check if tier is within quota
   */
  const isWithinQuota = useCallback(
    (
      tier: DataTier,
      currentUsage: number
    ): {
      within: boolean;
      limit: number;
      used: number;
      available: number;
    } => {
      return DataTieringService.isWithinQuota(tier, currentUsage);
    },
    []
  );

  /**
   * Get tier limit in bytes
   */
  const getTierLimit = useCallback((tier: DataTier): number => {
    return DataTieringService.getTierLimit(tier);
  }, []);

  /**
   * Get tier display name (German)
   */
  const getTierDisplayName = useCallback((tier: DataTier): string => {
    return DataTieringService.getTierDisplayName(tier);
  }, []);

  /**
   * Get tier usage statistics
   */
  const getTierUsage = useCallback(
    (tier: DataTier, currentUsage: number): TierUsage => {
      const limit = DataTieringService.getTierLimit(tier);
      const available = Math.max(0, limit - currentUsage);
      const percentage = limit > 0 ? (currentUsage / limit) * 100 : 0;

      return {
        tier,
        used: currentUsage,
        limit,
        available,
        percentage: Math.round(percentage * 100) / 100, // Round to 2 decimals
        displayName: DataTieringService.getTierDisplayName(tier),
      };
    },
    []
  );

  return useMemo(
    () => ({
      classifyEntity,
      getTierPriority,
      isWithinQuota,
      getTierLimit,
      getTierDisplayName,
      getTierUsage,
      tierLimits: TIER_LIMITS,
      isAuthenticated,
    }),
    [
      classifyEntity,
      getTierPriority,
      isWithinQuota,
      getTierLimit,
      getTierDisplayName,
      getTierUsage,
      isAuthenticated,
    ]
  );
}
