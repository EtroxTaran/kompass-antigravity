import { BaseEntity } from '../../shared/base.repository';

export interface Delivery extends BaseEntity {
  deliveryNumber: string;
  purchaseOrderId: string;
  supplierId: string;
  projectId?: string;
  deliveryDate: string;
  status: 'pending' | 'delivered' | 'returned';
  items: DeliveryItem[];
  receivedBy?: string;
  receivedAt?: string;
}

export interface DeliveryItem {
  purchaseOrderItemId?: string; // Link to PO item Line ID if applicable
  description: string;
  quantity: number;
  unit?: string;
  notes?: string;
}
