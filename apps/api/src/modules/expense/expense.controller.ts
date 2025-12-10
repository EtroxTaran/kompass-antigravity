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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

// Mocking UserRole locally as it's not exported from shared yet
enum UserRole {
  ADM = 'ADM',
  PLAN = 'PLAN',
  INN = 'INN',
  GF = 'GF',
  BUCH = 'BUCH',
}

@Controller('expenses')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: any,
  ) {
    return this.expenseService.create(createExpenseDto, user.id);
  }

  @Post('mileage')
  @HttpCode(HttpStatus.CREATED)
  async createMileage(@Body() createMileageDto: any, @CurrentUser() user: any) {
    return this.expenseService.createMileage(createMileageDto, user.id);
  }

  @Get('pending')
  async findPending() {
    return this.expenseService.findPending();
  }

  @Get('my')
  async findMy(@Request() req: any) {
    return this.expenseService.findByUser(req.user.id);
  }

  @Get()
  @Permissions({ entity: 'Expense', action: 'READ' })
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  @Permissions({ entity: 'Expense', action: 'READ' })
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.expenseService.approve(id, user.id);
  }

  @Put(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.expenseService.reject(id, reason, user.id);
  }

  @Put(':id')
  @Permissions({ entity: 'Expense', action: 'UPDATE' })
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: any,
  ) {
    return this.expenseService.update(id, updateExpenseDto, user.userId);
  }

  @Delete(':id')
  @Permissions({ entity: 'Expense', action: 'DELETE' })
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
