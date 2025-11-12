/**
 * Expense Entity for KOMPASS
 * 
 * Represents business expenses including receipts, mileage, meals, etc.
 * Part of tour expense management and monthly reporting
 * 
 * Validation rules:
 * - expenseDate: Required, cannot be more than 90 days in past
 * - category: Valid enum value
 * - amount: > 0, max 10,000 EUR
 * - receiptImageUrl: Required if amount > €25
 * - description: 5-500 chars if provided
 * 
 * Business Rules:
 * - EX-001: Receipt required for expenses > €25
 * - EX-002: Expenses > €100 require GF approval
 * - EX-003: Rejected expenses can be resubmitted with corrections
 * - EX-004: Category-specific validation (e.g., mileage must have distance)
 * - EX-005: Expense must be linked to tour OR meeting OR project
 */

import type { BaseEntity } from '../base.entity';

/**
 * Expense category enum
 */
export enum ExpenseCategory {
  MILEAGE = 'mileage',
  HOTEL = 'hotel',
  MEAL = 'meal',
  FUEL = 'fuel',
  PARKING = 'parking',
  TOLL = 'toll',
  PUBLIC_TRANSPORT = 'public_transport',
  CLIENT_ENTERTAINMENT = 'client_entertainment',
  OFFICE_SUPPLIES = 'office_supplies',
  PHONE = 'phone',
  OTHER = 'other',
}

/**
 * Expense status enum
 */
export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

/**
 * Expense entity
 */
export interface Expense extends BaseEntity {
  type: 'expense';

  // ==================== Expense Identity ====================
  
  /** Expense title/description */
  title: string;

  /** Detailed description */
  description?: string;

  // ==================== Category & Date ====================
  
  /** Expense date */
  expenseDate: Date;

  /** Expense category */
  category: ExpenseCategory;

  // ==================== Amount & Currency ====================
  
  /** Amount in EUR */
  amount: number;

  /** Currency (default EUR) */
  currency: string;

  /** VAT amount if applicable */
  vatAmount?: number;

  /** VAT rate percentage if applicable */
  vatRate?: number;

  // ==================== Receipt ====================
  
  /** Receipt image URL (MinIO storage) */
  receiptImageUrl?: string;

  /** Vendor/merchant name (from OCR or manual) */
  vendor?: string;

  /** Invoice number from receipt */
  invoiceNumber?: string;

  /** OCR confidence score (0-1) */
  ocrConfidence?: number;

  /** Whether OCR data was manually verified/corrected */
  ocrVerified?: boolean;

  // ==================== Ownership & Associations ====================
  
  /** User ID who incurred the expense (typically ADM) */
  userId: string;

  /** Tour ID if expense is part of a tour */
  tourId?: string;

  /** Meeting ID if expense is for specific meeting */
  meetingId?: string;

  /** Project ID if expense is project-related */
  projectId?: string;

  /** Customer ID if expense is customer-related */
  customerId?: string;

  // ==================== Category-Specific Data ====================
  
  /** Mileage-specific: Distance in km */
  distance?: number;

  /** Mileage-specific: Rate per km (€0.30 default) */
  mileageRate?: number;

  /** Meal-specific: Number of people */
  numberOfPeople?: number;

  /** Hotel-specific: Number of nights */
  numberOfNights?: number;

  // ==================== Approval Workflow ====================
  
  /** Current status */
  status: ExpenseStatus;

  /** Date submitted for approval */
  submittedAt?: Date;

  /** User ID of approver (typically GF) */
  approvedBy?: string;

  /** Date approved */
  approvedAt?: Date;

  /** Date rejected */
  rejectedAt?: Date;

  /** Rejection reason */
  rejectionReason?: string;

  /** Date paid */
  paidAt?: Date;

  /** Payment reference */
  paymentReference?: string;

  // ==================== Notes ====================
  
  /** Internal notes */
  notes?: string;

  /** Admin notes (visible to GF/BUCH only) */
  adminNotes?: string;
}

/**
 * Type guard for Expense
 */
export function isExpense(obj: unknown): obj is Expense {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as Expense).type === 'expense' &&
    'title' in obj &&
    'expenseDate' in obj &&
    'category' in obj &&
    'amount' in obj &&
    'currency' in obj &&
    'userId' in obj &&
    'status' in obj
  );
}

/**
 * Expense creation helper
 */
