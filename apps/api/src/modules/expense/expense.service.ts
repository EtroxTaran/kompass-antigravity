import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { ExpenseRepository } from "./expense.repository";
import { MileageRepository } from "./mileage.repository";
import { Expense, Mileage } from "@kompass/shared";
import { ProjectService } from "../project/project.service";

@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepo: ExpenseRepository,
    private readonly mileageRepo: MileageRepository,
    private readonly projectService: ProjectService,
  ) { }

  async create(expense: Partial<Expense>, userId: string): Promise<Expense> {
    // Validation: Receipt required if amount > 150
    if (expense.amount && expense.amount > 150 && !expense.receiptUrl) {
      throw new BadRequestException("Receipt required for expenses over €150");
    }

    const newExpense = await this.expenseRepo.create({
      ...expense,
      userId,
      status: "submitted",
      merchantName: expense.merchantName || "Unknown",
      date: expense.date || new Date().toISOString(),
      type: "expense"
    } as unknown as Expense, userId); // cast to unknown then Expense to satisfy generic if strictly checked, and pass userId

    return newExpense;
  }

  async createMileage(mileage: Partial<Mileage>, userId: string): Promise<Mileage> {
    const newMileage = await this.mileageRepo.create({
      ...mileage,
      userId,
      status: "submitted",
      type: "mileage"
    } as unknown as Mileage, userId);

    return newMileage;
  }

  async findAll() {
    return this.expenseRepo.findAll();
  }

  async findPending() {
    const all = await this.expenseRepo.findAll();
    return all.data.filter((e: Expense) => e.status === "submitted");
  }

  async findByUser(userId: string) {
    const all = await this.expenseRepo.findAll();
    return all.data.filter((e: Expense) => e.userId === userId);
  }

  async findOne(id: string) {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundException(`Expense with ID ${id} not found`);
    return expense;
  }

  async approve(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundException("Expense not found");

    if (expense.status === "approved") return expense;

    const updated = await this.expenseRepo.update(id, {
      status: "approved",
      approvedBy: userId,
      approvedAt: new Date().toISOString(),
    } as Partial<Expense>, userId);

    // Update Project Actual Costs
    if (updated.projectId) {
      await this.projectService.updateActualCost(updated.projectId, 'expenses', updated.amount, userId);
    }

    return updated;
  }

  async reject(id: string, reason: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) throw new NotFoundException("Expense not found");

    return this.expenseRepo.update(id, {
      status: "rejected",
      rejectionReason: reason,
      rejectedBy: userId,
      rejectedAt: new Date().toISOString(),
    } as Partial<Expense>, userId);
  }

  async update(id: string, dto: any, userId: string) {
    // Legacy or admin update
    const updated = await this.expenseRepo.update(id, dto, userId);
    if (updated.projectId) {
      await this.projectService.updateActualCost(updated.projectId, 'expenses', updated.amount, userId);
    }
    return updated;
  }

  async remove(id: string) {
    return this.expenseRepo.delete(id, 'system');
  }
}
