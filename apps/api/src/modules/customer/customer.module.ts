import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { SearchModule } from '../search/search.module';
import { ImportExportModule } from '../import-export/import-export.module';

import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { ContactModule } from '../contact/contact.module';
import { LocationModule } from '../location/location.module';
import { ProtocolModule } from '../protocol/protocol.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    SearchModule,
    ImportExportModule,
    forwardRef(() => ContactModule),
    forwardRef(() => LocationModule),
    forwardRef(() => ProtocolModule),
    forwardRef(() => ProjectModule),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
