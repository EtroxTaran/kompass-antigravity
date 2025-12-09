import { Module, forwardRef } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { ContractRepository } from './contract.repository';
import { OfferModule } from '../offer/offer.module';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [forwardRef(() => OfferModule), PdfModule, MailModule, SearchModule],
  controllers: [ContractController],
  providers: [ContractService, ContractRepository],
  exports: [ContractService, ContractRepository],
})
export class ContractModule {}
