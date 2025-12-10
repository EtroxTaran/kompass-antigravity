import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { MagicLinkService } from './magic-link.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { ContactModule } from '../contact/contact.module';
import { CustomerModule } from '../customer/customer.module';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Session token duration
      }),
      inject: [ConfigService],
    }),
    MailModule,
    ContactModule,
    CustomerModule,
    ProjectModule,
  ],
  controllers: [PortalController],
  providers: [MagicLinkService],
})
export class PortalModule {}