export function createExpense(
  data: Omit<
    Expense,
    | '_id'
    | '_rev'
    | 'type'
    | 'createdBy'
    | 'createdAt'
    | 'modifiedBy'
    | 'modifiedAt'
    | 'version'
  >,
  userId: string
): Omit<Expense, '_rev'> {
  const now = new Date();

  return {
    _id: `expense-${crypto.randomUUID()}`,
    type: 'expense',
    currency: data.currency || 'EUR',
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Expense validation error
 */
export interface ExpenseValidationError {
  field: string;
  message: string;
}

/**
 * Validates expense data
 */
export function validateExpense(expense: Partial<Expense>): ExpenseValidationError[] {
  const errors: ExpenseValidationError[] = [];

  // Required fields
  if (!expense.title || expense.title.length < 2 || expense.title.length > 200) {
    errors.push({ field: 'title', message: 'Expense title must be 2-200 characters' });
  }

  if (!expense.expenseDate) {
    errors.push({ field: 'expenseDate', message: 'Expense date is required' });
  }

  if (!expense.category) {
    errors.push({ field: 'category', message: 'Expense category is required' });
  }

  if (expense.amount === undefined) {
    errors.push({ field: 'amount', message: 'Amount is required' });
  }

  if (!expense.userId) {
    errors.push({ field: 'userId', message: 'User ID is required' });
  }

  if (!expense.status) {
    errors.push({ field: 'status', message: 'Status is required' });
  }

  // Expense date validation (cannot be more than 90 days in past)
  if (expense.expenseDate) {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    if (new Date(expense.expenseDate) < ninetyDaysAgo) {
      errors.push({
        field: 'expenseDate',
        message: 'Expense date cannot be more than 90 days in the past',
      });
    }
  }

  // Amount validation
  if (expense.amount !== undefined) {
    if (expense.amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    }
    if (expense.amount > 10000) {
      errors.push({ field: 'amount', message: 'Amount cannot exceed €10,000. For larger expenses, contact GF.' });
    }
  }

  // Business rule EX-001: Receipt required for expenses > €25
  if (expense.amount !== undefined && expense.amount > 25 && !expense.receiptImageUrl) {
    errors.push({
      field: 'receiptImageUrl',
      message: 'Receipt image is required for expenses greater than €25',
    });
  }

  // Business rule EX-005: Expense must be linked to something
  if (!expense.tourId && !expense.meetingId && !expense.projectId) {
    errors.push({
      field: 'tourId',
      message: 'Expense must be linked to a tour, meeting, or project',
    });
  }

  // Category-specific validation
  if (expense.category === ExpenseCategory.MILEAGE) {
    if (!expense.distance || expense.distance <= 0) {
      errors.push({ field: 'distance', message: 'Distance is required for mileage expenses' });
    }
    if (!expense.mileageRate || expense.mileageRate <= 0) {
      errors.push({ field: 'mileageRate', message: 'Mileage rate is required for mileage expenses' });
    }
    // Validate mileage calculation
    if (expense.distance && expense.mileageRate && expense.amount) {
      const expectedAmount = Math.round(expense.distance * expense.mileageRate * 100) / 100;
      const tolerance = 0.01;
      if (Math.abs(expense.amount - expectedAmount) > tolerance) {
        errors.push({
          field: 'amount',
          message: `Amount (€${expense.amount}) does not match mileage calculation (${expense.distance}km × €${expense.mileageRate} = €${expectedAmount})`,
        });
      }
    }
  }

  // Description validation
  if (expense.description && (expense.description.length < 5 || expense.description.length > 500)) {
    errors.push({ field: 'description', message: 'Description must be 5-500 characters if provided' });
  }

  // Rejection reason required if status is rejected
  if (expense.status === ExpenseStatus.REJECTED && !expense.rejectionReason) {
    errors.push({
      field: 'rejectionReason',
      message: 'Rejection reason is required for rejected expenses',
    });
  }

  return errors;
}

/**
 * Validates expense status transition
 */
export function isValidExpenseStatusTransition(
  currentStatus: ExpenseStatus,
  newStatus: ExpenseStatus
): boolean {
  const validTransitions: Record<ExpenseStatus, ExpenseStatus[]> = {
    [ExpenseStatus.DRAFT]: [ExpenseStatus.SUBMITTED],
    [ExpenseStatus.SUBMITTED]: [ExpenseStatus.APPROVED, ExpenseStatus.REJECTED, ExpenseStatus.DRAFT],
    [ExpenseStatus.APPROVED]: [ExpenseStatus.PAID],
    [ExpenseStatus.REJECTED]: [ExpenseStatus.DRAFT], // Can resubmit
    [ExpenseStatus.PAID]: [], // Terminal state
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Determines if expense requires GF approval
 */
export function requiresGFApproval(expense: Expense): boolean {
  return expense.amount > 100;
}

/**
 * Calculates mileage expense amount
 */
export function calculateMileageAmount(distance: number, rate: number = 0.30): number {
  return Math.round(distance * rate * 100) / 100; // Round to 2 decimals
}

