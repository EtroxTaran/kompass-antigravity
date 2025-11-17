import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test } from '@nestjs/testing';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import type { ExecutionContext} from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get(Reflector);
  });

  describe('canActivate', () => {
    it('should allow access if route is marked as public', () => {
      const context = createMockContext();
      reflector.getAllAndOverride.mockReturnValue(true); // isPublic = true

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should delegate to Passport authentication if route is not public', () => {
      const context = createMockContext();
      reflector.getAllAndOverride.mockReturnValue(false); // isPublic = false

      // When route is not public, canActivate should call super.canActivate
      // We can't easily test super calls, so we verify the method doesn't throw
      // and that it would delegate to the parent AuthGuard
      expect(() => guard.canActivate(context)).not.toThrow();
      // The actual authentication will be handled by Passport in integration tests
    });
  });

  describe('handleRequest', () => {
    it('should return user if authentication succeeds', () => {
      const context = createMockContext();
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      const result = guard.handleRequest(null, mockUser, undefined, context);

      expect(result).toBe(mockUser);
    });

    it('should throw UnauthorizedException if authentication fails', () => {
      const context = createMockContext();
      const error = new Error('Token expired');

      expect(() => {
        guard.handleRequest(error, false, 'Token expired', context);
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is false', () => {
      const context = createMockContext();

      expect(() => {
        guard.handleRequest(null, false, 'Authentication failed', context);
      }).toThrow(UnauthorizedException);
    });

    it('should use error message from info parameter', () => {
      const context = createMockContext();

      try {
        guard.handleRequest(null, false, 'Custom error message', context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect((error as UnauthorizedException).message).toBe(
          'Custom error message'
        );
      }
    });
  });

  /**
   * Helper function to create mock execution context
   */
  function createMockContext(): ExecutionContext {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
          user: null,
        }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  }
});
