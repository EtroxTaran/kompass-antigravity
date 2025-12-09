import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ContractRepository,
  Contract,
  ContractQueryOptions,
} from './contract.repository';
import {
  CreateContractDto,
  UpdateContractDto,
  UpdateContractStatusDto,
  CreateContractFromOfferDto,
} from './dto/contract.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { OfferRepository, OfferLineItem } from '../offer/offer.repository';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { SearchService } from '../search/search.service';
import { v4 as uuidv4 } from 'uuid';

// Valid status transitions for Contract
const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['signed', 'cancelled'],
  signed: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [], // Terminal state (GoBD)
  cancelled: [], // Terminal state
};

// Immutable statuses - contracts in these statuses cannot be modified (GoBD requirement)
const IMMUTABLE_STATUSES = ['signed', 'in_progress', 'completed'];

@Injectable()
export class ContractService {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly offerRepository: OfferRepository,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
    private readonly searchService: SearchService,
  ) {}

  async findAll(options: ContractQueryOptions = {}) {
    return this.contractRepository.findAll(options);
  }

  async findById(id: string): Promise<Contract> {
    const contract = await this.contractRepository.findById(id);
    if (!contract) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Contract with ID '${id}' not found`,
        resourceType: 'Contract',
        resourceId: id,
      });
    }
    return contract;
  }

  async findByCustomer(customerId: string, options: ContractQueryOptions = {}) {
    return this.contractRepository.findByCustomer(customerId, options);
  }

  async findByOffer(offerId: string): Promise<Contract | null> {
    return this.contractRepository.findByOffer(offerId);
  }

  async findActive(options: ContractQueryOptions = {}) {
    return this.contractRepository.findActive(options);
  }

  /**
   * Create a contract from an accepted offer
   */
  async createFromOffer(
    dto: CreateContractFromOfferDto,
    user: AuthenticatedUser,
  ): Promise<Contract> {
    // Find the offer
    const offer = await this.offerRepository.findById(dto.offerId);
    if (!offer) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Offer with ID '${dto.offerId}' not found`,
        resourceType: 'Offer',
        resourceId: dto.offerId,
      });
    }

    // Verify offer is accepted
    if (offer.status !== 'accepted') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: `Cannot create contract from offer with status '${offer.status}'. Offer must be accepted.`,
        errors: [
          {
            field: 'offerId',
            message: 'Offer must be accepted to create a contract',
          },
        ],
      });
    }

    // Check if contract already exists for this offer
    const existingContract = await this.findByOffer(dto.offerId);
    if (existingContract) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: `Contract already exists for offer '${dto.offerId}'`,
        existingResourceId: existingContract._id,
      });
    }

    // Generate contract number
    const contractNumber =
      await this.contractRepository.generateContractNumber();

    const contractData: Partial<Contract> = {
      contractNumber,
      offerId: offer._id,
      customerId: offer.customerId,
      contactPersonId: offer.contactPersonId,
      contractDate: dto.contractDate || new Date().toISOString().split('T')[0],
      startDate: dto.startDate,
      status: 'draft',
      lineItems: offer.lineItems,
      subtotalEur: offer.subtotalEur,
      discountPercent: offer.discountPercent,
      discountEur: offer.discountEur,
      taxRate: offer.taxRate,
      taxEur: offer.taxEur,
      totalEur: offer.totalEur,
      currency: offer.currency,
      paymentTerms: offer.paymentTerms,
      deliveryTerms: offer.deliveryTerms,
      notes: dto.notes,
      finalized: false,
    };

    const newContract = await this.contractRepository.create(
      contractData,
      user.id,
      user.email,
    );
    this.indexContract(newContract);
    return newContract;
  }

  async create(
    dto: CreateContractDto,
    user: AuthenticatedUser,
  ): Promise<Contract> {
    // Generate contract number
    const contractNumber =
      await this.contractRepository.generateContractNumber();

    // Calculate line item totals and generate IDs
    const lineItems: OfferLineItem[] = dto.lineItems.map((item) => ({
      id: item.id || uuidv4(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: Math.round(item.quantity * item.unitPrice * 100) / 100,
      unit: item.unit,
    }));

    // Calculate totals
    const subtotalEur = lineItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    const discountPercent = dto.discountPercent || 0;
    const discountEur =
      Math.round(((subtotalEur * discountPercent) / 100) * 100) / 100;
    const afterDiscount = subtotalEur - discountEur;
    const taxRate = dto.taxRate ?? 0.19;
    const taxEur = Math.round(afterDiscount * taxRate * 100) / 100;
    const totalEur = Math.round((afterDiscount + taxEur) * 100) / 100;

    const contractData: Partial<Contract> = {
      contractNumber,
      offerId: dto.offerId,
      customerId: dto.customerId,
      contactPersonId: dto.contactPersonId,
      contractDate: dto.contractDate,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status || 'draft',
      lineItems,
      subtotalEur,
      discountPercent,
      discountEur,
      taxRate,
      taxEur,
      totalEur,
      currency: 'EUR',
      paymentTerms: dto.paymentTerms,
      deliveryTerms: dto.deliveryTerms,
      notes: dto.notes,
      finalized: false,
    };

    const newContract = await this.contractRepository.create(
      contractData,
      user.id,
      user.email,
    );
    this.indexContract(newContract);
    return newContract;
  }

  async update(
    id: string,
    dto: UpdateContractDto,
    user: AuthenticatedUser,
  ): Promise<Contract> {
    const existing = await this.findById(id);

    // GoBD compliance: Check if contract is immutable
    if (existing.finalized || IMMUTABLE_STATUSES.includes(existing.status)) {
      // Only allow limited updates to non-financial fields
      const allowedFields = ['projectId', 'notes', 'pdfUrl'];
      const attemptedFields = Object.keys(dto);
      const forbiddenFields = attemptedFields.filter(
        (f) => !allowedFields.includes(f),
      );

      if (forbiddenFields.length > 0) {
        throw new ForbiddenException({
          type: 'https://api.kompass.de/errors/forbidden',
          title: 'Forbidden',
          status: 403,
          detail: `Contract is finalized (GoBD compliance). Cannot modify: ${forbiddenFields.join(', ')}`,
          errors: [
            {
              field: 'contract',
              message:
                'Only projectId, notes, and pdfUrl can be modified after signing',
              allowedFields,
            },
          ],
        });
      }
    }

    // Validate status transition if changing
    if (dto.status && dto.status !== existing.status) {
      if (!VALID_TRANSITIONS[existing.status].includes(dto.status)) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: `Cannot transition from '${existing.status}' to '${dto.status}'`,
          errors: [
            {
              field: 'status',
              message: `Valid transitions from '${existing.status}': ${VALID_TRANSITIONS[existing.status].join(', ') || 'none'}`,
            },
          ],
        });
      }
    }

    const updateData: Partial<Contract> = { ...dto };

    // Set signing metadata if status changes to signed
    if (dto.status === 'signed' && existing.status !== 'signed') {
      updateData.signedAt = new Date().toISOString();
      if (!dto.signedBy) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: 'signedBy is required when signing a contract',
          errors: [
            {
              field: 'signedBy',
              message: 'Who signed the contract is required',
            },
          ],
        });
      }
    }

    const updated = await this.contractRepository.update(
      id,
      updateData,
      user.id,
      user.email,
    );

    // Mark as immutable if status changed to signed (GoBD)
    if (dto.status === 'signed' && existing.status !== 'signed') {
      return this.contractRepository.markImmutable(id, user.id, user.email);
    }

    return updated;
  }

  async updateStatus(
    id: string,
    dto: UpdateContractStatusDto,
    user: AuthenticatedUser,
  ): Promise<Contract> {
    return this.update(id, dto, user);
  }

  async delete(id: string, user: AuthenticatedUser): Promise<void> {
    const contract = await this.findById(id);

    // GoBD compliance: Only draft contracts can be deleted
    if (contract.status !== 'draft') {
      throw new ForbiddenException({
        type: 'https://api.kompass.de/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: 'Only draft contracts can be deleted (GoBD compliance)',
      });
    }

    return this.contractRepository.delete(id, user.id, user.email);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const contract = await this.findById(id);

    const docDefinition: any = {
      content: [
        {
          text: `Auftragsbestätigung ${contract.contractNumber}`,
          style: 'header',
        },
        {
          text: `Datum: ${new Date(contract.contractDate).toLocaleDateString('de-DE')}`,
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Beschreibung', 'Menge', 'Einheit', 'Betrag'],
              ...contract.lineItems.map((item) => [
                item.description,
                item.quantity.toString(),
                item.unit || 'Stk',
                `${item.totalPrice.toFixed(2)} €`,
              ]),
            ],
          },
        },
        {
          text: `Gesamtbetrag: ${contract.totalEur.toFixed(2)} €`,
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

  async sendContract(id: string, user: AuthenticatedUser) {
    const contract = await this.findById(id);
    const pdfBuffer = await this.generatePdf(id);

    const recipient = 'customer@example.com';

    await this.mailService.sendMail({
      to: recipient,
      subject: `Auftragsbestätigung ${contract.contractNumber}`,
      text: `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie Ihre Auftragsbestätigung ${contract.contractNumber}.\n\nMit freundlichen Grüßen\nKompass Team`,
      attachments: [
        {
          filename: `Auftrag_${contract.contractNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return { success: true, message: 'Contract sent successfully' };
  }

  private async indexContract(contract: Contract) {
    try {
      await this.searchService.addDocuments('contracts', [
        {
          id: contract._id,
          contractNumber: contract.contractNumber,
          customerId: contract.customerId,
          totalEur: contract.totalEur,
          status: contract.status,
          contractDate: contract.contractDate,
        },
      ]);
    } catch (e) {
      console.error('Failed to index contract', e);
    }
  }
}
