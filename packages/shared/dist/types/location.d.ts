import { BaseEntity, Address } from "./base";
export type LocationType = "headquarter" | "branch" | "warehouse" | "project_site" | "other";
export interface Location extends BaseEntity {
    type: "location";
    customerId: string;
    locationName: string;
    locationType: LocationType;
    isActive: boolean;
    deliveryAddress: Address;
    primaryContactPersonId?: string;
    contactPersons: string[];
    deliveryNotes?: string;
    isInternal?: boolean;
    openingHours?: string;
    parkingInstructions?: string;
}
