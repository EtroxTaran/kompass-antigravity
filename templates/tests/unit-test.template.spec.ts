/**
 * Unit Test Template for KOMPASS
 * 
 * Testing: {{ENTITY_NAME}}Service
 * Framework: Jest
 * Coverage Target: 90% for services
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { {{ENTITY_NAME}}Service } from './{{ENTITY_NAME_LOWER}}.service';
import { {{ENTITY_NAME}}Repository } from './{{ENTITY_NAME_LOWER}}.repository';
import { RbacService } from '../common/services/rbac.service';
import { ValidationService } from '../common/services/validation.service';
import { AuditService } from '../common/services/audit.service';
import type { {{ENTITY_NAME}} } from '@kompass/shared';
import type { User } from '../auth/user.entity';

describe('{{ENTITY_NAME}}Service', () => {
  let service: {{ENTITY_NAME}}Service;
  let repository: jest.Mocked<{{ENTITY_NAME}}Repository>;
  let rbacService: jest.Mocked<RbacService>;
  let validationService: jest.Mocked<ValidationService>;
  let auditService: jest.Mocked<AuditService>;

  // Mock data
  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'ADM',
    firstName: 'Test',
    lastName: 'User',
  };

  const mock{{ENTITY_NAME}}: {{ENTITY_NAME}} = {
    _id: '{{ENTITY_NAME_LOWER}}-123',
    _rev: '1-abc',
    type: '{{ENTITY_NAME_LOWER}}',
    // TODO: Add your entity fields
    name: 'Test {{ENTITY_NAME}}',
    owner: 'user-123',
    createdBy: 'user-123',
    createdAt: new Date('2024-01-01'),
    modifiedBy: 'user-123',
    modifiedAt: new Date('2024-01-01'),
    version: 1,
  };

  beforeEach(async () => {
    // Create mocks
    const mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByOwner: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockRbacService = {
      hasPermission: jest.fn(),
    };

    const mockValidationService = {
      validate: jest.fn(),
    };

    const mockAuditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {{ENTITY_NAME}}Service,
        {
          provide: {{ENTITY_NAME}}Repository,
          useValue: mockRepository,
        },
        {
          provide: RbacService,
          useValue: mockRbacService,
        },
        {
          provide: ValidationService,
          useValue: mockValidationService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<{{ENTITY_NAME}}Service>({{ENTITY_NAME}}Service);
    repository = module.get({{ENTITY_NAME}}Repository);
    rbacService = module.get(RbacService);
    validationService = module.get(ValidationService);
    auditService = module.get(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return {{ENTITY_NAME}} when found and user has permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      repository.findById.mockResolvedValue(mock{{ENTITY_NAME}});

      // Act
      const result = await service.findById('{{ENTITY_NAME_LOWER}}-123', mockUser);

      // Assert
      expect(result).toEqual(mock{{ENTITY_NAME}});
      expect(rbacService.hasPermission).toHaveBeenCalledWith('ADM', '{{ENTITY_NAME}}', 'READ');
      expect(repository.findById).toHaveBeenCalledWith('{{ENTITY_NAME_LOWER}}-123');
    });

    it('should throw NotFoundException when {{ENTITY_NAME}} not found', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      repository.findById.mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        service.findById('non-existent', mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user lacks READ permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(false);

      // Act & Assert
      await expect(
        service.findById('{{ENTITY_NAME_LOWER}}-123', mockUser)
      ).rejects.toThrow(ForbiddenException);
      
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when ADM tries to access others {{ENTITY_NAME}}', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      const other{{ENTITY_NAME}} = { ...mock{{ENTITY_NAME}}, owner: 'other-user' };
      repository.findById.mockResolvedValue(other{{ENTITY_NAME}});

      // Act & Assert
      await expect(
        service.findById('{{ENTITY_NAME_LOWER}}-123', mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow GF to access any {{ENTITY_NAME}}', async () => {
      // Arrange
      const gfUser = { ...mockUser, role: 'GF' };
      rbacService.hasPermission.mockReturnValue(true);
      const other{{ENTITY_NAME}} = { ...mock{{ENTITY_NAME}}, owner: 'other-user' };
      repository.findById.mockResolvedValue(other{{ENTITY_NAME}});

      // Act
      const result = await service.findById('{{ENTITY_NAME_LOWER}}-123', gfUser);

      // Assert
      expect(result).toEqual(other{{ENTITY_NAME}});
    });
  });

  describe('create', () => {
    const createDto = {
      name: 'New {{ENTITY_NAME}}',
      // TODO: Add your DTO fields
    };

    it('should create {{ENTITY_NAME}} with valid data', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      validationService.validate.mockResolvedValue(undefined);
      repository.create.mockResolvedValue(mock{{ENTITY_NAME}});

      // Act
      const result = await service.create(createDto, mockUser);

      // Assert
      expect(result).toEqual(mock{{ENTITY_NAME}});
      expect(rbacService.hasPermission).toHaveBeenCalledWith('ADM', '{{ENTITY_NAME}}', 'CREATE');
      expect(validationService.validate).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          entityType: '{{ENTITY_NAME}}',
        })
      );
    });

    it('should throw ForbiddenException when user lacks CREATE permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(false);

      // Act & Assert
      await expect(
        service.create(createDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
      
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should validate DTO before creating', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      validationService.validate.mockRejectedValue(
        new BadRequestException('Validation failed')
      );

      // Act & Assert
      await expect(
        service.create(createDto, mockUser)
      ).rejects.toThrow(BadRequestException);
      
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should set audit fields correctly', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      validationService.validate.mockResolvedValue(undefined);
      
      let capturedEntity: {{ENTITY_NAME}};
      repository.create.mockImplementation(async (entity) => {
        capturedEntity = entity;
        return entity;
      });

      // Act
      await service.create(createDto, mockUser);

      // Assert
      expect(capturedEntity).toMatchObject({
        createdBy: 'user-123',
        modifiedBy: 'user-123',
        version: 1,
      });
      expect(capturedEntity._id).toMatch(/^{{ENTITY_NAME_LOWER}}-/);
      expect(capturedEntity.createdAt).toBeInstanceOf(Date);
      expect(capturedEntity.modifiedAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated {{ENTITY_NAME}}',
      _rev: '1-abc',
    };

    it('should update {{ENTITY_NAME}} when user has permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      validationService.validate.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(mock{{ENTITY_NAME}});
      repository.update.mockResolvedValue({ ...mock{{ENTITY_NAME}}, ...updateDto });

      // Act
      const result = await service.update('{{ENTITY_NAME_LOWER}}-123', updateDto, mockUser);

      // Assert
      expect(result.name).toBe('Updated {{ENTITY_NAME}}');
      expect(repository.update).toHaveBeenCalledWith(
        '{{ENTITY_NAME_LOWER}}-123',
        expect.objectContaining(updateDto),
        'user-123'
      );
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATE',
          entityType: '{{ENTITY_NAME}}',
        })
      );
    });

    it('should throw ForbiddenException when user lacks UPDATE permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(false);

      // Act & Assert
      await expect(
        service.update('{{ENTITY_NAME_LOWER}}-123', updateDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should prevent updating immutable fields without GF approval', async () => {
      // Arrange
      const finalized{{ENTITY_NAME}} = {
        ...mock{{ENTITY_NAME}},
        finalized: true,
        immutableFields: ['name'],
      };
      
      rbacService.hasPermission.mockReturnValue(true);
      validationService.validate.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(finalized{{ENTITY_NAME}});

      // Act & Assert
      await expect(
        service.update('{{ENTITY_NAME_LOWER}}-123', updateDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete {{ENTITY_NAME}} when user has permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(true);
      repository.findById.mockResolvedValue(mock{{ENTITY_NAME}});
      repository.softDelete.mockResolvedValue(mock{{ENTITY_NAME}});

      // Act
      await service.delete('{{ENTITY_NAME_LOWER}}-123', mockUser);

      // Assert
      expect(repository.softDelete).toHaveBeenCalledWith('{{ENTITY_NAME_LOWER}}-123', 'user-123');
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DELETE',
          entityType: '{{ENTITY_NAME}}',
        })
      );
    });

    it('should throw ForbiddenException when user lacks DELETE permission', async () => {
      // Arrange
      rbacService.hasPermission.mockReturnValue(false);

      // Act & Assert
      await expect(
        service.delete('{{ENTITY_NAME_LOWER}}-123', mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should prevent deleting finalized {{ENTITY_NAME}}', async () => {
      // Arrange
      const finalized{{ENTITY_NAME}} = { ...mock{{ENTITY_NAME}}, finalized: true };
      rbacService.hasPermission.mockReturnValue(true);
      repository.findById.mockResolvedValue(finalized{{ENTITY_NAME}});

      // Act & Assert
      await expect(
        service.delete('{{ENTITY_NAME_LOWER}}-123', mockUser)
      ).rejects.toThrow(BadRequestException);
    });
  });
});

