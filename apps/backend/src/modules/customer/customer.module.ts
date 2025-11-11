import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';

/**
 * Customer Module
 * 
 * Provides customer management functionality:
 * - CRUD operations
 * - RBAC enforcement
 * - Offline sync support
 * - Duplicate detection
 * - DSGVO compliance
 */
@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}

