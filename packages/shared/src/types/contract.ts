import { BaseEntity } from "./base";
import { OfferLineItem } from "./offer";

export interface Contract extends BaseEntity {
  type: "contract";
  title: string;
  contractNumber: string;
  customerId: string;
  projectId?: string;
  offerId?: string;

  startDate: string;
  endDate?: string; // Optional for ongoing
  status: "draft" | "active" | "terminated" | "expired" | "completed";

  value?: number; // Total value (derived from lineItems)
  currency: string;
  paymentCycle?: "monthly" | "quarterly" | "yearly" | "one_time";

  // Line Items (from Offer or manually added)
  lineItems?: OfferLineItem[];
  discountPercent?: number;
  taxRate?: number;

  paymentTerms?: string;
  deliveryTerms?: string;
  termsAndConditions?: string; // Rich text
  cancellationNoticePeriod?: string;

  contactPersonId?: string;
  signedAt?: string;
  signedBy?: string; // Name of person who signed

  documents?: string[]; // URLs to attachments
  notes?: string;
  pdfUrl?: string;
}
