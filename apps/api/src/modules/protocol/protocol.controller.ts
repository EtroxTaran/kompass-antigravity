import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { CreateProtocolDto, UpdateProtocolDto } from './dto/protocol.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('protocols')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProtocolController {
  constructor(private readonly protocolService: ProtocolService) {}

  @Post()
  @Permissions({ entity: 'protocol', action: 'CREATE' })
  create(@Body() createProtocolDto: CreateProtocolDto, @Request() req: any) {
    return this.protocolService.create(createProtocolDto, req.user.sub);
  }

  @Get()
  @Permissions({ entity: 'protocol', action: 'READ' })
  findAll() {
    return this.protocolService.findAll();
  }

  @Get(':id')
  @Permissions({ entity: 'protocol', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.protocolService.findOne(id);
  }

  @Put(':id')
  @Permissions({ entity: 'protocol', action: 'UPDATE' })
  update(
    @Param('id') id: string,
    @Body() updateProtocolDto: UpdateProtocolDto,
    @Request() req: any,
  ) {
    return this.protocolService.update(id, updateProtocolDto, req.user.sub);
  }

  @Delete(':id')
  @Permissions({ entity: 'protocol', action: 'DELETE' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.protocolService.delete(id, req.user.sub);
  }
}
