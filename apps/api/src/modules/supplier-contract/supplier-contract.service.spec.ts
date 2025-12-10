import { Test, TestingModule } from '@nestjs/testing';
import { SupplierContractService } from './supplier-contract.service';
import { SupplierContractRepository } from './supplier-contract.repository';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupplierContract } from '@kompass/shared';

describe('SupplierContractService', () => {
  let service: SupplierContractService;
  let repository: Partial<SupplierContractRepository>;
  let pdfService: Partial<PdfService>;
  let mailService: Partial<MailService>;

  const mockContract = {
    _id: 'c1',
    status: 'draft',
    contractValue: 1000,
  } as SupplierContract;

  const mockRepo = {
    findById: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    generateContractNumber: jest.fn().mockResolvedValue('SC-001'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierContractService,
        { provide: SupplierContractRepository, useValue: mockRepo },
        { provide: PdfService, useValue: { generatePdf: jest.fn() } },
        { provide: MailService, useValue: { sendMail: jest.fn() } },
      ],
    }).compile();

    service = module.get<SupplierContractService>(SupplierContractService);
    repository = module.get(SupplierContractRepository);
    pdfService = module.get(PdfService);
    mailService = module.get(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('approve', () => {
    it('should approve contract < 50k without GF role', async () => {
      mockRepo.findById = jest
        .fn()
        .mockResolvedValue({ ...mockContract, contractValue: 40000 });
      mockRepo.update = jest
        .fn()
        .mockResolvedValue({ ...mockContract, status: 'sent_to_supplier' });

      const user = {
        id: 'u1',
        email: 'test@test.com',
        roles: ['ADM'],
        primaryRole: 'ADM',
        username: 'test',
      };
      await service.approve('c1', user);

      expect(mockRepo.update).toHaveBeenCalledWith(
        'c1',
        expect.objectContaining({ status: 'sent_to_supplier' }),
        user.id,
        user.email,
      );
    });

    it('should update to pending_approval if >= 50k and user not GF', async () => {
      mockRepo.findById = jest
        .fn()
        .mockResolvedValue({ ...mockContract, contractValue: 60000 });
      mockRepo.update = jest
        .fn()
        .mockResolvedValue({ ...mockContract, status: 'pending_approval' });

      const user = {
        id: 'u1',
        email: 'test@test.com',
        roles: ['ADM'],
        primaryRole: 'ADM',
        username: 'test',
      };
      await service.approve('c1', user);

      expect(mockRepo.update).toHaveBeenCalledWith(
        'c1',
        expect.objectContaining({ status: 'pending_approval' }),
        user.id,
        user.email,
      );
    });

    it('should throw Forbidden if >= 50k and already pending and user not GF', async () => {
      mockRepo.findById = jest.fn().mockResolvedValue({
        ...mockContract,
        contractValue: 60000,
        status: 'pending_approval',
      });

      const user = {
        id: 'u1',
        email: 'test@test.com',
        roles: ['ADM'],
        primaryRole: 'ADM',
        username: 'test',
      };

      await expect(service.approve('c1', user)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should approve contract >= 50k with GF role', async () => {
      mockRepo.findById = jest.fn().mockResolvedValue({
        ...mockContract,
        contractValue: 60000,
        status: 'pending_approval',
      });
      mockRepo.update = jest
        .fn()
        .mockResolvedValue({ ...mockContract, status: 'sent_to_supplier' });

      const user = {
        id: 'u2',
        email: 'gf@test.com',
        roles: ['GF'],
        primaryRole: 'GF',
        username: 'gf',
      };
      await service.approve('c1', user);

      expect(mockRepo.update).toHaveBeenCalledWith(
        'c1',
        expect.objectContaining({ status: 'sent_to_supplier' }),
        user.id,
        user.email,
      );
    });
  });

  describe('generatePdf', () => {
    it('should call pdfService.generatePdf', async () => {
      mockRepo.findById = jest.fn().mockResolvedValue(mockContract);
      (pdfService.generatePdf as jest.Mock).mockResolvedValue(
        Buffer.from('pdf'),
      );

      const result = await service.generatePdf('c1');
      expect(result).toBeInstanceOf(Buffer);
      expect(pdfService.generatePdf).toHaveBeenCalled();
    });
  });
});
