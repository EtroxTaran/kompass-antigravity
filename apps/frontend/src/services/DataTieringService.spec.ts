/**
 * DataTieringService Unit Tests
 *
 * @see KOM-94 - Tiered data synchronization
 */

import { describe, it, expect } from 'vitest';

import { UserRole } from '@kompass/shared';

import {
  DataTieringService,
  DataTier,
  TIER_LIMITS,
} from './DataTieringService';

import type { BaseEntity, User, Customer } from '@kompass/shared';

/**
 * Create a mock user
 */
function createMockUser(overrides: Partial<User> = {}): User {
  return {
    _id: 'user-123',
    _rev: '1-abc',
    type: 'user',
    email: 'test@example.com',
    displayName: 'Test User',
    roles: [UserRole.ADM],
    primaryRole: UserRole.ADM,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
}

/**
 * Create a mock entity
 */
function createMockEntity<T extends BaseEntity>(
  type: string,
  overrides: Partial<T> = {}
): T {
  return {
    _id: `${type}-123`,
    _rev: '1-abc',
    type,
    createdBy: 'user-123',
    createdAt: new Date(),
    modifiedBy: 'user-123',
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  } as T;
}

describe('DataTieringService', () => {
  describe('classifyEntity', () => {
    it('should return NONE tier when user is null', () => {
      const entity = createMockEntity('customer');
      const classification = DataTieringService.classifyEntity(
        entity,
        null,
        {}
      );

      expect(classification.tier).toBe(DataTier.NONE);
      expect(classification.reason).toBe('No authenticated user');
    });

    it('should classify user profile as ESSENTIAL', () => {
      const user = createMockUser();
      const entity = createMockEntity('user', { _id: user._id });
      const classification = DataTieringService.classifyEntity(
        entity,
        user,
        {}
      );

      expect(classification.tier).toBe(DataTier.ESSENTIAL);
      expect(classification.reason).toBe('Current user profile');
      expect(classification.estimatedSize).toBe(5 * 1024);
    });

    it('should classify pinned entity as PINNED', () => {
      const user = createMockUser();
      const entity = createMockEntity('customer');
      const classification = DataTieringService.classifyEntity(entity, user, {
        isPinned: true,
      });

      expect(classification.tier).toBe(DataTier.PINNED);
      expect(classification.reason).toBe('User-pinned for offline access');
    });

    it('should classify own customer (ADM) as ESSENTIAL', () => {
      const user = createMockUser({ roles: [UserRole.ADM] });
      const entity = createMockEntity<Customer>('customer', {
        owner: user._id,
      });
      const classification = DataTieringService.classifyEntity(
        entity,
        user,
        {}
      );

      expect(classification.tier).toBe(DataTier.ESSENTIAL);
      expect(classification.reason).toBe('Own customer (ADM)');
      expect(classification.estimatedSize).toBe(3 * 1024);
    });

    it('should classify active opportunity as ESSENTIAL', () => {
      const user = createMockUser();
      const entity = createMockEntity('opportunity', {
        owner: user._id,
        status: 'Qualifying',
      } as any);
      const classification = DataTieringService.classifyEntity(
        entity,
        user,
        {}
      );

      expect(classification.tier).toBe(DataTier.ESSENTIAL);
      expect(classification.reason).toBe('Active opportunity');
    });

    it('should classify today appointment as ESSENTIAL', () => {
      const user = createMockUser();
      const today = new Date();
      const entity = createMockEntity('activity', {
        date: today,
        createdBy: user._id,
      } as any);
      const classification = DataTieringService.classifyEntity(
        entity,
        user,
        {}
      );

      expect(classification.tier).toBe(DataTier.ESSENTIAL);
      expect(classification.reason).toBe("Today's appointment");
    });

    it('should classify recently accessed entity as RECENT', () => {
      const user = createMockUser();
      const entity = createMockEntity('customer');
      const lastAccessedAt = new Date();
      lastAccessedAt.setDate(lastAccessedAt.getDate() - 10); // 10 days ago

      const classification = DataTieringService.classifyEntity(entity, user, {
        lastAccessedAt,
      });

      expect(classification.tier).toBe(DataTier.RECENT);
      expect(classification.reason).toBe('Accessed within last 30 days');
    });

    it('should classify frequently accessed entity as RECENT', () => {
      const user = createMockUser();
      const entity = createMockEntity('customer', {
        modifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      });

      const classification = DataTieringService.classifyEntity(entity, user, {
        accessCount: 15,
      });

      expect(classification.tier).toBe(DataTier.RECENT);
      expect(classification.reason).toBe('Frequently accessed');
    });

    it('should classify entity modified in last 30 days as RECENT', () => {
      const user = createMockUser();
      const entity = createMockEntity('customer', {
        modifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      });

      const classification = DataTieringService.classifyEntity(
        entity,
        user,
        {}
      );

      expect(classification.tier).toBe(DataTier.RECENT);
      expect(classification.reason).toBe('Modified within last 30 days');
    });

    it('should classify queued for sync entity as ESSENTIAL', () => {
      const user = createMockUser();
      const entity = createMockEntity('customer', {
        _queuedForSync: true,
      } as any);

      const classification = DataTieringService.classifyEntity(
        entity,
        user,
        {}
      );

      expect(classification.tier).toBe(DataTier.ESSENTIAL);
      expect(classification.reason).toBe('Pending sync change');
    });

    it('should return NONE for entity that does not match any tier', () => {
      const user = createMockUser();
      const entity = createMockEntity('customer', {
        modifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      });

      const classification = DataTieringService.classifyEntity(entity, user, {
        accessCount: 0,
      });

      expect(classification.tier).toBe(DataTier.NONE);
      expect(classification.reason).toBe(
        'Not essential, not recent, not pinned'
      );
    });
  });

  describe('getTierPriority', () => {
    it('should return correct priority for each tier', () => {
      expect(DataTieringService.getTierPriority(DataTier.ESSENTIAL)).toBe(1);
      expect(DataTieringService.getTierPriority(DataTier.RECENT)).toBe(2);
      expect(DataTieringService.getTierPriority(DataTier.PINNED)).toBe(3);
      expect(DataTieringService.getTierPriority(DataTier.NONE)).toBe(999);
    });
  });

  describe('isWithinQuota', () => {
    it('should return true when usage is below limit', () => {
      const result = DataTieringService.isWithinQuota(
        DataTier.ESSENTIAL,
        2 * 1024 * 1024 // 2 MB
      );

      expect(result.within).toBe(true);
      expect(result.limit).toBe(TIER_LIMITS.ESSENTIAL);
      expect(result.used).toBe(2 * 1024 * 1024);
      expect(result.available).toBe(3 * 1024 * 1024);
    });

    it('should return false when usage exceeds limit', () => {
      const result = DataTieringService.isWithinQuota(
        DataTier.ESSENTIAL,
        6 * 1024 * 1024 // 6 MB (exceeds 5 MB limit)
      );

      expect(result.within).toBe(false);
      expect(result.available).toBeLessThan(0);
    });
  });

  describe('getTierLimit', () => {
    it('should return correct limit for each tier', () => {
      expect(DataTieringService.getTierLimit(DataTier.ESSENTIAL)).toBe(
        TIER_LIMITS.ESSENTIAL
      );
      expect(DataTieringService.getTierLimit(DataTier.RECENT)).toBe(
        TIER_LIMITS.RECENT
      );
      expect(DataTieringService.getTierLimit(DataTier.PINNED)).toBe(
        TIER_LIMITS.PINNED
      );
      expect(DataTieringService.getTierLimit(DataTier.NONE)).toBe(0);
    });
  });

  describe('getTierDisplayName', () => {
    it('should return German display names', () => {
      expect(DataTieringService.getTierDisplayName(DataTier.ESSENTIAL)).toBe(
        'Essenzielle Daten'
      );
      expect(DataTieringService.getTierDisplayName(DataTier.RECENT)).toBe(
        'Kürzlich verwendet'
      );
      expect(DataTieringService.getTierDisplayName(DataTier.PINNED)).toBe(
        'Gepinnte Inhalte'
      );
      expect(DataTieringService.getTierDisplayName(DataTier.NONE)).toBe(
        'Nicht offline'
      );
    });
  });
});
