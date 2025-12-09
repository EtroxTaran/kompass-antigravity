import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InvoiceRepository, Invoice } from './invoice.repository';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
  ) {}

  async findAll(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      customerId?: string;
    } = {},
  ) {
    if (options.customerId) {
      return this.invoiceRepository.findByCustomer(options.customerId, options);
    }
    if (options.status) {
      return this.invoiceRepository.findByStatus(options.status, options);
    }
    return this.invoiceRepository.findAll(options);
  }

  async findById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Invoice with ID '${id}' not found`,
        resourceType: 'Invoice',
        resourceId: id,
      });
    }
    return invoice;
  }

  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.invoiceRepository.findByCustomer(customerId, options);
  }

  async findByProject(
    projectId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.invoiceRepository.findByProject(projectId, options);
  }

  async create(
    dto: CreateInvoiceDto,
    user: { id: string; email?: string },
  ): Promise<Invoice> {
    const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber();

    const invoiceData = {
      ...dto,
      invoiceNumber,
      status: dto.status || 'draft',
    };

    return this.invoiceRepository.create(
      invoiceData as Partial<Invoice>,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: UpdateInvoiceDto,
    user: { id: string; email?: string },
  ): Promise<Invoice> {
    const existing = await this.findById(id);

    // Prevent editing sent/paid invoices (except status changes)
    if (
      ['sent', 'paid'].includes(existing.status) &&
      Object.keys(dto).some((k) => k !== 'status')
    ) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Cannot modify sent or paid invoices',
      });
    }

    return this.invoiceRepository.update(
      id,
      dto as Partial<Invoice>,
      user.id,
      user.email,
    );
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    const existing = await this.findById(id);

    if (existing.status !== 'draft') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Only draft invoices can be deleted',
      });
    }

    return this.invoiceRepository.delete(id, user.id, user.email);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const invoice = await this.findById(id);

    // Basic PDF Layout Definition
    const docDefinition: any = {
      content: [
        { text: `Rechnung ${invoice.invoiceNumber}`, style: 'header' },
        {
          text: `Datum: ${new Date(invoice.createdAt).toLocaleDateString('de-DE')}`,
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Start', 'Ende', 'Beschreibung', 'Betrag'],
              // Mapping line items (assuming invoice has items, otherwise mock)
              [
                '--',
                '--',
                'Serviceleistung',
                `${(invoice as any).totalAmount || 0} €`,
              ],
            ],
          },
        },
        {
          text: `Gesamtbetrag: ${(invoice as any).totalAmount || 0} €`,
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

  async sendInvoice(id: string, user: { id: string; email?: string }) {
    const invoice = await this.findById(id);

    // 1. Generate PDF
    const pdfBuffer = await this.generatePdf(id);

    // 2. Send Email (Mocking recipient if not set)
    // Ideally fetch customer email from CustomerService
    const recipient = 'customer@example.com';

    await this.mailService.sendMail({
      to: recipient,
      subject: `Rechnung ${invoice.invoiceNumber}`,
      text: `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie Ihre Rechnung ${invoice.invoiceNumber}.\n\nMit freundlichen Grüßen\nKompass Team`,
      attachments: [
        {
          filename: `Rechnung_${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // 3. Update status to 'sent'
    if (invoice.status === 'draft') {
      await this.update(id, { status: 'sent' }, user);
    }

    return { success: true, message: 'Invoice sent successfully' };
  }
}
