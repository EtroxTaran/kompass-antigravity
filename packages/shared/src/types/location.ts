import { BaseEntity, Address } from './base';

export interface Location extends BaseEntity {
    type: 'location';

    // Parent reference
    customerId: string;

    // Location identity
    locationName: string;
    locationType:
    | 'headquarter'
    | 'branch'
    | 'warehouse'
    | 'project_site'
    | 'other';
    isActive: boolean;

    // Delivery address
    deliveryAddress: Address;

    // Contacts
    primaryContactPersonId?: string;
    contactPersons: string[]; // IDs

    // Operational
    deliveryNotes?: string;
    openingHours?: string;
    parkingInstructions?: string;
}
