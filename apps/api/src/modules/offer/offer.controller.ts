import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { OfferService } from './offer.service';
import {
  CreateOfferDto,
  UpdateOfferDto,
  UpdateOfferStatusDto,
} from './dto/offer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import type { OfferStatus } from './offer.repository';

@Controller('api/v1/offers')
@UseGuards(JwtAuthGuard, RbacGuard)
export class OfferController {
  constructor(private readonly offerService: OfferService) { }

  /**
   * GET /api/v1/offers/recommendations
   * Get recommended offers based on tags and customer
   */
  @Get('recommendations')
  @Permissions({ entity: 'Offer', action: 'READ' })
  async getRecommendations(
    @Query('tags') tags?: string | string[],
    @Query('customerId') customerId?: string,
  ) {
    const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;

    return this.offerService.getRecommendations({
      tags: tagArray,
      customerId,
    });
  }

  /**
   * GET /api/v1/offers
   * List all offers (paginated)
   */
  @Get()
  @Permissions({ entity: 'Offer', action: 'READ' })
  async findAll(
    @Query('status') status?: OfferStatus,
    @Query('customerId') customerId?: string,
    @Query('opportunityId') opportunityId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.offerService.findAll({
      status,
      customerId,
      opportunityId,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sort: sort || 'offerDate',
      order: order || 'desc',
    });
  }

  /**
   * GET /api/v1/offers/customer/:customerId
   * Get offers for a specific customer
   */
  @Get('customer/:customerId')
  @Permissions({ entity: 'Offer', action: 'READ' })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('status') status?: OfferStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.offerService.findByCustomer(customerId, {
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/offers/opportunity/:opportunityId
   * Get offers for a specific opportunity
   */
  @Get('opportunity/:opportunityId')
  @Permissions({ entity: 'Offer', action: 'READ' })
  async findByOpportunity(
    @Param('opportunityId') opportunityId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.offerService.findByOpportunity(opportunityId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/offers/:id
   * Get a specific offer by ID
   */
  @Get(':id')
  @Permissions({ entity: 'Offer', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.offerService.findById(id);
  }

  /**
   * POST /api/v1/offers
   * Create a new offer
   */
  @Post()
  @Permissions({ entity: 'Offer', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateOfferDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.offerService.create(dto, user);
  }

  /**
   * PUT /api/v1/offers/:id
   * Update an offer
   */
  @Put(':id')
  @Permissions({ entity: 'Offer', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.offerService.update(id, dto, user);
  }

  /**
   * PATCH /api/v1/offers/:id/status
   * Update offer status only
   */
  @Patch(':id/status')
  @Permissions({ entity: 'Offer', action: 'UPDATE' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOfferStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.offerService.updateStatus(id, dto, user);
  }

  /**
   * DELETE /api/v1/offers/:id
   * Delete an offer (draft only)
   */
  @Delete(':id')
  @Permissions({ entity: 'Offer', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.offerService.delete(id, user);
  }

  /**
   * GET /api/v1/offers/:id/pdf
   * Generate PDF for offer
   */
  @Get(':id/pdf')
  @Permissions({ entity: 'Offer', action: 'READ' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.offerService.generatePdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=offer-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  /**
   * POST /api/v1/offers/:id/send
   * Send offer via email
   */
  @Post(':id/send')
  @Permissions({ entity: 'Offer', action: 'UPDATE' })
  async sendOffer(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.offerService.sendOffer(id, user);
  }
}
