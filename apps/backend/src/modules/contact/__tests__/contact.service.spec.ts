/**
 * Contact Service Unit Tests
 *
 * Tests business logic for Contact management
 * Focus on decision authority RBAC restrictions
 */

import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import type { ContactPerson } from '@kompass/shared/types/entities/contact';
import {
  DecisionMakingRole,
  FunctionalRole,
} from '@kompass/shared/types/enums';

import { ContactService } from '../contact.service';
import type { UpdateDecisionAuthorityDto } from '../dto/update-decision-authority.dto';

describe('ContactService', () => {
  let service: ContactService;
  let repository: jest.Mocked<any>;
  let auditService: jest.Mocked<any>;

  const mockADMUser = {
    id: 'user-adm-001',
    role: 'ADM' as const,
  };

  const mockPLANUser = {
    id: 'user-plan-001',
    role: 'PLAN' as const,
  };

  const mockGFUser = {
    id: 'user-gf-001',
    role: 'GF' as const,
  };

  const mockContact: ContactPerson = {
    _id: 'contact-111',
    _rev: '1-abc',
    type: 'contact',
    firstName: 'Thomas',
    lastName: 'Schmidt',
    position: 'Einkaufsleiter',
    customerId: 'customer-123',
    decisionMakingRole: DecisionMakingRole.OPERATIONAL_CONTACT,
    authorityLevel: 'low',
    canApproveOrders: false,
    functionalRoles: [],
    departmentInfluence: [],
    assignedLocationIds: [],
    isPrimaryContactForLocations: [],
    createdBy: 'user-adm-001',
    createdAt: new Date(),
    modifiedBy: 'user-adm-001',
    modifiedAt: new Date(),
    version: 1,
  };

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findByCustomer: jest.fn(),
      update: jest.fn(),
    };

    auditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: 'IContactRepository',
          useValue: repository,
        },
        {
          provide: 'IAuditService',
          useValue: auditService,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  describe('getDecisionAuthority', () => {
    it('should return decision authority for any role', async () => {
      repository.findById.mockResolvedValue(mockContact);

      const result = await service.getDecisionAuthority(
        'contact-111',
        mockADMUser
      );

      expect(result.contactId).toBe('contact-111');
      expect(result.decisionMakingRole).toBe(
        DecisionMakingRole.OPERATIONAL_CONTACT
      );
      expect(result.authorityLevel).toBe('low');
    });

    it('should throw NotFoundException if contact not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.getDecisionAuthority('contact-999', mockADMUser)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateDecisionAuthority', () => {
    const updateDto: UpdateDecisionAuthorityDto = {
      decisionMakingRole: DecisionMakingRole.KEY_INFLUENCER,
      authorityLevel: 'high',
      canApproveOrders: true,
      approvalLimitEur: 50000,
      functionalRoles: [FunctionalRole.PURCHASING_MANAGER],
      departmentInfluence: ['purchasing', 'operations'],
    };

    it('should throw ForbiddenException if ADM tries to update decision roles', async () => {
      repository.findById.mockResolvedValue(mockContact);

      await expect(
        service.updateDecisionAuthority('contact-111', updateDto, mockADMUser)
      ).rejects.toThrow(ForbiddenException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if KALK tries to update decision roles', async () => {
      repository.findById.mockResolvedValue(mockContact);
      const kalkUser = { id: 'user-kalk-001', role: 'KALK' as const };

      await expect(
        service.updateDecisionAuthority('contact-111', updateDto, kalkUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow PLAN user to update decision roles', async () => {
      repository.findById.mockResolvedValue(mockContact);
      repository.update.mockResolvedValue({ ...mockContact, ...updateDto });

      const result = await service.updateDecisionAuthority(
        'contact-111',
        updateDto,
        mockPLANUser
      );

      expect(result.decisionMakingRole).toBe(DecisionMakingRole.KEY_INFLUENCER);
      expect(result.authorityLevel).toBe('high');
      expect(repository.update).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should allow GF user to update decision roles', async () => {
      repository.findById.mockResolvedValue(mockContact);
      repository.update.mockResolvedValue({ ...mockContact, ...updateDto });

      const result = await service.updateDecisionAuthority(
        'contact-111',
        updateDto,
        mockGFUser
      );

      expect(result.decisionMakingRole).toBe(DecisionMakingRole.KEY_INFLUENCER);
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if canApproveOrders=true but no approval limit', async () => {
      repository.findById.mockResolvedValue(mockContact);

      const invalidDto: UpdateDecisionAuthorityDto = {
        ...updateDto,
        canApproveOrders: true,
        approvalLimitEur: undefined,
      };

      await expect(
        service.updateDecisionAuthority('contact-111', invalidDto, mockPLANUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should log audit trail on decision role update', async () => {
      repository.findById.mockResolvedValue(mockContact);
      repository.update.mockResolvedValue({ ...mockContact, ...updateDto });

      await service.updateDecisionAuthority(
        'contact-111',
        updateDto,
        mockPLANUser
      );

      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: 'Contact',
          entityId: 'contact-111',
          action: 'UPDATE_DECISION_ROLE',
          userId: 'user-plan-001',
        })
      );
    });
  });

  describe('validateCustomerHasDecisionMaker', () => {
    it('should return warning if customer has no decision maker', async () => {
      repository.findByCustomer.mockResolvedValue([mockContact]);

      const result =
        await service.validateCustomerHasDecisionMaker('customer-123');

      expect(result.hasDecisionMaker).toBe(false);
      expect(result.warning).toBeDefined();
    });

    it('should return success if customer has decision maker', async () => {
      const decisionMakerContact: ContactPerson = {
        ...mockContact,
        decisionMakingRole: DecisionMakingRole.DECISION_MAKER,
      };
      repository.findByCustomer.mockResolvedValue([decisionMakerContact]);

      const result =
        await service.validateCustomerHasDecisionMaker('customer-123');

      expect(result.hasDecisionMaker).toBe(true);
      expect(result.warning).toBeUndefined();
    });

    it('should return success if customer has key influencer', async () => {
      const influencerContact: ContactPerson = {
        ...mockContact,
        decisionMakingRole: DecisionMakingRole.KEY_INFLUENCER,
      };
      repository.findByCustomer.mockResolvedValue([influencerContact]);

      const result =
        await service.validateCustomerHasDecisionMaker('customer-123');

      expect(result.hasDecisionMaker).toBe(true);
    });
  });
});
