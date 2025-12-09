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
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  UpdateContractDto,
  UpdateContractStatusDto,
  CreateContractFromOfferDto,
} from './dto/contract.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import type { ContractStatus } from './contract.repository';

@Controller('api/v1/contracts')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  /**
   * GET /api/v1/contracts
   * List all contracts (paginated)
   */
  @Get()
  @Permissions({ entity: 'Contract', action: 'READ' })
  async findAll(
    @Query('status') status?: ContractStatus,
    @Query('customerId') customerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.contractService.findAll({
      status,
      customerId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sort: sort || 'contractDate',
      order: order || 'desc',
    });
  }

  /**
   * GET /api/v1/contracts/active
   * Get active contracts (signed or in_progress)
   */
  @Get('active')
  @Permissions({ entity: 'Contract', action: 'READ' })
  async findActive(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contractService.findActive({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/contracts/customer/:customerId
   * Get contracts for a specific customer
   */
  @Get('customer/:customerId')
  @Permissions({ entity: 'Contract', action: 'READ' })
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('status') status?: ContractStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contractService.findByCustomer(customerId, {
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/contracts/offer/:offerId
   * Get contract for a specific offer
   */
  @Get('offer/:offerId')
  @Permissions({ entity: 'Contract', action: 'READ' })
  async findByOffer(@Param('offerId') offerId: string) {
    const contract = await this.contractService.findByOffer(offerId);
    if (!contract) {
      return { data: null, message: 'No contract found for this offer' };
    }
    return contract;
  }

  /**
   * GET /api/v1/contracts/:id
   * Get a specific contract by ID
   */
  @Get(':id')
  @Permissions({ entity: 'Contract', action: 'READ' })
  async findById(@Param('id') id: string) {
    return this.contractService.findById(id);
  }

  /**
   * POST /api/v1/contracts
   * Create a new contract
   */
  @Post()
  @Permissions({ entity: 'Contract', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContractDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contractService.create(dto, user);
  }

  /**
   * POST /api/v1/contracts/from-offer
   * Create a contract from an accepted offer
   */
  @Post('from-offer')
  @Permissions({ entity: 'Contract', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async createFromOffer(
    @Body() dto: CreateContractFromOfferDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contractService.createFromOffer(dto, user);
  }

  /**
   * PUT /api/v1/contracts/:id
   * Update a contract (limited for signed/finalized contracts - GoBD)
   */
  @Put(':id')
  @Permissions({ entity: 'Contract', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contractService.update(id, dto, user);
  }

  /**
   * PATCH /api/v1/contracts/:id/status
   * Update contract status only
   */
  @Patch(':id/status')
  @Permissions({ entity: 'Contract', action: 'UPDATE' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContractStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contractService.updateStatus(id, dto, user);
  }

  /**
   * DELETE /api/v1/contracts/:id
   * Delete a contract (draft only - GoBD compliance)
   */
  @Delete(':id')
  @Permissions({ entity: 'Contract', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.contractService.delete(id, user);
  }

  /**
   * GET /api/v1/contracts/:id/pdf
   * Generate PDF for contract
   */
  @Get(':id/pdf')
  @Permissions({ entity: 'Contract', action: 'READ' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.contractService.generatePdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=contract-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  /**
   * POST /api/v1/contracts/:id/send
   * Send contract via email
   */
  @Post(':id/send')
  @Permissions({ entity: 'Contract', action: 'UPDATE' })
  async sendContract(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contractService.sendContract(id, user);
  }
}
