import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupplierRepository, Supplier } from './supplier.repository';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class SupplierService {
  constructor(
    private readonly supplierRepository: SupplierRepository,
    private readonly mailService: MailService,
  ) { }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      rating?: string;
    } = {},
  ) {
    if (options.search) {
      return this.supplierRepository.searchByName(options.search, options);
    }
    if (options.rating) {
      return this.supplierRepository.findByRating(options.rating, options);
    }
    return this.supplierRepository.findAll(options);
  }

  async findById(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Supplier with ID '${id}' not found`,
        resourceType: 'Supplier',
        resourceId: id,
      });
    }
    return supplier;
  }

  async create(
    dto: CreateSupplierDto,
    user: { id: string; email?: string },
  ): Promise<Supplier> {
    const supplierData = {
      ...dto,
      status: 'PendingApproval',
      category: dto.category || [],
      billingAddress: {
        ...dto.billingAddress,
        country: dto.billingAddress.country || 'Deutschland',
      },
    };
    return this.supplierRepository.create(
      supplierData as Partial<Supplier>,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: UpdateSupplierDto,
    user: { id: string; email?: string },
  ): Promise<Supplier> {
    await this.findById(id);
    return this.supplierRepository.update(
      id,
      dto as Partial<Supplier>,
      user.id,
      user.email,
    );
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    await this.findById(id);
    return this.supplierRepository.delete(id, user.id, user.email);
  }
  async blacklist(
    id: string,
    user: { id: string; email?: string },
    reason: string,
  ): Promise<Supplier> {
    const supplier = await this.findById(id);

    if (supplier.activeProjectCount && supplier.activeProjectCount > 0) {
      throw new BadRequestException(
        'Cannot blacklist supplier with active project assignments',
      );
    }

    if (!reason || reason.trim().length < 20) {
      throw new BadRequestException(
        'Blacklist reason is mandatory and must be at least 20 characters',
      );
    }

    return this.supplierRepository.update(
      id,
      {
        status: 'Blacklisted',
        blacklistReason: reason,
        blacklistedBy: user.id,
        blacklistedAt: new Date().toISOString(),
      } as Partial<Supplier>,
      user.id,
      user.email,
    );
  }

  async reinstate(
    id: string,
    user: { id: string; email?: string },
  ): Promise<Supplier> {
    const supplier = await this.findById(id);

    if (supplier.status !== 'Blacklisted') {
      throw new BadRequestException('Supplier is not blacklisted');
    }

    return this.supplierRepository.update(
      id,
      {
        status: 'Inactive', // Needs re-approval usually, setting to Inactive for safety
        reinstatedBy: user.id,
        reinstatedAt: new Date().toISOString(),
        // Clear blacklist info? Often better to keep history, but for current state we might want to clear or keep as history.
        // Requirements say "Blacklist history visible", so we shouldn't wipe fields immediately if we want to show them.
        // But for 'current status', we just change status.
        // Let's keep the old blacklist info there or maybe we need a separate history log. 
        // For now, simple state change.
      } as Partial<Supplier>,
      user.id,
      user.email,
    );
  }
  async approve(
    id: string,
    user: { id: string; email?: string },
  ): Promise<Supplier> {
    const supplier = await this.findById(id);

    if (supplier.status !== 'PendingApproval') {
      throw new BadRequestException('Supplier is not pending approval');
    }

    const updated = await this.supplierRepository.update(
      id,
      {
        status: 'Active',
        approvedBy: user.id,
        approvedAt: new Date().toISOString(),
      } as Partial<Supplier>,
      user.id,
      user.email,
    );

    // Notify INN (Innovation/Procurement) or maybe the one who created it?
    // Requirement says "Email notification to INN on approval/rejection"
    // Assuming hardcoded email for now or environment variable
    const recipient = process.env.INN_EMAIL || 'inn@kompass.local';
    await this.mailService.sendMail({
      to: recipient,
      subject: `Lieferant genehmigt: ${supplier.companyName}`,
      text: `Der Lieferant ${supplier.companyName} wurde von ${user.email} genehmigt und ist nun aktiv.`,
    });

    return updated;
  }

  async reject(
    id: string,
    user: { id: string; email?: string },
    reason: string,
  ): Promise<Supplier> {
    const supplier = await this.findById(id);

    if (supplier.status !== 'PendingApproval') {
      throw new BadRequestException('Supplier is not pending approval');
    }

    const updated = await this.supplierRepository.update(
      id,
      {
        status: 'Rejected',
        rejectedBy: user.id,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      } as Partial<Supplier>,
      user.id,
      user.email,
    );

    const recipient = process.env.INN_EMAIL || 'inn@kompass.local';
    await this.mailService.sendMail({
      to: recipient,
      subject: `Lieferant abgelehnt: ${supplier.companyName}`,
      text: `Der Lieferant ${supplier.companyName} wurde von ${user.email} abgelehnt.\nGrund: ${reason}`,
    });

    return updated;
  }
}
