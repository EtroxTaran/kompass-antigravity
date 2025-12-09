import { Injectable } from '@nestjs/common';
import { Delivery } from './delivery.entity';
import { DeliveryRepository } from './delivery.repository';

@Injectable()
export class DeliveryService {
    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    async findByPurchaseOrder(purchaseOrderId: string): Promise<Delivery[]> {
        return (await this.deliveryRepository.findBySelector({ purchaseOrderId })).data;
    }

    // Minimal methods for verification/mocking
    async create(delivery: Partial<Delivery>, userId: string): Promise<Delivery> {
        const newDelivery: Delivery = {
            _id: `delivery-${Date.now()}`,
            type: 'delivery',
            deliveryNumber: delivery.deliveryNumber || `DEL-${Date.now()}`,
            purchaseOrderId: delivery.purchaseOrderId!,
            supplierId: delivery.supplierId!,
            projectId: delivery.projectId,
            deliveryDate: delivery.deliveryDate || new Date().toISOString(),
            status: delivery.status || 'delivered',
            items: delivery.items || [],
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            createdBy: userId,
            modifiedBy: userId,
            version: 1,
        };
        return this.deliveryRepository.create(newDelivery, userId);
    }
}
