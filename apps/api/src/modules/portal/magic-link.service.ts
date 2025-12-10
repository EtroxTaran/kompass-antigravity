import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ContactRepository } from '../contact/contact.repository';
// import { CustomerRepository } from '../customer/customer.repository'; // If needed for direct customer matching
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MagicLinkService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly contactRepository: ContactRepository,
    private readonly configService: ConfigService,
  ) {}

  async requestLink(email: string): Promise<void> {
    // 1. Find contact person with this email (we assume only contacts access portal for now, or main customer email)
    // Naive search: fetch all contacts and filter? No, we need findByEmail on repository.
    // Assuming we can search. For MVP, we might need to add findByEmail to ContactRepository or use SearchService.
    // Let's assume we can search via existing methods or add one.
    // Actually, ContactRepository likely has findOne or findAll.

    // For MVP efficiency, lets assume we have a way. If not, I'll add a method to ContactRepository later.
    // Using findAll and filtering for now if specific method missing, but better to use DB query.
    // MongoDB find:
    const contacts = await this.contactRepository.findAll();
    const contact = contacts.data.find((c) => c.email === email);

    if (!contact) {
      // Don't reveal user existence? Or maybe we strictly allow enrolled customers.
      // For MVP internal tool -> External portal, maybe fine to error.
      // But security best practice: send "if account exists" email or generic success.
      return;
    }

    // 2. Generate Token
    const payload = {
      email: contact.email,
      sub: contact._id,
      customerId: contact.customerId,
      type: 'magic-link',
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    // 3. Send Email
    const link = `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/portal/verify?token=${token}`;

    await this.mailService.sendMail({
      to: email,
      subject: 'Ihr Zugang zum Kompass Projektportal',
      html: `
            <h3>Willkommen im Projektportal</h3>
            <p>Klicken Sie auf den folgenden Link, um sich anzumelden:</p>
            <a href="${link}">Anmelden</a>
            <p>Der Link ist 15 Minuten gültig.</p>
        `,
    });
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'magic-link') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Return session token (user object for portal)
      // We might want to issue a longer lived token now for the session.
      const sessionPayload = {
        email: payload.email,
        sub: payload.sub,
        customerId: payload.customerId,
        role: 'customer_portal',
      };

      return {
        accessToken: this.jwtService.sign(sessionPayload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '24h',
        }),
        user: {
          id: payload.sub,
          email: payload.email,
          customerId: payload.customerId,
        },
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
