import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from './expense.repository';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly repository: ExpenseRepository) {}

  async create(dto: CreateExpenseDto, userId: string) {
    const expense: any = {
      ...dto,
      userId,
      status: 'draft',
    };
    return this.repository.create(expense, userId);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const expense = await this.repository.findById(id);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto, userId: string) {
    return this.repository.update(id, dto, userId);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.repository.delete(id, 'system'); // Or userId if available in delete
  }
}
