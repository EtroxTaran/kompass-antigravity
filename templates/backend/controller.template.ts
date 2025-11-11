import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { {{ENTITY_NAME}}Service } from './{{ENTITY_NAME_LOWER}}.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '../auth/user.entity';
import type { Create{{ENTITY_NAME}}Dto } from './dto/create-{{ENTITY_NAME_LOWER}}.dto';
import type { Update{{ENTITY_NAME}}Dto } from './dto/update-{{ENTITY_NAME_LOWER}}.dto';
import type { {{ENTITY_NAME}}ResponseDto } from './dto/{{ENTITY_NAME_LOWER}}-response.dto';

/**
 * Controller for {{ENTITY_NAME}} endpoints
 * 
 * All endpoints require:
 * - JWT authentication (JwtAuthGuard)
 * - RBAC permission checks (RbacGuard)
 * 
 * Base path: /api/v1/{{ENTITY_NAME_PLURAL_LOWER}}
 */
@Controller('api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
@ApiTags('{{ENTITY_NAME_PLURAL}}')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class {{ENTITY_NAME}}Controller {
  constructor(private readonly {{ENTITY_NAME_LOWER}}Service: {{ENTITY_NAME}}Service) {}

  /**
   * Get all {{ENTITY_NAME}}s accessible to current user
   * 
   * @returns Array of {{ENTITY_NAME}}s filtered by RBAC permissions
   */
  @Get()
  @RequirePermission('{{ENTITY_NAME}}', 'READ')
  @ApiOperation({ 
    summary: 'List all {{ENTITY_NAME}}s',
    description: 'Returns all {{ENTITY_NAME}}s accessible to the current user based on RBAC permissions'
  })
  @ApiResponse({ 
    status: 200, 
    description: '{{ENTITY_NAME}}s retrieved successfully',
    type: [{{ENTITY_NAME}}ResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token missing or invalid'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Insufficient permissions'
  })
  async findAll(
    @CurrentUser() user: User
  ): Promise<{{ENTITY_NAME}}ResponseDto[]> {
    const entities = await this.{{ENTITY_NAME_LOWER}}Service.findAll(user);
    return entities.map(this.toResponseDto);
  }

  /**
   * Get a single {{ENTITY_NAME}} by ID
   * 
   * @param id - {{ENTITY_NAME}} ID
   * @returns {{ENTITY_NAME}} if found and user has access
   */
  @Get(':id')
  @RequirePermission('{{ENTITY_NAME}}', 'READ')
  @ApiOperation({ 
    summary: 'Get {{ENTITY_NAME}} by ID',
    description: 'Returns a single {{ENTITY_NAME}} if user has access'
  })
  @ApiParam({
    name: 'id',
    description: '{{ENTITY_NAME}} ID',
    example: '{{ENTITY_NAME_LOWER}}-uuid-here'
  })
  @ApiResponse({ 
    status: 200, 
    description: '{{ENTITY_NAME}} found',
    type: {{ENTITY_NAME}}ResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not Found - {{ENTITY_NAME}} does not exist'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User cannot access this {{ENTITY_NAME}}'
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<{{ENTITY_NAME}}ResponseDto> {
    const entity = await this.{{ENTITY_NAME_LOWER}}Service.findById(id, user);
    return this.toResponseDto(entity);
  }

  /**
   * Create a new {{ENTITY_NAME}}
   * 
   * @param createDto - {{ENTITY_NAME}} data
   * @returns Created {{ENTITY_NAME}}
   */
  @Post()
  @RequirePermission('{{ENTITY_NAME}}', 'CREATE')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new {{ENTITY_NAME}}',
    description: 'Creates a new {{ENTITY_NAME}} with audit trail'
  })
  @ApiResponse({ 
    status: 201, 
    description: '{{ENTITY_NAME}} created successfully',
    type: {{ENTITY_NAME}}ResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Validation failed'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User cannot create {{ENTITY_NAME}}s'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - {{ENTITY_NAME}} already exists'
  })
  async create(
    @Body() createDto: Create{{ENTITY_NAME}}Dto,
    @CurrentUser() user: User
  ): Promise<{{ENTITY_NAME}}ResponseDto> {
    const entity = await this.{{ENTITY_NAME_LOWER}}Service.create(createDto, user);
    return this.toResponseDto(entity);
  }

  /**
   * Update an existing {{ENTITY_NAME}}
   * 
   * @param id - {{ENTITY_NAME}} ID
   * @param updateDto - Updated {{ENTITY_NAME}} data
   * @returns Updated {{ENTITY_NAME}}
   */
  @Put(':id')
  @RequirePermission('{{ENTITY_NAME}}', 'UPDATE')
  @ApiOperation({ 
    summary: 'Update {{ENTITY_NAME}}',
    description: 'Updates an existing {{ENTITY_NAME}} with audit trail'
  })
  @ApiParam({
    name: 'id',
    description: '{{ENTITY_NAME}} ID',
    example: '{{ENTITY_NAME_LOWER}}-uuid-here'
  })
  @ApiResponse({ 
    status: 200, 
    description: '{{ENTITY_NAME}} updated successfully',
    type: {{ENTITY_NAME}}ResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Validation failed'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not Found - {{ENTITY_NAME}} does not exist'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User cannot update this {{ENTITY_NAME}}'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Revision mismatch or concurrent modification'
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Update{{ENTITY_NAME}}Dto,
    @CurrentUser() user: User
  ): Promise<{{ENTITY_NAME}}ResponseDto> {
    const entity = await this.{{ENTITY_NAME_LOWER}}Service.update(id, updateDto, user);
    return this.toResponseDto(entity);
  }

  /**
   * Delete a {{ENTITY_NAME}}
   * 
   * @param id - {{ENTITY_NAME}} ID
   */
  @Delete(':id')
  @RequirePermission('{{ENTITY_NAME}}', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete {{ENTITY_NAME}}',
    description: 'Soft deletes a {{ENTITY_NAME}} (GoBD compliant)'
  })
  @ApiParam({
    name: 'id',
    description: '{{ENTITY_NAME}} ID',
    example: '{{ENTITY_NAME_LOWER}}-uuid-here'
  })
  @ApiResponse({ 
    status: 204, 
    description: '{{ENTITY_NAME}} deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not Found - {{ENTITY_NAME}} does not exist'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User cannot delete this {{ENTITY_NAME}}'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Cannot delete finalized {{ENTITY_NAME}}'
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<void> {
    await this.{{ENTITY_NAME_LOWER}}Service.delete(id, user);
  }

  // ==================== Private Helper Methods ====================

  /**
   * Convert entity to response DTO (hide internal fields)
   */
  private toResponseDto(entity: {{ENTITY_NAME}}): {{ENTITY_NAME}}ResponseDto {
    return {
      id: entity._id,
      // TODO: Map your entity fields to response DTO
      // Example:
      // name: entity.name,
      // description: entity.description,
      createdAt: entity.createdAt,
      modifiedAt: entity.modifiedAt,
    };
  }
}
