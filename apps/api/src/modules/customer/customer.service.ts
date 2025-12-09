import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepository, Customer } from './customer.repository';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { SearchService } from '../search/search.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly searchService: SearchService,
  ) {}

  async findAll(
    options: { page?: number; limit?: number; search?: string } = {},
  ) {
    if (options.search) {
      // Use MeiliSearch if query is provided
      try {
        const searchResults = await this.searchService.search(
          'customers',
          options.search,
          {
            limit: options.limit || 20,
            offset: options.page
              ? (options.page - 1) * (options.limit || 20)
              : 0,
          },
        );
        // If we want to return full entities, we might need to fetch them from DB using IDs from search
        // For MVP, lets trust the search index or just return the IDs.
        // Better pattern: Get IDs from search -> Fetch from DB.
        const ids = searchResults.hits.map((h: any) => h.id);
        if (ids.length === 0) return { data: [], total: 0 };

        // Fetch details from DB (Naive implementation for MVP)
        const customers = await Promise.all(
          ids.map((id) => this.customerRepository.findById(id)),
        );
        return {
          data: customers.filter((c) => c !== null),
          total: searchResults.estimatedTotalHits,
        };
      } catch (error) {
        // Fallback to DB search if Meili fails
        return this.customerRepository.searchByCompanyName(
          options.search,
          options,
        );
      }
    }
    return this.customerRepository.findAll(options);
  }

  private async indexCustomer(customer: Customer) {
    try {
      await this.searchService.addDocuments('customers', [
        {
          id: customer._id,
          companyName: customer.companyName,
          // customerNumber might be part of the doc body, assuming it exists on the interface
          customerNumber: (customer as any).customerNumber,
          email: customer.email,
          phone: customer.phone,
          city: customer.billingAddress?.city,
        },
      ]);
    } catch (e) {
      console.error('Failed to index customer', e);
    }
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Customer with ID '${id}' not found`,
        resourceType: 'Customer',
        resourceId: id,
      });
    }
    return customer;
  }

  async findByOwner(
    ownerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.customerRepository.findByOwner(ownerId, options);
  }

  async create(
    dto: CreateCustomerDto,
    user: { id: string; email?: string },
  ): Promise<Customer> {
    // Validate defaultDeliveryLocationId if provided
    if (dto.defaultDeliveryLocationId && dto.locations) {
      if (!dto.locations.includes(dto.defaultDeliveryLocationId)) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail:
            "Default delivery location must be one of the customer's locations",
          errors: [
            {
              field: 'defaultDeliveryLocationId',
              message: 'Must reference an ID in the locations array',
              value: dto.defaultDeliveryLocationId,
            },
          ],
        });
      }
    }

    // Set default values
    const customerData = {
      ...dto,
      locations: dto.locations || [],
      contactPersons: dto.contactPersons || [],
      billingAddress: {
        ...dto.billingAddress,
        country: dto.billingAddress.country || 'Deutschland',
      },
    };

    const newCustomer = await this.customerRepository.create(
      customerData as Partial<Customer>,
      user.id,
      user.email,
    );
    this.indexCustomer(newCustomer);
    return newCustomer;
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
    user: { id: string; email?: string },
  ): Promise<Customer> {
    // Ensure customer exists
    await this.findById(id);

    // Validate defaultDeliveryLocationId if provided
    if (dto.defaultDeliveryLocationId && dto.locations) {
      if (!dto.locations.includes(dto.defaultDeliveryLocationId)) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail:
            "Default delivery location must be one of the customer's locations",
          errors: [
            {
              field: 'defaultDeliveryLocationId',
              message: 'Must reference an ID in the locations array',
              value: dto.defaultDeliveryLocationId,
            },
          ],
        });
      }
    }

    const updatedCustomer = await this.customerRepository.update(
      id,
      dto as Partial<Customer>,
      user.id,
      user.email,
    );
    this.indexCustomer(updatedCustomer);
    return updatedCustomer;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    // Ensure customer exists
    await this.findById(id);

    return this.customerRepository.delete(id, user.id, user.email);
  }
}
