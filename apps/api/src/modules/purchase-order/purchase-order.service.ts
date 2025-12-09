import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseOrderRepository } from './purchase-order.repository';
import { PurchaseOrder, PurchaseOrderItem } from '@kompass/shared';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { SearchService } from '../search/search.service';

export class CreatePurchaseOrderDto {
  orderNumber: string;
  supplierId: string;
  date: string;
  expectedDeliveryDate?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  currency: string;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  projectId?: string;
}

export class UpdatePurchaseOrderDto {
  supplierId?: string;
  date?: string;
  expectedDeliveryDate?: string;
  items?: PurchaseOrderItem[];
  totalAmount?: number;
  currency?: string;
  status?: 'draft' | 'ordered' | 'received' | 'cancelled';
  projectId?: string;
}

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
    private readonly searchService: SearchService,
  ) {}

  async create(
    createDto: CreatePurchaseOrderDto,
    userId: string,
  ): Promise<PurchaseOrder> {
    const purchaseOrder: PurchaseOrder = {
      _id: `purchase-order-${Date.now()}`,
      type: 'purchase-order',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: userId,
      modifiedBy: userId,
      version: 1,
      ...createDto,
    };
    const newOrder = await this.purchaseOrderRepository.create(
      purchaseOrder,
      userId,
    );
    this.indexOrder(newOrder);
    return newOrder;
  }

  async findAll(
    supplierId?: string,
    projectId?: string,
  ): Promise<PurchaseOrder[]> {
    if (supplierId) {
      return (await this.purchaseOrderRepository.findBySelector({ supplierId }))
        .data;
    }
    if (projectId) {
      return (await this.purchaseOrderRepository.findBySelector({ projectId }))
        .data;
    }
    return (await this.purchaseOrderRepository.findAll()).data;
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }
    return order;
  }

  async update(
    id: string,
    updateDto: UpdatePurchaseOrderDto,
    userId: string,
  ): Promise<PurchaseOrder> {
    const updated = await this.purchaseOrderRepository.update(
      id,
      updateDto,
      userId,
    );
    this.indexOrder(updated);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    return this.purchaseOrderRepository.delete(id, userId);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const order = await this.findOne(id);

    const docDefinition: any = {
      content: [
        { text: `Bestellung ${order.orderNumber}`, style: 'header' },
        {
          text: `Datum: ${new Date(order.date).toLocaleDateString('de-DE')}`,
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Beschreibung', 'Menge', 'Einheit', 'Preis'],
              ...order.items.map((item) => [
                item.description,
                item.quantity.toString(),
                (item as any).unit || 'Stk',
                `${item.unitPrice.toFixed(2)} €`,
              ]),
            ],
          },
        },
        {
          text: `Gesamtbetrag: ${order.totalAmount.toFixed(2)} ${order.currency}`,
          style: 'total',
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        total: { fontSize: 14, bold: true, alignment: 'right' },
      },
    };

    return this.pdfService.generatePdf(docDefinition);
  }

  async sendOrder(id: string, userId: string) {
    const order = await this.findOne(id);
    const pdfBuffer = await this.generatePdf(id);

    const recipient = 'supplier@example.com';

    await this.mailService.sendMail({
      to: recipient,
      subject: `Bestellung ${order.orderNumber}`,
      text: `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie unsere Bestellung ${order.orderNumber}.\n\nMit freundlichen Grüßen\nKompass Team`,
      attachments: [
        {
          filename: `Bestellung_${order.orderNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return { success: true, message: 'Order sent successfully' };
  }

  private async indexOrder(order: PurchaseOrder) {
    try {
      await this.searchService.addDocuments('purchase-orders', [
        {
          id: order._id,
          orderNumber: order.orderNumber,
          supplierId: order.supplierId,
          totalAmount: order.totalAmount,
          status: order.status,
          date: order.date,
        },
      ]);
    } catch (e) {
      console.error('Failed to index purchase order', e);
    }
  }
}
