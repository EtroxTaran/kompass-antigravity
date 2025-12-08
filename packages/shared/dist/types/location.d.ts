import { BaseEntity, Address } from './base';
export interface Location extends BaseEntity {
    type: 'location';
    customerId: string;
    locationName: string;
    locationType: 'headquarter' | 'branch' | 'warehouse' | 'project_site' | 'other';
    isActive: boolean;
    deliveryAddress: Address;
    primaryContactPersonId?: string;
    contactPersons: string[];
    deliveryNotes?: string;
    openingHours?: string;
    parkingInstructions?: string;
}
