import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { LeadRepository } from './lead.repository';
import { CustomerModule } from '../customer/customer.module'; // Import CustomerModule
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule, CustomerModule],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
  exports: [LeadService],
})
export class LeadModule {}
