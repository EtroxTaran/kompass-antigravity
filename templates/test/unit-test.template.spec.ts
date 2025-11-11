/**
 * TEMPLATE: Unit Test (Jest)
 * 
 * Usage: Copy this template when creating unit tests
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. Test files MUST be colocated with source (same directory)
 * 2. Coverage target: 80% minimum, 90% for business logic
 * 3. Mock all external dependencies
 * 4. Test naming: describe() for grouping, it() for test cases
 * 5. Follow AAA pattern: Arrange, Act, Assert
 */

import { Test, TestingModule } from '@nestjs/testing';
import { {{EntityName}}Service } from './{{entity-name}}.service';
import { I{{EntityName}}Repository } from './{{entity-name}}.repository.interface';
import { RbacService } from '../auth/services/rbac.service';
import { ValidationService } from '../shared/services/validation.service';
import { AuditService } from '../shared/services/audit.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { {{EntityName}} } from './entities/{{entity-name}}.entity';
import { User } from '../auth/entities/user.entity';

describe('{{EntityName}}Service', () => {
  let service: {{EntityName}}Service;
  let repository: jest.Mocked<I{{EntityName}}Repository>;
  let rbacService: jest.Mocked<RbacService>;
  let validationService: jest.Mocked<ValidationService>;
  let auditService: jest.Mocked<AuditService>;

  // ============================================================================
  // TEST SETUP
  // ============================================================================

  beforeEach(async () => {
    // Create mock implementations
    const mockRepository: jest.Mocked<I{{EntityName}}Repository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockRbacService = {
      checkPermission: jest.fn(),
    };

    const mockValidationService = {
      validate: jest.fn(),
    };

    const mockAuditService = {
      log: jest.fn(),
    };

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {{EntityName}}Service,
        {
          provide: 'I{{EntityName}}Repository',
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

    service = module.get<{{EntityName}}Service>({{EntityName}}Service);
    repository = module.get('I{{EntityName}}Repository');
    rbacService = module.get(RbacService);
    validationService = module.get(ValidationService);
    auditService = module.get(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // FIND BY ID TESTS
  // ============================================================================

  describe('findById', () => {
    const mockUser: User = {
      id: 'user-123',
      role: 'ADM',
      email: 'test@example.com',
    } as User;

    const mock{{EntityName}}: {{EntityName}} = {
      _id: '{{entityName}}-123',
      _rev: '1-abc',
      type: '{{entityName}}',
      exampleField: 'Test Value',
      createdBy: 'user-123',
      createdAt: new Date('2024-01-01'),
      modifiedBy: 'user-123',
      modifiedAt: new Date('2024-01-01'),
      version: 1,
    };

    it('should return {{entityName}} when found and user has permission', async () => {
      // Arrange
      rbacService.checkPermission.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(mock{{EntityName}});

      // Act
      const result = await service.findById('{{entityName}}-123', mockUser);

      // Assert
      expect(result).toEqual(mock{{EntityName}});
      expect(rbacService.checkPermission).toHaveBeenCalledWith(
        mockUser,
        '{{EntityName}}',
        'READ'
      );
      expect(repository.findById).toHaveBeenCalledWith('{{entityName}}-123');
    });

    it('should throw NotFoundException when {{entityName}} not found', async () => {
      // Arrange
      rbacService.checkPermission.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findById('non-existent', mockUser)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findById('non-existent', mockUser)
      ).rejects.toThrow('{{EntityName}} with ID non-existent not found');
    });

    it('should throw ForbiddenException when user lacks permission', async () => {
      // Arrange
      rbacService.checkPermission.mockRejectedValue(
        new ForbiddenException('Insufficient permissions')
      );

      // Act & Assert
      await expect(
        service.findById('{{entityName}}-123', mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should filter fields based on user role', async () => {
      // Arrange
      const mockWithSensitiveData: {{EntityName}} = {
        ...mock{{EntityName}},
        profitMargin: 25, // Sensitive field
      };
      rbacService.checkPermission.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(mockWithSensitiveData);

      // Act
      const result = await service.findById('{{entityName}}-123', mockUser);

      // Assert - ADM should not see profitMargin
      expect(result.profitMargin).toBeUndefined();
    });
  });

  // ============================================================================
  // CREATE TESTS
  // ============================================================================

  describe('create', () => {
    const mockUser: User = {
      id: 'user-123',
      role: 'ADM',
      email: 'test@example.com',
    } as User;

    const createDto = {
      exampleField: 'Test Value',
      email: 'test@example.com',
    };

    it('should create {{entityName}} with valid data', async () => {
      // Arrange
      rbacService.checkPermission.mockResolvedValue(undefined);
      validationService.validate.mockResolvedValue(undefined);
      repository.create.mockResolvedValue({
        _id: '{{entityName}}-new',
        _rev: '1-abc',
        type: '{{entityName}}',
        ...createDto,
        createdBy: mockUser.id,
        createdAt: expect.any(Date),
        modifiedBy: mockUser.id,
        modifiedAt: expect.any(Date),
        version: 1,
      });

      // Act
      const result = await service.create(createDto, mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(result.exampleField).toBe('Test Value');
      expect(result.createdBy).toBe(mockUser.id);
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          entityType: '{{EntityName}}',
        })
      );
    });

    it('should throw ValidationException for invalid data', async () => {
      // Arrange
      rbacService.checkPermission.mockResolvedValue(undefined);
      validationService.validate.mockRejectedValue(
        new ValidationException('Validation failed')
      );

      // Act & Assert
      await expect(
        service.create(createDto, mockUser)
      ).rejects.toThrow(ValidationException);
    });

    it('should throw ForbiddenException when user lacks CREATE permission', async () => {
      // Arrange
      rbacService.checkPermission.mockRejectedValue(
        new ForbiddenException('Cannot create {{entityName}}')
      );

      // Act & Assert
      await expect(
        service.create(createDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ============================================================================
  // UPDATE TESTS
  // ============================================================================

  describe('update', () => {
    const mockUser: User = {
      id: 'user-123',
      role: 'ADM',
      email: 'test@example.com',
    } as User;

    const existing{{EntityName}}: {{EntityName}} = {
      _id: '{{entityName}}-123',
      _rev: '1-abc',
      type: '{{entityName}}',
      exampleField: 'Original Value',
      createdBy: 'user-123',
      createdAt: new Date('2024-01-01'),
      modifiedBy: 'user-123',
      modifiedAt: new Date('2024-01-01'),
      version: 1,
    };

    const updateDto = {
      exampleField: 'Updated Value',
    };

    it('should update {{entityName}} successfully', async () => {
      // Arrange
      rbacService.checkPermission.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(existing{{EntityName}});
      validationService.validate.mockResolvedValue(undefined);
      repository.update.mockResolvedValue({
        ...existing{{EntityName}},
        ...updateDto,
        modifiedBy: mockUser.id,
        modifiedAt: expect.any(Date),
        version: 2,
      });

      // Act
      const result = await service.update('{{entityName}}-123', updateDto, mockUser);

      // Assert
      expect(result.exampleField).toBe('Updated Value');
      expect(result.version).toBe(2);
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when modifying immutable finalized entity', async () => {
      // Arrange
      const finalizedEntity: {{EntityName}} = {
        ...existing{{EntityName}},
        finalized: true,
        immutableAt: new Date(),
      };
      rbacService.checkPermission.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(finalizedEntity);

      // Act & Assert
      await expect(
        service.update('{{entityName}}-123', updateDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update('{{entityName}}-123', updateDto, mockUser)
      ).rejects.toThrow(/finalized/);
    });
  });

  // ============================================================================
  // DELETE TESTS
  // ============================================================================

  describe('delete', () => {
    const mockUser: User = {
      id: 'user-123',
      role: 'ADMIN',
      email: 'admin@example.com',
    } as User;

    it('should soft delete {{entityName}}', async () => {
      // Arrange
      const mock{{EntityName}}: {{EntityName}} = {
        _id: '{{entityName}}-123',
        _rev: '1-abc',
        type: '{{entityName}}',
        exampleField: 'Test',
        createdBy: 'user-123',
        createdAt: new Date(),
        modifiedBy: 'user-123',
        modifiedAt: new Date(),
        version: 1,
      };
      rbacService.checkPermission.mockResolvedValue(undefined);
      repository.findById.mockResolvedValue(mock{{EntityName}});
      repository.softDelete.mockResolvedValue(undefined);

      // Act
      await service.delete('{{entityName}}-123', mockUser);

      // Assert
      expect(repository.softDelete).toHaveBeenCalledWith('{{entityName}}-123', mockUser.id);
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DELETE',
        })
      );
    });
  });
});

// ============================================================================
// HELPER CLASSES
// ============================================================================

class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

