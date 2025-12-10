
import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRfqDto, RecordQuoteDto } from './dto/create-rfq.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Adjust path if needed
import { RolesGuard } from '../../auth/guards/roles.guard'; // Adjust path if needed
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('rfqs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RfqController {
    constructor(private readonly rfqService: RfqService) { }

    @Post()
    @Roles('INN', 'PLAN', 'GF')
    create(@Body() dto: CreateRfqDto, @Request() req) {
        return this.rfqService.create(dto, req.user);
    }

    @Get()
    findAll() {
        return this.rfqService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rfqService.findById(id);
    }

    @Put(':id/send')
    @Roles('INN', 'GF')
    send(@Param('id') id: string) {
        return this.rfqService.send(id);
    }

    @Post(':id/quotes')
    @Roles('INN', 'GF')
    recordQuote(@Param('id') id: string, @Body() dto: RecordQuoteDto) {
        return this.rfqService.recordQuote(id, dto);
    }

    @Put(':id/award/:quoteId')
    @Roles('INN', 'GF')
    awardQuote(@Param('id') id: string, @Param('quoteId') quoteId: string, @Request() req) {
        return this.rfqService.awardQuote(id, quoteId, req.user);
    }
}
