import { Test, TestingModule } from '@nestjs/testing';
import { MagicLinkService } from './magic-link.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ContactRepository } from '../contact/contact.repository';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('MagicLinkService', () => {
    let service: MagicLinkService;
    let jwtService: JwtService;
    let mailService: MailService;
    let contactRepository: ContactRepository;

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const mockMailService = {
        sendMail: jest.fn(),
    };

    const mockContactRepository = {
        findAll: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'JWT_SECRET') return 'secret';
            if (key === 'FRONTEND_URL') return 'http://localhost:3000';
            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MagicLinkService,
                { provide: JwtService, useValue: mockJwtService },
                { provide: MailService, useValue: mockMailService },
                { provide: ContactRepository, useValue: mockContactRepository },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<MagicLinkService>(MagicLinkService);
        jwtService = module.get<JwtService>(JwtService);
        mailService = module.get<MailService>(MailService);
        contactRepository = module.get<ContactRepository>(ContactRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('requestLink', () => {
        it('should send an email if contact exists', async () => {
            const email = 'test@example.com';
            const contact = { _id: '123', email, customerId: 'cust1' };
            mockContactRepository.findAll.mockResolvedValue({ data: [contact] });
            mockJwtService.sign.mockReturnValue('mockToken');

            await service.requestLink(email);

            expect(contactRepository.findAll).toHaveBeenCalled();
            expect(jwtService.sign).toHaveBeenCalledWith(
                { email, sub: '123', customerId: 'cust1', type: 'magic-link' },
                expect.any(Object)
            );
            expect(mockMailService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: email,
                subject: 'Ihr Zugang zum Kompass Projektportal'
            }));
        });

        it('should do nothing if contact does not exist', async () => {
            mockContactRepository.findAll.mockResolvedValue({ data: [] });

            await service.requestLink('nonexistent@example.com');

            expect(mockMailService.sendMail).not.toHaveBeenCalled();
        });
    });

    describe('verifyToken', () => {
        it('should return access token and user if token is valid', async () => {
            const token = 'validToken';
            const payload = { email: 'test@example.com', sub: '123', customerId: 'cust1', type: 'magic-link' };
            mockJwtService.verify.mockReturnValue(payload);
            mockJwtService.sign.mockReturnValue('sessionToken');

            const result = await service.verifyToken(token);

            expect(result).toEqual({
                accessToken: 'sessionToken',
                user: { id: '123', email: 'test@example.com', customerId: 'cust1' }
            });
            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'customer_portal' }),
                expect.any(Object)
            );
        });

        it('should throw UnauthorizedException if token type is invalid', async () => {
            const token = 'invalidTypeToken';
            const payload = { email: 'test@example.com', sub: '123', customerId: 'cust1', type: 'other' };
            mockJwtService.verify.mockReturnValue(payload);

            await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if verify fails', async () => {
            const token = 'badToken';
            mockJwtService.verify.mockImplementation(() => { throw new Error(); });

            await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
        });
    });
});
