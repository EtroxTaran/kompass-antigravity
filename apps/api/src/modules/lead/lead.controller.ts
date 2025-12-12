import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LeadService } from './lead.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@Body() createLeadDto: CreateLeadDto, @Request() req: any) {
    return this.leadService.create(createLeadDto, req.user);
  }

  @Get()
  findAll(@Query() query: any, @Request() req: any) {
    // If not admin, maybe filter by owner? keeping it open for MVP
    return this.leadService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @Request() req: any,
  ) {
    return this.leadService.update(id, updateLeadDto, req.user);
  }

  @Post(':id/convert')
  convert(@Param('id') id: string, @Request() req: any) {
    return this.leadService.convertToCustomer(id, req.user);
  }
}
