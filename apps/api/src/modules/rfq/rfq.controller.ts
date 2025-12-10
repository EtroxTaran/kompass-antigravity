
import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRfqDto, RecordQuoteDto } from './dto/create-rfq.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('rfqs')
@UseGuards(JwtAuthGuard)
export class RfqController {
    constructor(private readonly rfqService: RfqService) { }

    @Post()
    create(@Body() dto: CreateRfqDto, @Request() req: any) {
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
    send(@Param('id') id: string) {
        return this.rfqService.send(id);
    }

    @Post(':id/quotes')
    recordQuote(@Param('id') id: string, @Body() dto: RecordQuoteDto) {
        return this.rfqService.recordQuote(id, dto);
    }

    @Put(':id/award/:quoteId')
    awardQuote(@Param('id') id: string, @Param('quoteId') quoteId: string, @Request() req: any) {
        return this.rfqService.awardQuote(id, quoteId, req.user);
    }
}
