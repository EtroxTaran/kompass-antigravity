/**
 * User Service Unit Tests
 *
 * Tests business logic for User management
 * Focus on validation, RBAC, role assignment, and Keycloak synchronization
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import { UserService } from '../user.service';

import type { AssignRolesDto } from '../dto/assign-roles.dto';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UpdatePrimaryRoleDto } from '../dto/update-primary-role.dto';
import type { UpdateUserDto } from '../dto/update-user.dto';
import type {
  IUserRepository,
  UserFilters,
} from '../user.repository.interface';
import type { User } from '@kompass/shared/types/entities/user';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;
  let keycloakAdminService: jest.Mocked<any>;
  let auditService: jest.Mocked<any>;

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

  const mockUser: User = {
    _id: 'user-123',
    _rev: '1-xyz',
    type: 'user',
    email: 'test@example.com',
    displayName: 'Test User',
    roles: [UserRole.ADM],
    primaryRole: UserRole.ADM,
    active: true,
    keycloakUserId: 'keycloak-user-123',
    createdBy: 'user-gf-001',
    createdAt: new Date(),
    modifiedBy: 'user-gf-001',
    modifiedAt: new Date(),
    version: 1,
  };

  beforeEach(async () => {
    // Mock repository
    repository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any;

    // Mock Keycloak Admin Service
    keycloakAdminService = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      assignRoles: jest.fn(),
      setPassword: jest.fn(),
      deleteUser: jest.fn(),
    };

    // Mock Audit Service
    auditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: repository,
        },
        {
          provide: 'IKeycloakAdminService',
          useValue: keycloakAdminService,
        },
        {
          provide: 'IAuditService',
          useValue: auditService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      displayName: 'New User',
      password: 'SecurePassword123!',
      roles: [UserRole.ADM],
      primaryRole: UserRole.ADM,
      active: true,
    };

    it('should create user successfully with GF role', async () => {
      repository.findByEmail.mockResolvedValue(null);
      keycloakAdminService.createUser.mockResolvedValue('keycloak-user-new');
      repository.create.mockResolvedValue({
        ...mockUser,
        _id: 'user-new',
        email: createUserDto.email,
        displayName: createUserDto.displayName,
        keycloakUserId: 'keycloak-user-new',
      });

      const result = await service.create(createUserDto, mockGFUser);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(keycloakAdminService.createUser).toHaveBeenCalledWith(
        createUserDto.email,
        createUserDto.password,
        createUserDto.displayName,
        createUserDto.roles
      );
      expect(repository.create).toHaveBeenCalled();
    });

    it('should create user successfully with ADMIN role', async () => {
      repository.findByEmail.mockResolvedValue(null);
      keycloakAdminService.createUser.mockResolvedValue('keycloak-user-new');
      repository.create.mockResolvedValue({
        ...mockUser,
        _id: 'user-new',
        email: createUserDto.email,
        displayName: createUserDto.displayName,
        keycloakUserId: 'keycloak-user-new',
      });

      const result = await service.create(createUserDto, mockADMINUser);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ForbiddenException if user does not have CREATE permission', async () => {
      await expect(service.create(createUserDto, mockADMUser)).rejects.toThrow(
        ForbiddenException
      );
      expect(repository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if primary role is not in roles array', async () => {
      const invalidDto: CreateUserDto = {
        ...createUserDto,
        roles: [UserRole.ADM],
        primaryRole: UserRole.GF, // Not in roles array
      };

      await expect(service.create(invalidDto, mockGFUser)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto, mockGFUser)).rejects.toThrow(
        ConflictException
      );
      expect(keycloakAdminService.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if Keycloak user creation fails', async () => {
      repository.findByEmail.mockResolvedValue(null);
      keycloakAdminService.createUser.mockRejectedValue(
        new Error('Keycloak error')
      );

      await expect(service.create(createUserDto, mockGFUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return all users for GF role with pagination', async () => {
      repository.findAll.mockResolvedValue([mockUser]);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockGFUser, undefined, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(20);
      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            page: 1,
            pageSize: 20,
          }),
        })
      );
      expect(repository.count).toHaveBeenCalledWith(undefined);
    });

    it('should return all users for ADMIN role with pagination', async () => {
      repository.findAll.mockResolvedValue([mockUser]);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockADMINUser, undefined, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should throw ForbiddenException if user does not have READ permission', async () => {
      await expect(service.findAll(mockADMUser)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should apply filters when provided', async () => {
      const filters: UserFilters = { search: 'test', role: UserRole.ADM };
      repository.findAll.mockResolvedValue([mockUser]);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockGFUser, filters, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          filters,
        })
      );
      expect(repository.count).toHaveBeenCalledWith(filters);
    });

    it('should apply sorting when provided', async () => {
      repository.findAll.mockResolvedValue([mockUser]);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(
        mockGFUser,
        undefined,
        1,
        20,
        'displayName',
        'desc'
      );

      expect(result.data).toHaveLength(1);
      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: expect.objectContaining({
            sortBy: 'displayName',
            sortOrder: 'desc',
          }),
        })
      );
    });

    it('should calculate pagination metadata correctly', async () => {
      const users = Array.from({ length: 10 }, (_, i) => ({
        ...mockUser,
        _id: `user-${i}`,
      }));
      repository.findAll.mockResolvedValue(users);
      repository.count.mockResolvedValue(45); // Total 45 users

      const result = await service.findAll(mockGFUser, undefined, 2, 10);

      expect(result.data).toHaveLength(10);
      expect(result.pagination.total).toBe(45);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalPages).toBe(5);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return user by ID for GF role', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('user-123', mockGFUser);

      expect(result).toBeDefined();
      expect(result._id).toBe('user-123');
      expect(repository.findById).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('user-999', mockGFUser)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user does not have READ permission', async () => {
      await expect(service.findById('user-123', mockADMUser)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      displayName: 'Updated Name',
      active: false,
    };

    it('should update user successfully for GF role', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.update.mockResolvedValue({
        ...mockUser,
        displayName: updateUserDto.displayName || mockUser.displayName,
        active: updateUserDto.active ?? mockUser.active,
      });
      keycloakAdminService.updateUser.mockResolvedValue(undefined);

      const result = await service.update(
        'user-123',
        updateUserDto,
        mockGFUser
      );

      expect(result.displayName).toBe(
        updateUserDto.displayName || mockUser.displayName
      );
      expect(result.active).toBe(updateUserDto.active ?? mockUser.active);
      expect(repository.update).toHaveBeenCalled();
      if (mockUser.keycloakUserId) {
        expect(keycloakAdminService.updateUser).toHaveBeenCalled();
      }
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('user-999', updateUserDto, mockGFUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have UPDATE permission', async () => {
      repository.findById.mockResolvedValue(mockUser);

      await expect(
        service.update('user-123', updateUserDto, mockADMUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should check email uniqueness when updating email', async () => {
      const emailUpdateDto: UpdateUserDto = {
        email: 'newemail@example.com',
      };
      repository.findById.mockResolvedValue(mockUser);
      repository.findByEmail.mockResolvedValue(null); // Email is available
      repository.update.mockResolvedValue({
        ...mockUser,
        email: emailUpdateDto.email || mockUser.email,
      });

      const result = await service.update(
        'user-123',
        emailUpdateDto,
        mockGFUser
      );

      expect(result.email).toBe(emailUpdateDto.email || mockUser.email);
      expect(repository.findByEmail).toHaveBeenCalledWith(emailUpdateDto.email);
    });

    it('should throw ConflictException if new email already exists', async () => {
      const emailUpdateDto: UpdateUserDto = {
        email: 'existing@example.com',
      };
      repository.findById.mockResolvedValue(mockUser);
      repository.findByEmail.mockResolvedValue({
        ...mockUser,
        _id: 'other-user',
      }); // Email already taken by another user

      await expect(
        service.update('user-123', emailUpdateDto, mockGFUser)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete user successfully for GF role', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue(undefined);
      keycloakAdminService.deleteUser.mockResolvedValue(undefined);

      await service.delete('user-123', mockGFUser);

      expect(repository.delete).toHaveBeenCalledWith('user-123');
      if (mockUser.keycloakUserId) {
        expect(keycloakAdminService.deleteUser).toHaveBeenCalledWith(
          mockUser.keycloakUserId
        );
      }
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('user-999', mockGFUser)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if user does not have DELETE permission', async () => {
      repository.findById.mockResolvedValue(mockUser);

      await expect(service.delete('user-123', mockADMUser)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('assignRoles', () => {
    const assignRolesDto: AssignRolesDto = {
      roles: [UserRole.ADM, UserRole.PLAN],
      primaryRole: UserRole.ADM,
    };

    it('should assign roles successfully for GF role', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.update.mockResolvedValue({
        ...mockUser,
        roles: assignRolesDto.roles,
        primaryRole: assignRolesDto.primaryRole,
      });
      keycloakAdminService.assignRoles.mockResolvedValue(undefined);

      const result = await service.assignRoles(
        'user-123',
        assignRolesDto,
        mockGFUser
      );

      expect(result.roles).toEqual(assignRolesDto.roles);
      expect(result.primaryRole).toBe(assignRolesDto.primaryRole);
      if (mockUser.keycloakUserId) {
        expect(keycloakAdminService.assignRoles).toHaveBeenCalledWith(
          mockUser.keycloakUserId,
          assignRolesDto.roles
        );
      }
    });

    it('should throw BadRequestException if primary role is not in roles array', async () => {
      const invalidDto: AssignRolesDto = {
        roles: [UserRole.ADM],
        primaryRole: UserRole.GF, // Not in roles array
      };
      repository.findById.mockResolvedValue(mockUser);

      await expect(
        service.assignRoles('user-123', invalidDto, mockGFUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.assignRoles('user-999', assignRolesDto, mockGFUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have UPDATE permission', async () => {
      repository.findById.mockResolvedValue(mockUser);

      await expect(
        service.assignRoles('user-123', assignRolesDto, mockADMUser)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updatePrimaryRole', () => {
    const updatePrimaryRoleDto: UpdatePrimaryRoleDto = {
      primaryRole: UserRole.PLAN,
    };

    it('should update primary role successfully for GF role', async () => {
      const userWithMultipleRoles: User = {
        ...mockUser,
        roles: [UserRole.ADM, UserRole.PLAN],
        primaryRole: UserRole.ADM,
      };
      repository.findById.mockResolvedValue(userWithMultipleRoles);
      repository.update.mockResolvedValue({
        ...userWithMultipleRoles,
        primaryRole: updatePrimaryRoleDto.primaryRole,
      });

      const result = await service.updatePrimaryRole(
        'user-123',
        updatePrimaryRoleDto,
        mockGFUser
      );

      expect(result.primaryRole).toBe(updatePrimaryRoleDto.primaryRole);
    });

    it('should throw BadRequestException if primary role is not in user roles', async () => {
      repository.findById.mockResolvedValue(mockUser); // User only has ADM role

      await expect(
        service.updatePrimaryRole('user-123', updatePrimaryRoleDto, mockGFUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updatePrimaryRole('user-999', updatePrimaryRoleDto, mockGFUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have UPDATE permission', async () => {
      repository.findById.mockResolvedValue(mockUser);

      await expect(
        service.updatePrimaryRole('user-123', updatePrimaryRoleDto, mockADMUser)
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
