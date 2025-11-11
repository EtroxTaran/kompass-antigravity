import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { {{ENTITY_NAME}}Repository } from './{{ENTITY_NAME_LOWER}}.repository';
import type { {{ENTITY_NAME}} } from '@kompass/shared';
import type { User } from '../auth/user.entity';
import type { Create{{ENTITY_NAME}}Dto } from './dto/create-{{ENTITY_NAME_LOWER}}.dto';
import type { Update{{ENTITY_NAME}}Dto } from './dto/update-{{ENTITY_NAME_LOWER}}.dto';

/**
 * Service for {{ENTITY_NAME}} business logic
 * 
 * Implements:
 * - CRUD operations
 * - RBAC permission checks
 * - Business rule validation
 * - Audit trail logging
 */
@Injectable()
export class {{ENTITY_NAME}}Service {
  constructor(
    private readonly repository: {{ENTITY_NAME}}Repository,
    private readonly rbacService: RbacService,
    private readonly validationService: ValidationService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Find {{ENTITY_NAME}} by ID with RBAC filtering
   */
  async findById(id: string, currentUser: User): Promise<{{ENTITY_NAME}}> {
    // Check entity-level permission
    if (!this.rbacService.hasPermission(currentUser.role, '{{ENTITY_NAME}}', 'READ')) {
      throw new ForbiddenException('You do not have permission to view {{ENTITY_NAME}}s');
    }

    const entity = await this.repository.findById(id);

    // Check record-level permission (ownership)
    if (!this.canAccessRecord(entity, currentUser)) {
      throw new ForbiddenException('You can only view your own {{ENTITY_NAME}}s');
    }

    // Filter fields based on role
    return this.filterFieldsByRole(entity, currentUser.role);
  }

  /**
   * Find all {{ENTITY_NAME}}s accessible to the current user
   */
  async findAll(currentUser: User): Promise<{{ENTITY_NAME}}[]> {
    // Check permission
    if (!this.rbacService.hasPermission(currentUser.role, '{{ENTITY_NAME}}', 'READ')) {
      throw new ForbiddenException('You do not have permission to view {{ENTITY_NAME}}s');
    }

    let entities: {{ENTITY_NAME}}[];

    // Apply record-level filtering based on role
    if (currentUser.role === 'ADM') {
      // ADM can only see their own records
      entities = await this.repository.findByOwner(currentUser.id);
    } else if (['GF', 'ADMIN'].includes(currentUser.role)) {
      // GF and ADMIN can see all records
      entities = await this.repository.findAll();
    } else {
      // Role-specific filtering logic
      entities = await this.repository.findAll({
        selector: {
          type: '{{ENTITY_NAME_LOWER}}',
          // Add role-specific filters
        },
      });
    }

    // Filter fields based on role
    return entities.map((entity) => this.filterFieldsByRole(entity, currentUser.role));
  }

  /**
   * Create a new {{ENTITY_NAME}}
   */
  async create(
    createDto: Create{{ENTITY_NAME}}Dto,
    currentUser: User
  ): Promise<{{ENTITY_NAME}}> {
    // Check permission
    if (!this.rbacService.hasPermission(currentUser.role, '{{ENTITY_NAME}}', 'CREATE')) {
      throw new ForbiddenException('You do not have permission to create {{ENTITY_NAME}}s');
    }

    // Validate DTO
    await this.validationService.validate(createDto, Create{{ENTITY_NAME}}Dto);

    // Apply business rules
    await this.validateBusinessRules(createDto);

    // Create entity with audit fields
    const entity: Omit<{{ENTITY_NAME}}, '_rev'> = {
      _id: `{{ENTITY_NAME_LOWER}}-${crypto.randomUUID()}`,
      type: '{{ENTITY_NAME_LOWER}}',
      ...createDto,
      createdBy: currentUser.id,
      createdAt: new Date(),
      modifiedBy: currentUser.id,
      modifiedAt: new Date(),
      version: 1,
    };

    // Save to repository
    const created = await this.repository.create(entity);

    // Log audit trail
    await this.auditService.log({
      action: 'CREATE',
      entityType: '{{ENTITY_NAME}}',
      entityId: created._id,
      userId: currentUser.id,
      timestamp: new Date(),
      metadata: {
        // Add relevant metadata
      },
    });

    return created;
  }

  /**
   * Update an existing {{ENTITY_NAME}}
   */
  async update(
    id: string,
    updateDto: Update{{ENTITY_NAME}}Dto,
    currentUser: User
  ): Promise<{{ENTITY_NAME}}> {
    // Check permission
    if (!this.rbacService.hasPermission(currentUser.role, '{{ENTITY_NAME}}', 'UPDATE')) {
      throw new ForbiddenException('You do not have permission to update {{ENTITY_NAME}}s');
    }

    // Get existing entity
    const existing = await this.repository.findById(id);

    // Check record-level permission
    if (!this.canModifyRecord(existing, currentUser)) {
      throw new ForbiddenException('You can only update your own {{ENTITY_NAME}}s');
    }

    // Validate DTO
    await this.validationService.validate(updateDto, Update{{ENTITY_NAME}}Dto);

    // Apply business rules
    await this.validateBusinessRules({ ...existing, ...updateDto });

    // Check for immutable fields (GoBD compliance)
    if (existing.finalized) {
      this.validateImmutableFields(existing, updateDto, currentUser);
    }

    // Update entity
    const updated = await this.repository.update(id, updateDto, currentUser.id);

    // Log audit trail
    await this.auditService.log({
      action: 'UPDATE',
      entityType: '{{ENTITY_NAME}}',
      entityId: id,
      userId: currentUser.id,
      timestamp: new Date(),
      changes: this.detectChanges(existing, updateDto),
    });

    return updated;
  }

  /**
   * Delete a {{ENTITY_NAME}}
   */
  async delete(id: string, currentUser: User): Promise<void> {
    // Check permission
    if (!this.rbacService.hasPermission(currentUser.role, '{{ENTITY_NAME}}', 'DELETE')) {
      throw new ForbiddenException('You do not have permission to delete {{ENTITY_NAME}}s');
    }

    // Get existing entity
    const existing = await this.repository.findById(id);

    // Check record-level permission
    if (!this.canModifyRecord(existing, currentUser)) {
      throw new ForbiddenException('You can only delete your own {{ENTITY_NAME}}s');
    }

    // Check if entity can be deleted (business rules)
    if (existing.finalized) {
      throw new BadRequestException('Cannot delete finalized {{ENTITY_NAME}}s');
    }

    // Soft delete (recommended for GoBD compliance)
    await this.repository.softDelete(id, currentUser.id);

    // Log audit trail
    await this.auditService.log({
      action: 'DELETE',
      entityType: '{{ENTITY_NAME}}',
      entityId: id,
      userId: currentUser.id,
      timestamp: new Date(),
    });
  }

  // ==================== Private Helper Methods ====================

  /**
   * Check if user can access this record (ownership check)
   */
  private canAccessRecord(entity: {{ENTITY_NAME}}, user: User): boolean {
    // GF and ADMIN can access all records
    if (['GF', 'ADMIN'].includes(user.role)) {
      return true;
    }

    // ADM can only access their own records
    if (user.role === 'ADM') {
      return entity.owner === user.id;
    }

    // Add role-specific logic
    return true;
  }

  /**
   * Check if user can modify this record
   */
  private canModifyRecord(entity: {{ENTITY_NAME}}, user: User): boolean {
    // GF and ADMIN can modify all records
    if (['GF', 'ADMIN'].includes(user.role)) {
      return true;
    }

    // Owner can modify their own records
    return entity.owner === user.id;
  }

  /**
   * Filter entity fields based on user role (RBAC field-level)
   */
  private filterFieldsByRole(entity: {{ENTITY_NAME}}, role: string): {{ENTITY_NAME}} {
    const filtered = { ...entity };

    // ADM role: Hide financial fields
    if (role === 'ADM') {
      // Remove sensitive fields
      // delete filtered.financialField;
    }

    return filtered;
  }

  /**
   * Validate business rules
   */
  private async validateBusinessRules(data: Partial<{{ENTITY_NAME}}>): Promise<void> {
    // TODO: Implement business rule validation
    // Example:
    // if (data.status === 'Lost' && !data.lostReason) {
    //   throw new BadRequestException('Lost {{ENTITY_NAME}}s must have a reason');
    // }
  }

  /**
   * Validate immutable fields (GoBD compliance)
   */
  private validateImmutableFields(
    existing: {{ENTITY_NAME}},
    updates: Partial<{{ENTITY_NAME}}>,
    user: User
  ): void {
    if (!existing.immutableFields) {
      return;
    }

    const attemptedChanges = existing.immutableFields.filter(
      (field) => updates[field] !== undefined && updates[field] !== existing[field]
    );

    if (attemptedChanges.length > 0) {
      if (user.role !== 'GF') {
        throw new ForbiddenException(
          `Cannot modify immutable fields: ${attemptedChanges.join(', ')}. Requires GF approval.`
        );
      }

      // Log correction for GoBD
      attemptedChanges.forEach((field) => {
        existing.changeLog = existing.changeLog || [];
        existing.changeLog.push({
          field,
          oldValue: existing[field],
          newValue: updates[field],
          changedBy: user.id,
          changedAt: new Date(),
          reason: 'Correction by GF',
          approvedBy: user.id,
        });
      });
    }
  }

  /**
   * Detect changes between old and new entity
   */
  private detectChanges(
    old: {{ENTITY_NAME}},
    updates: Partial<{{ENTITY_NAME}}>
  ): Array<{ field: string; oldValue: unknown; newValue: unknown }> {
    const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = [];

    Object.keys(updates).forEach((key) => {
      if (old[key] !== updates[key]) {
        changes.push({
          field: key,
          oldValue: old[key],
          newValue: updates[key],
        });
      }
    });

    return changes;
  }
}
