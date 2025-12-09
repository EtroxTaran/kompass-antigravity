import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { OfferRepository } from './offer.repository';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [PdfModule, MailModule, SearchModule],
  controllers: [OfferController],
  providers: [OfferService, OfferRepository],
  exports: [OfferService, OfferRepository],
})
export class OfferModule {}
