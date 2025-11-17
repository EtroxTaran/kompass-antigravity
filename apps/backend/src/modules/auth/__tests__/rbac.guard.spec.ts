/**
 * RBAC Guard Unit Tests
 *
 * Tests role-based access control enforcement
 * Focus on permission checking, role validation, and error handling
 */

import { type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, type TestingModule } from '@nestjs/testing';

import {
  EntityType,
  Permission,
  UserRole,
} from '@kompass/shared/constants/rbac.constants';

import { RbacGuard } from '../guards/rbac.guard';

import type { User } from '@kompass/shared/types/entities/user';

describe('RbacGuard', () => {
  let guard: RbacGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockGFUser: User = {
    _id: 'user-gf-001',
    _rev: '1-abc',
    type: 'user',
    email: 'gf@example.com',
    displayName: 'Test GF User',
    roles: [UserRole.GF],
    primaryRole: UserRole.GF,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockADMINUser: User = {
    _id: 'user-admin-001',
    _rev: '1-def',
    type: 'user',
    email: 'admin@example.com',
    displayName: 'Test Admin User',
    roles: [UserRole.ADMIN],
    primaryRole: UserRole.ADMIN,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockADMUser: User = {
    _id: 'user-adm-001',
    _rev: '1-ghi',
    type: 'user',
    email: 'adm@example.com',
    displayName: 'Test ADM User',
    roles: [UserRole.ADM],
    primaryRole: UserRole.ADM,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockPLANUser: User = {
    _id: 'user-plan-001',
    _rev: '1-jkl',
    type: 'user',
    email: 'plan@example.com',
    displayName: 'Test PLAN User',
    roles: [UserRole.PLAN],
    primaryRole: UserRole.PLAN,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RbacGuard>(RbacGuard);
    reflector = module.get(Reflector);
  });

  describe('canActivate', () => {
    it('should allow access if no permission is required', () => {
      const context = createMockContext(mockGFUser);
      reflector.getAllAndOverride.mockReturnValue(undefined); // No permission required

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access if GF user has permission', () => {
      const context = createMockContext(mockGFUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.User,
        action: Permission.READ,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access if ADMIN user has permission', () => {
      const context = createMockContext(mockADMINUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.User,
        action: Permission.CREATE,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access if user has permission through multiple roles', () => {
      const userWithMultipleRoles: User = {
        ...mockADMUser,
        roles: [UserRole.ADM, UserRole.PLAN],
      };
      const context = createMockContext(userWithMultipleRoles);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.Opportunity,
        action: Permission.READ,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user is not authenticated', () => {
      const context = createMockContext(null);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.User,
        action: Permission.READ,
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'User not authenticated'
      );
    });

    it('should throw ForbiddenException if user has no roles', () => {
      const userWithoutRoles: User = {
        ...mockGFUser,
        roles: [],
      };
      const context = createMockContext(userWithoutRoles);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.User,
        action: Permission.READ,
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'User has no assigned roles'
      );
    });

    it('should throw ForbiddenException if user does not have required permission', () => {
      const context = createMockContext(mockADMUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.User,
        action: Permission.CREATE, // ADM cannot create users
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Insufficient permissions'
      );
    });

    it('should throw ForbiddenException with correct error message format', () => {
      const context = createMockContext(mockADMUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.User,
        action: Permission.DELETE,
      });

      try {
        guard.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect((error as ForbiddenException).message).toContain('DELETE');
        expect((error as ForbiddenException).message).toContain('User');
      }
    });

    it('should check permission for Customer entity', () => {
      const context = createMockContext(mockADMUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.Customer,
        action: Permission.READ,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true); // ADM can read customers
    });

    it('should check permission for Opportunity entity', () => {
      const context = createMockContext(mockADMUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.Opportunity,
        action: Permission.CREATE,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true); // ADM can create opportunities
    });

    it('should check permission for Project entity', () => {
      const context = createMockContext(mockPLANUser);
      reflector.getAllAndOverride.mockReturnValue({
        entity: EntityType.Project,
        action: Permission.READ,
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true); // PLAN can read projects
    });
  });

  /**
   * Helper function to create mock execution context
   */
  function createMockContext(user: User | null): ExecutionContext {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user,
        }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  }
});
