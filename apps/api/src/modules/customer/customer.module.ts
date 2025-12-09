import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { SearchModule } from '../search/search.module';
import { ImportExportModule } from '../import-export/import-export.module';

import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [SearchModule, ImportExportModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
