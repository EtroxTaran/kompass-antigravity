import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SummarizeService } from './summarize.service';
import { SummarizeRequestDto, CreateActionItemsDto } from './dto/summarize.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';

@Controller('summarize')
@UseGuards(JwtAuthGuard)
export class SummarizeController {
  constructor(private readonly summarizeService: SummarizeService) {}

  @Post()
  async summarize(@Body() dto: SummarizeRequestDto) {
    return this.summarizeService.summarizeText(dto.text);
  }

  @Post('create-tasks')
  async createTasks(@Body() dto: CreateActionItemsDto, @Req() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.summarizeService.createActionItems(dto, user);
  }
}
