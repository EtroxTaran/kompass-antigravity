import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';
import { Comment } from '@kompass/shared';

export interface InvoicePosition {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  totalNet: number;
}

export interface Invoice extends BaseEntity {
  type: 'invoice';

  invoiceNumber: string;
  customerId: string;
  projectId?: string;

  date: string;
  dueDate: string;

  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  positions: InvoicePosition[];

  totalNet: number;
  vatAmount: number;
  totalGross: number;

  notes?: string;
  comments?: Comment[];
}

@Injectable()
export class InvoiceRepository extends BaseRepository<Invoice> {
  protected readonly entityType = 'invoice';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Invoice>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ customerId }, options);
  }

  async findByProject(
    projectId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ projectId }, options);
  }

  async findByStatus(
    status: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ status }, options);
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    const result = await this.findBySelector({ invoiceNumber }, { limit: 1 });
    return result.data.length > 0 ? result.data[0] : null;
  }

  async getNextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await this.db.find({
      selector: {
        type: this.entityType,
        invoiceNumber: { $regex: `^INV-${year}-` },
      },
      fields: ['invoiceNumber'],
      limit: 10000,
    });

    const numbers = result.docs
      .map((doc: any) => {
        const match = doc.invoiceNumber.match(/INV-\d{4}-(\d{5})/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n: number) => !isNaN(n));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `INV-${year}-${(maxNumber + 1).toString().padStart(5, '0')}`;
  }
}
