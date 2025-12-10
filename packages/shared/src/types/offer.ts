import { BaseEntity } from "./base";
import { Comment } from "./comment";

export interface OfferLineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  unit?: string;
  vatRate: number; // Inferred from invoice, potentially missing in DTO, checking DTO again... DTO has top level taxRate. Line item might share it?
  // DTO doesn't show vatRate per line item but Form usually requires it.
  // Let's stick to DTO: OfferLineItemDto has total price, unit price.
  // But frontend InvoiceForm has vatRate per position.
  // Offer DTO shows top level taxRate.
  // I will add taxRate to OfferLineItem matching invoice or stick to top level which seems to be the design here.
  // Wait, DTO has top level `taxRate`.
}

export interface Offer extends BaseEntity {
  type: "offer";
  opportunityId: string;
  projectId?: string;
  customerId: string;
  contactPersonId?: string;
  offerNumber: string; // Server generated usually
  offerDate: string;
  validUntil: string;
  status:
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired"
  | "superseded";
  lineItems: OfferLineItem[];
  discountPercent?: number;
  taxRate?: number;
  currency?: string; // default EUR
  paymentTerms?: string; // Rich text or string
  deliveryTerms?: string;
  notes?: string;
  pdfUrl?: string; // Generated PDF
  rejectionReason?: string;

  // Totals (usually calculated but good to have)
  totalNet?: number;
  totalTax?: number;
  totalGross?: number;

  comments?: Comment[];
}
