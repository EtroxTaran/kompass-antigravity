import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('api/v1/contacts')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post('check-duplicates')
  @Permissions({ entity: 'Contact', action: 'READ' })
  checkDuplicates(@Body() criteria: { email?: string; phone?: string; excludeId?: string }) {
    return this.contactService.checkDuplicates(criteria);
  }

  @Post()
  @Permissions({ entity: 'Contact', action: 'CREATE' })
  create(@Body() createContactDto: CreateContactDto, @Request() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.contactService.create(createContactDto, user.id, user.email);
  }

  @Get()
  @Permissions({ entity: 'Contact', action: 'READ' })
  findAll(@Query('customerId') customerId?: string) {
    return this.contactService.findAll(customerId);
  }

  @Get(':id')
  @Permissions({ entity: 'Contact', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  @Permissions({ entity: 'Contact', action: 'UPDATE' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Request() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.contactService.update(id, updateContactDto, user.id, user.email);
  }

  @Delete(':id')
  @Permissions({ entity: 'Contact', action: 'DELETE' })
  remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.contactService.remove(id, user.id, user.email);
  }
}
