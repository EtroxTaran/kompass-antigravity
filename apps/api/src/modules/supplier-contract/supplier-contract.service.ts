import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SupplierContractRepository } from './supplier-contract.repository';
import { CreateSupplierContractDto } from './dto/supplier-contract.dto';
import {
  SupplierContract,
  SupplierContractStatus,
  PaymentMilestone,
} from '@kompass/shared';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class SupplierContractService {
  constructor(
    private readonly repository: SupplierContractRepository,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
  ) {}

  async findAll(options: { page?: number; limit?: number } = {}) {
    return this.repository.findAll(options);
  }

  async findBySupplier(supplierId: string) {
    return this.repository.findBySupplier(supplierId);
  }

  async findById(id: string): Promise<SupplierContract> {
    const contract = await this.repository.findById(id);
    if (!contract) {
      throw new NotFoundException(`Contract with ID '${id}' not found`);
    }
    return contract;
  }

  async create(
    dto: CreateSupplierContractDto,
    user: { id: string; email?: string },
  ): Promise<SupplierContract> {
    const contractNumber = await this.repository.generateContractNumber();

    // Default assumptions for MVP
    const paymentSchedule: PaymentMilestone[] =
      dto.paymentSchedule?.map((p) => ({
        ...p,
        status: 'Pending',
      })) || [];

    const contractData: Partial<SupplierContract> = {
      ...dto,
      contractNumber,
      type: 'supplier_contract',
      status: 'draft',
      paymentSchedule,
      signedBySupplier: false,
      signedByUs: false,
      currency: dto.currency || 'EUR',
    };

    return this.repository.create(contractData, user.id, user.email);
  }

  /**
   * Approve contract for sending/signing
   * Contracts > 50k require GF approval
   */
  async approve(
    id: string,
    user: AuthenticatedUser,
  ): Promise<SupplierContract> {
    const contract = await this.findById(id);

    if (contract.status !== 'draft' && contract.status !== 'pending_approval') {
      throw new BadRequestException(
        'Only draft or pending contracts can be approved',
      );
    }

    // Logic check: Contracts >= 50k need GF approval
    if (contract.contractValue >= 50000) {
      const isGF = user.roles && user.roles.includes('GF');
      if (!isGF) {
        // If currently draft, move to pending_approval so GF can see it
        if (contract.status === 'draft') {
          return this.repository.update(
            id,
            { status: 'pending_approval' },
            user.id,
            user.email,
          );
        }
        // If already pending, just reject update or say forbidden
        throw new ForbiddenException(
          'Contracts/Orders over 50k require GF approval',
        );
      }
    }

    const updates: Partial<SupplierContract> = {
      status: 'sent_to_supplier', // Ready for signing
      approvedBy: user.id,
      approvedAt: new Date().toISOString(),
    };

    return this.repository.update(id, updates, user.id, user.email);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const contract = await this.findById(id);

    const docDefinition: any = {
      content: [
        { text: `Vertrag: ${contract.title}`, style: 'header' },
        {
          text: `Vertragsnummer: ${contract.contractNumber}`,
          margin: [0, 5, 0, 5],
        },
        {
          text: `Datum: ${new Date().toLocaleDateString('de-DE')}`,
          margin: [0, 0, 0, 20],
        },

        { text: 'Beschreibung', style: 'subheader' },
        { text: contract.description || '-', margin: [0, 0, 0, 10] },

        { text: 'Leistungsumfang', style: 'subheader' },
        {
          ul: contract.scope || [],
          margin: [0, 0, 0, 10],
        },

        { text: 'Zahlungsplan', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: [
              ['Beschreibung', 'Prozent', 'Betrag'],
              ...(contract.paymentSchedule || []).map((p) => [
                p.description,
                `${p.percentage}%`,
                `${p.amount.toFixed(2)} €`,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },

        {
          text: `Gesamtwert: ${contract.contractValue.toFixed(2)} ${contract.currency || 'EUR'}`,
          style: 'total',
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
        total: { fontSize: 16, bold: true, alignment: 'right' },
      },
    };

    return this.pdfService.generatePdf(docDefinition);
  }

  async sendContract(id: string, user: AuthenticatedUser) {
    const contract = await this.findById(id);
    const pdfBuffer = await this.generatePdf(id);

    // Placeholder recipient - in real app would query Supplier service
    const recipient = 'supplier@example.com';

    await this.mailService.sendMail({
      to: recipient,
      subject: `Vertrag ${contract.contractNumber}`,
      text: `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie den Vertrag ${contract.contractNumber} zur Unterschrift.\n\nMit freundlichen Grüßen\nKompass Team`,
      attachments: [
        {
          filename: `Vertrag_${contract.contractNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return { success: true };
  }

  /**
   * Record signature
   */
  async sign(
    id: string,
    user: { id: string; email?: string },
  ): Promise<SupplierContract> {
    const contract = await this.findById(id);

    if (contract.status !== 'sent_to_supplier') {
      // In real app, might want to allow signing from other states, but keeping strict for flow
      // throw new BadRequestException('Contract must be sent to supplier before signing');
    }

    const updates: Partial<SupplierContract> = {
      status: 'signed',
      signedByUs: true,
      signedBySupplier: true, // Assuming we received the signed doc
      signedDate: new Date().toISOString(),
    };

    return this.repository.update(id, updates, user.id, user.email);
  }
}
