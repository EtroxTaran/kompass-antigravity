import { Module } from '@nestjs/common';

// TODO: Implement ExpenseController and ExpenseService in Phase 2 (Q3 2025)
// import { ExpenseController } from './expense.controller';
// import { ExpenseService } from './expense.service';
import { ExpenseRepository } from './expense.repository';

/**
 * Expense Module
 *
 * Provides expense tracking and approval functionality:
 * - CRUD operations for expenses
 * - Receipt upload and OCR processing (via n8n)
 * - Approval workflow (GF only)
 * - Expense reporting and export
 * - RBAC enforcement
 * - Offline sync support
 *
 * Phase 2 (Q3 2025)
 */
@Module({
  // controllers: [ExpenseController], // TODO: Implement in Phase 2
  providers: [
    // ExpenseService, // TODO: Implement in Phase 2
    ExpenseRepository,
    {
      provide: 'IExpenseRepository',
      useClass: ExpenseRepository,
    },
  ],
  // exports: [ExpenseService], // TODO: Implement in Phase 2
})
export class ExpenseModule {}
