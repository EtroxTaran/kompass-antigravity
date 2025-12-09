export class CreateExpenseDto {
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: 'travel' | 'meal' | 'accommodation' | 'material' | 'other';
  projectId?: string;
  customerId?: string;
  receiptUrl?: string;
}

export class UpdateExpenseDto {
  description?: string;
  amount?: number;
  currency?: string;
  date?: string;
  category?: 'travel' | 'meal' | 'accommodation' | 'material' | 'other';
  projectId?: string;
  customerId?: string;
  receiptUrl?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  rejectionReason?: string;
}
