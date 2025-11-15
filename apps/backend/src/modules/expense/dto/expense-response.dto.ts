import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ExpenseCategory, ExpenseStatus } from './create-expense.dto';

/**
 * Expense Response DTO
 */
export class ExpenseResponseDto {
  @ApiProperty({
    description: 'Expense ID',
    example: 'expense-550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Expense date',
    example: '2025-06-15',
  })
  expenseDate: Date;

  @ApiProperty({
    description: 'Expense category',
    enum: ExpenseCategory,
    example: ExpenseCategory.MEAL,
  })
  category: ExpenseCategory;

  @ApiProperty({
    description: 'Amount in EUR',
    example: 45.5,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'EUR',
  })
  currency: string;

  @ApiProperty({
    description: 'Expense description',
    example: 'Mittagessen bei Kundenbesuch',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'Receipt image URL',
    example: 'https://minio.example.com/receipts/expense-123.jpg',
  })
  receiptImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Tour ID',
    example: 'tour-789',
  })
  tourId?: string;

  @ApiPropertyOptional({
    description: 'Meeting ID',
    example: 'meeting-111',
  })
  meetingId?: string;

  @ApiPropertyOptional({
    description: 'Project ID',
    example: 'project-999',
  })
  projectId?: string;

  @ApiProperty({
    description: 'User ID who incurred the expense',
    example: 'user-123',
  })
  userId: string;

  @ApiProperty({
    description: 'Expense status',
    enum: ExpenseStatus,
    example: ExpenseStatus.DRAFT,
  })
  status: ExpenseStatus;

  @ApiPropertyOptional({
    description: 'Rejection reason',
    example: 'Receipt missing or unclear',
  })
  rejectionReason?: string;

  @ApiPropertyOptional({
    description: 'Approver user ID',
    example: 'user-gf-001',
  })
  approvedBy?: string;

  @ApiPropertyOptional({
    description: 'Approval timestamp',
    example: '2025-06-20T10:00:00Z',
  })
  approvedAt?: Date;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-06-15T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last modified timestamp',
    example: '2025-06-20T10:00:00Z',
  })
  modifiedAt: Date;
}
