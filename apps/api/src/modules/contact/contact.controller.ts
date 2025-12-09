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
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * GET /api/v1/contacts
   * List all contacts (paginated)
   */
  @Get('contacts')
  @Permissions({ entity: 'Contact', action: 'READ' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.contactService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
    });
  }

  /**
   * GET /api/v1/customers/:customerId/contacts
   * List contacts for a specific customer
   */
  @Get('customers/:customerId/contacts')
  @Permissions({ entity: 'Contact', action: 'READ' })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contactService.findByCustomer(customerId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/contacts/:id
   * Get a specific contact by ID
   */
  @Get('contacts/:id')
  @Permissions({ entity: 'Contact', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.contactService.findById(id);
  }

  /**
   * POST /api/v1/contacts
   * Create a new contact
   */
  @Post('contacts')
  @Permissions({ entity: 'Contact', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateContactDto, @CurrentUser() user: any) {
    return this.contactService.create(dto, user);
  }

  /**
   * PUT /api/v1/contacts/:id
   * Update an existing contact
   */
  @Put('contacts/:id')
  @Permissions({ entity: 'Contact', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @CurrentUser() user: any,
  ) {
    return this.contactService.update(id, dto, user);
  }

  /**
   * DELETE /api/v1/contacts/:id
   * Delete a contact
   */
  @Delete('contacts/:id')
  @Permissions({ entity: 'Contact', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.contactService.delete(id, user);
  }
}
