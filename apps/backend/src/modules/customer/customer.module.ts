import { Module } from '@nestjs/common';

import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';

/**
 * Customer Module
 *
 * Provides customer management functionality:
 * - CRUD operations
 * - RBAC enforcement
 * - Offline sync support
 * - Duplicate detection
 * - DSGVO compliance
 *
 * Dependencies:
 * - DatabaseModule (Global) - Provides NANO CouchDB client
 * - AuthModule - Provides JwtAuthGuard and RbacGuard
 */
@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
    {
      provide: 'IAuditService',
      useValue: {
        log: async () => {
          // No-op audit service (placeholder until AuditService is implemented)
          // This allows the service to work without throwing errors
        },
      },
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
