import { BaseEntity, Address } from "./base";

export type LocationType =
  | "headquarter"
  | "branch"
  | "warehouse"
  | "project_site"
  | "other";

export interface Location extends BaseEntity {
  type: "location";

  // Parent reference
  customerId: string;

  // Location identity
  locationName: string;
  locationType: LocationType;
  isActive: boolean;

  // Delivery address
  deliveryAddress: Address;

  // Location-specific contacts
  primaryContactPersonId?: string;
  contactPersons: string[];

  // Operational details
  deliveryNotes?: string;
  isInternal?: boolean;
  openingHours?: string;
  parkingInstructions?: string;
}
