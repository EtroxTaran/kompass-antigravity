import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  OfferRepository,
  Offer,
  OfferQueryOptions,
  OfferLineItem,
} from './offer.repository';
import {
  CreateOfferDto,
  UpdateOfferDto,
  UpdateOfferStatusDto,
  OfferLineItemDto,
} from './dto/offer.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { SearchService } from '../search/search.service';
import { ProjectService } from '../project/project.service';
import { v4 as uuidv4 } from 'uuid';

// Valid status transitions for Offer
const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['sent', 'superseded'],
  sent: ['viewed', 'accepted', 'rejected', 'expired', 'superseded'],
  viewed: ['accepted', 'rejected', 'expired', 'superseded'],
  accepted: [], // Terminal (leads to Contract creation)
  rejected: ['superseded'], // Can be superseded with new offer
  expired: ['superseded'], // Can be superseded with new offer
  superseded: [], // Terminal
};

@Injectable()
export class OfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
    private readonly searchService: SearchService,
    private readonly projectService: ProjectService,
  ) {}

  async getRecommendations(criteria: {
    tags?: string[];
    customerId?: string;
    budget?: number; // Optional, might be inferred from other sources if needed
  }) {
    // 1. Find similar projects
    const similarProjects = await this.projectService.findBySimilarity({
      tags: criteria.tags,
      customerId: criteria.customerId,
      budget: criteria.budget,
    });

    if (similarProjects.length === 0) {
      return [];
    }

    // 2. Fetch offers for these projects
    // We want the "latest" or "accepted" offers ideally, to serve as best-practice templates.
    const projectIds = similarProjects.map((p) => p._id);
    const offers = await Promise.all(
      projectIds.map(async (projectId) => {
        // Find offers for this project/opportunity
        // Typically offers are linked to opportunities, which are linked to projects?
        // Or projects linked to offers (offerId field in Project)?
        // The Project entity has an `offerId` field which likely points to the winning offer.
        // Let's use that if available.
        const project = similarProjects.find((p) => p._id === projectId);
        if (project && project.offerId) {
          return this.findById(project.offerId).catch(() => null);
        }

        // Fallback: If no winning offer linked, maybe search for offers by Customer (approximate)
        // or just skip. For accurate templates, we need the Offer that defined the Project.
        return null;
      }),
    );

    const validOffers = offers.filter((o) => o !== null);

    // 3. Map to specific recommendation format
    return validOffers.map((offer) => ({
      id: offer._id,
      description: `Template from Project: ${
        similarProjects.find((p) => p.offerId === offer._id)?.name || 'Unknown'
      }`,
      totalEur: offer.totalEur,
      lineItemCount: offer.lineItems.length,
      tags: similarProjects.find((p) => p.offerId === offer._id)?.tags || [],
      // We return the full offer or a subset? Full offer is useful for "applying" it.
      offerData: offer,
    }));
  }

  async findAll(options: OfferQueryOptions = {}) {
    if (options.search) {
      try {
        const searchResults = await this.searchService.search(
          'offers',
          options.search,
          {
            limit: options.limit || 20,
            offset: options.page
              ? (options.page - 1) * (options.limit || 20)
              : 0,
          },
        );
        const ids = searchResults.hits.map((h: any) => h.id);
        if (ids.length === 0) return { data: [], total: 0 };

        // Fetch from DB
        const offers = await Promise.all(
          ids.map((id) => this.offerRepository.findById(id)),
        );
        return {
          data: offers.filter((o) => o !== null),
          total: searchResults.estimatedTotalHits,
        };
      } catch (error) {
        // Fallback to normal find if search fails
        return this.offerRepository.findAll(options);
      }
    }
    return this.offerRepository.findAll(options);
  }

  async findById(id: string): Promise<Offer> {
    const offer = await this.offerRepository.findById(id);
    if (!offer) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Offer with ID '${id}' not found`,
        resourceType: 'Offer',
        resourceId: id,
      });
    }
    return offer;
  }

  async findByCustomer(customerId: string, options: OfferQueryOptions = {}) {
    return this.offerRepository.findByCustomer(customerId, options);
  }

  async findByOpportunity(
    opportunityId: string,
    options: OfferQueryOptions = {},
  ) {
    return this.offerRepository.findByOpportunity(opportunityId, options);
  }

  async create(dto: CreateOfferDto, user: AuthenticatedUser): Promise<Offer> {
    // Validate offer date
    const offerDate = new Date(dto.offerDate);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    if (offerDate < weekAgo) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Offer date must be within the last 7 days',
        errors: [
          {
            field: 'offerDate',
            message: 'Offer date must be within the last 7 days',
          },
        ],
      });
    }

    // Validate validUntil is after offerDate
    const validUntil = new Date(dto.validUntil);
    if (validUntil <= offerDate) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Valid until date must be after offer date',
        errors: [
          {
            field: 'validUntil',
            message: 'Valid until date must be after offer date',
          },
        ],
      });
    }

    // Generate offer number
    const offerNumber = await this.offerRepository.generateOfferNumber();

    // Calculate line item totals and generate IDs
    const lineItems: OfferLineItem[] = dto.lineItems.map((item) => ({
      id: item.id || uuidv4(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: Math.round(item.quantity * item.unitPrice * 100) / 100,
      unit: item.unit,
    }));

    // Handle materials if present
    const materials = dto.materials
      ? dto.materials.map((m) => ({
          id: m.id || uuidv4(),
          materialId: m.materialId,
          description: m.description,
          quantity: m.quantity,
          unit: m.unit,
        }))
      : undefined;

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

    const offerData: Partial<Offer> = {
      offerNumber,
      opportunityId: dto.opportunityId,
      customerId: dto.customerId,
      contactPersonId: dto.contactPersonId,
      offerDate: dto.offerDate,
      validUntil: dto.validUntil,
      status: dto.status || 'draft',
      lineItems,
      subtotalEur,
      discountPercent,
      discountEur,
      taxRate,
      taxEur,
      totalEur,
      currency: dto.currency || 'EUR',
      paymentTerms: dto.paymentTerms,
      deliveryTerms: dto.deliveryTerms,
      notes: dto.notes,
      materials,
    };

    const newOffer = await this.offerRepository.create(
      offerData,
      user.id,
      user.email,
    );
    this.indexOffer(newOffer);
    return newOffer;
  }

  async update(
    id: string,
    dto: UpdateOfferDto,
    user: AuthenticatedUser,
  ): Promise<Offer> {
    const existing = await this.findById(id);

    // Only draft offers can be fully edited
    if (
      existing.status !== 'draft' &&
      (dto.lineItems || dto.discountPercent !== undefined)
    ) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Only draft offers can have line items or pricing modified',
        errors: [
          { field: 'status', message: 'Only draft offers can be fully edited' },
        ],
      });
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

    const updateData: Partial<Offer> = {
      ...(dto.contactPersonId !== undefined && {
        contactPersonId: dto.contactPersonId,
      }),
      ...(dto.offerDate !== undefined && { offerDate: dto.offerDate }),
      ...(dto.validUntil !== undefined && { validUntil: dto.validUntil }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.paymentTerms !== undefined && { paymentTerms: dto.paymentTerms }),
      ...(dto.deliveryTerms !== undefined && {
        deliveryTerms: dto.deliveryTerms,
      }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.pdfUrl !== undefined && { pdfUrl: dto.pdfUrl }),
      ...(dto.rejectionReason !== undefined && {
        rejectionReason: dto.rejectionReason,
      }),
    };

    // Update materials if provided
    if (dto.materials) {
      updateData.materials = dto.materials.map((m) => ({
        id: m.id || uuidv4(),
        materialId: m.materialId,
        description: m.description,
        quantity: m.quantity,
        unit: m.unit,
      }));
    }

    // Recalculate totals if line items changed
    if (dto.lineItems) {
      const lineItems: OfferLineItem[] = dto.lineItems.map((item) => ({
        id: item.id || uuidv4(),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: Math.round(item.quantity * item.unitPrice * 100) / 100,
        unit: item.unit,
      }));

      const subtotalEur = lineItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      const discountPercent =
        dto.discountPercent ?? existing.discountPercent ?? 0;
      const discountEur =
        Math.round(((subtotalEur * discountPercent) / 100) * 100) / 100;
      const afterDiscount = subtotalEur - discountEur;
      const taxRate = dto.taxRate ?? existing.taxRate ?? 0.19;
      const taxEur = Math.round(afterDiscount * taxRate * 100) / 100;
      const totalEur = Math.round((afterDiscount + taxEur) * 100) / 100;

      updateData.lineItems = lineItems;
      updateData.subtotalEur = subtotalEur;
      updateData.discountPercent = discountPercent;
      updateData.discountEur = discountEur;
      updateData.taxRate = taxRate;
      updateData.taxEur = taxEur;
      updateData.totalEur = totalEur;
    }

    // Set timestamp based on status change
    if (dto.status === 'sent' && existing.status !== 'sent') {
      updateData.sentAt = new Date().toISOString();
    }
    if (dto.status === 'viewed' && !existing.viewedAt) {
      updateData.viewedAt = new Date().toISOString();
    }
    if (dto.status === 'accepted') {
      updateData.acceptedAt = new Date().toISOString();
    }
    if (dto.status === 'rejected') {
      updateData.rejectedAt = new Date().toISOString();
      if (!dto.rejectionReason) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: 'Rejection reason is required when rejecting an offer',
          errors: [
            {
              field: 'rejectionReason',
              message: 'Rejection reason is required',
            },
          ],
        });
      }
    }

    const updatedOffer = await this.offerRepository.update(
      id,
      updateData,
      user.id,
      user.email,
    );
    this.indexOffer(updatedOffer);
    return updatedOffer;
  }

  async updateStatus(
    id: string,
    dto: UpdateOfferStatusDto,
    user: AuthenticatedUser,
  ): Promise<Offer> {
    return this.update(id, dto, user);
  }

  async delete(id: string, user: AuthenticatedUser): Promise<void> {
    const offer = await this.findById(id);

    // Only draft offers can be deleted
    if (offer.status !== 'draft') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Only draft offers can be deleted',
      });
    }

    return this.offerRepository.delete(id, user.id, user.email);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const offer = await this.findById(id);

    const docDefinition: any = {
      content: [
        { text: `Angebot ${offer.offerNumber}`, style: 'header' },
        {
          text: `Datum: ${new Date(offer.offerDate).toLocaleDateString('de-DE')}`,
          margin: [0, 10, 0, 20],
        },
        {
          text: `Gültig bis: ${new Date(offer.validUntil).toLocaleDateString('de-DE')}`,
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Start', 'Ende', 'Beschreibung', 'Betrag'],
              ...offer.lineItems.map((item) => [
                '--',
                '--',
                item.description,
                `${item.totalPrice.toFixed(2)} €`,
              ]),
            ],
          },
        },
        {
          text: `Gesamtbetrag: ${offer.totalEur.toFixed(2)} €`,
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

  async sendOffer(id: string, user: AuthenticatedUser) {
    const offer = await this.findById(id);
    const pdfBuffer = await this.generatePdf(id);

    // TODO: Ideally fetch customer email from CustomerService
    const recipient = 'customer@example.com';

    await this.mailService.sendMail({
      to: recipient,
      subject: `Angebot ${offer.offerNumber}`,
      text: `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie unser Angebot ${offer.offerNumber}.\n\nMit freundlichen Grüßen\nKompass Team`,
      attachments: [
        {
          filename: `Angebot_${offer.offerNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (offer.status === 'draft') {
      await this.update(id, { status: 'sent' }, user);
    }

    return { success: true, message: 'Offer sent successfully' };
  }

  private async indexOffer(offer: Offer) {
    try {
      await this.searchService.addDocuments('offers', [
        {
          id: offer._id,
          offerNumber: offer.offerNumber,
          customerId: offer.customerId,
          opportunityId: offer.opportunityId,
          totalEur: offer.totalEur,
          status: offer.status,
          offerDate: offer.offerDate,
        },
      ]);
    } catch (e) {
      console.error('Failed to index offer', e);
    }
  }
}
