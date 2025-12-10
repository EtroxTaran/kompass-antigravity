import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { RfqRepository } from './rfq.repository';
import { CreateRfqDto, RecordQuoteDto } from './dto/create-rfq.dto';
import {
  RequestForQuote,
  RfqStatus,
  QuoteStatus,
  SupplierQuote,
} from '@kompass/shared';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { SupplierService } from '../supplier/supplier.service';
import { ContractService } from '../contract/contract.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RfqService {
  constructor(
    private readonly repository: RfqRepository,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
    private readonly supplierService: SupplierService,
    private readonly contractService: ContractService,
  ) {}

  async create(
    dto: CreateRfqDto,
    user: { id: string },
  ): Promise<RequestForQuote> {
    const rfqNumber = await this.repository.generateRfqNumber();
    const rfq: Partial<RequestForQuote> = {
      ...dto,
      rfqNumber,
      type: 'request_for_quote',
      status: RfqStatus.DRAFT,
      quotes: [],
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };
    return this.repository.create(rfq, user.id);
  }

  async findAll(): Promise<RequestForQuote[]> {
    const result = await this.repository.findAll();
    return result.data;
  }

  async findById(id: string): Promise<RequestForQuote> {
    const rfq = await this.repository.findById(id);
    if (!rfq) {
      throw new NotFoundException(`RFQ with ID '${id}' not found`);
    }
    return rfq;
  }

  async send(id: string): Promise<RequestForQuote> {
    const rfq = await this.findById(id);

    if (rfq.status !== RfqStatus.DRAFT) {
      throw new BadRequestException('Only draft RFQs can be sent');
    }

    // Generate PDF Definition
    const docDefinition: any = {
      content: [
        { text: `Request for Quote: ${rfq.title}`, style: 'header' },
        { text: `RFQ Number: ${rfq.rfqNumber}`, margin: [0, 5, 0, 5] },
        {
          text: `Deadline: ${new Date(rfq.responseDeadline).toLocaleDateString()}`,
          margin: [0, 0, 0, 20],
        },
        { text: 'Specifications', style: 'subheader' },
        { text: rfq.specifications, margin: [0, 0, 0, 10] },
        {
          text: `Quantity: ${rfq.quantity} ${rfq.unit}`,
          margin: [0, 0, 0, 10],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
      },
    };

    const pdfBuffer = await this.pdfService.generatePdf(docDefinition);

    // Send to each invited supplier
    for (const supplierId of rfq.invitedSuppliers) {
      try {
        const supplier = await this.supplierService.findById(supplierId);
        if (supplier && supplier.email) {
          await this.mailService.sendMail({
            to: supplier.email,
            subject: `RFQ Invitation: ${rfq.title} (${rfq.rfqNumber})`,
            text: `Dear Partner,\n\nYou are invited to submit a quote for the attached RFQ.\n\nPlease reply by ${new Date(rfq.responseDeadline).toLocaleDateString()}.\n\nBest regards,\nKompass Team`,
            attachments: [
              {
                filename: `RFQ_${rfq.rfqNumber}.pdf`,
                content: pdfBuffer,
              },
            ],
          });
        }
      } catch (error) {
        // Log error but continue sending to others
        // console.error(`Failed to send RFQ to supplier ${supplierId}`, error);
      }
    }

    return this.repository.update(
      id,
      { status: RfqStatus.SENT },
      rfq.createdBy,
      'system',
    );
  }

  async recordQuote(
    rfqId: string,
    dto: RecordQuoteDto,
  ): Promise<RequestForQuote> {
    const rfq = await this.findById(rfqId);

    if (
      rfq.status === RfqStatus.AWARDED ||
      rfq.status === RfqStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot record quotes for awarded or cancelled RFQs',
      );
    }

    const quote: SupplierQuote = {
      id: uuidv4(),
      ...dto,
      receivedAt: new Date().toISOString(),
      status: QuoteStatus.RECEIVED,
    };

    const quotes = [...(rfq.quotes || []), quote];

    return this.repository.update(
      rfqId,
      {
        quotes,
        status: RfqStatus.QUOTES_RECEIVED,
      },
      'system',
      'system',
    );
  }

  async awardQuote(
    rfqId: string,
    quoteId: string,
    user: { id: string; email: string },
  ): Promise<RequestForQuote> {
    const rfq = await this.findById(rfqId);

    const quote = rfq.quotes.find((q: SupplierQuote) => q.id === quoteId);
    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    // Update quote statuses
    const updatedQuotes = rfq.quotes.map((q: SupplierQuote) => ({
      ...q,
      status: q.id === quoteId ? QuoteStatus.AWARDED : QuoteStatus.REJECTED,
    }));

    return this.repository.update(
      rfqId,
      {
        status: RfqStatus.AWARDED,
        awardedSupplierId: quote.supplierId,
        awardedQuoteId: quoteId,
        quotes: updatedQuotes,
      },
      user.id,
      user.email,
    );
  }
}
