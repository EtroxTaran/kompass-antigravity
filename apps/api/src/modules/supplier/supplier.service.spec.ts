import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { SupplierRepository } from './supplier.repository';
import { MailService } from '../mail/mail.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SupplierService', () => {
    let service: SupplierService;
    let repository: Partial<SupplierRepository>;

    const mockSupplier = {
        _id: 'supplier-1',
        _rev: '1-rev',
        type: 'supplier',
        companyName: 'Test Supplier',
        billingAddress: {},
        status: 'Active',
        activeProjectCount: 0,
    };

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    beforeEach(async () => {
        repository = {
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
        };

        const mailService = {
            sendMail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupplierService,
                { provide: SupplierRepository, useValue: repository },
                { provide: MailService, useValue: mailService },
            ],
        }).compile();

        service = module.get<SupplierService>(SupplierService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('blacklist', () => {
        it('should blacklist a supplier successfully', async () => {
            (repository.findById as jest.Mock).mockResolvedValue(mockSupplier);
            (repository.update as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Blacklisted',
            });

            const reason = 'Repeated quality issues with deliveries';
            await service.blacklist('supplier-1', mockUser, reason);

            expect(repository.update).toHaveBeenCalledWith(
                'supplier-1',
                expect.objectContaining({
                    status: 'Blacklisted',
                    blacklistReason: reason,
                    blacklistedBy: mockUser.id,
                }),
                mockUser.id,
                mockUser.email,
            );
        });

        it('should fail if reason is too short', async () => {
            (repository.findById as jest.Mock).mockResolvedValue(mockSupplier);

            await expect(
                service.blacklist('supplier-1', mockUser, 'Too short'),
            ).rejects.toThrow(BadRequestException);
        });

        it('should fail if supplier has active projects', async () => {
            (repository.findById as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                activeProjectCount: 2,
            });

            await expect(
                service.blacklist('supplier-1', mockUser, 'Valid reason but has projects'),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('reinstate', () => {
        it('should reinstate a blacklisted supplier', async () => {
            (repository.findById as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Blacklisted',
            });
            (repository.update as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Inactive',
            });

            await service.reinstate('supplier-1', mockUser);

            expect(repository.update).toHaveBeenCalledWith(
                'supplier-1',
                expect.objectContaining({
                    status: 'Inactive',
                    reinstatedBy: mockUser.id,
                }),
                mockUser.id,
                mockUser.email,
            );
        });

        it('should fail if supplier is not blacklisted', async () => {
            (repository.findById as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Active',
            });

            await expect(service.reinstate('supplier-1', mockUser)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('approve', () => {
        it('should approve a pending supplier', async () => {
            (repository.findById as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'PendingApproval',
            });
            (repository.update as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Active',
            });

            await service.approve('supplier-1', mockUser);

            expect(repository.update).toHaveBeenCalledWith(
                'supplier-1',
                expect.objectContaining({
                    status: 'Active',
                    approvedBy: mockUser.id,
                }),
                mockUser.id,
                mockUser.email,
            );
        });

        it('should fail if supplier is not pending approval', async () => {
            (repository.findById as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Active',
            });

            await expect(service.approve('supplier-1', mockUser)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('reject', () => {
        it('should reject a pending supplier with reason', async () => {
            (repository.findById as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'PendingApproval',
            });
            (repository.update as jest.Mock).mockResolvedValue({
                ...mockSupplier,
                status: 'Rejected',
            });

            await service.reject('supplier-1', mockUser, 'Not up to standards');

            expect(repository.update).toHaveBeenCalledWith(
                'supplier-1',
                expect.objectContaining({
                    status: 'Rejected',
                    rejectedBy: mockUser.id,
                    rejectionReason: 'Not up to standards',
                }),
                mockUser.id,
                mockUser.email,
            );
        });
    });
});
