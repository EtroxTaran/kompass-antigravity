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
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('api/v1/expenses')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Permissions({ entity: 'Expense', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExpenseDto: CreateExpenseDto, @CurrentUser() user: any) {
    return this.expenseService.create(createExpenseDto, user.userId);
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
