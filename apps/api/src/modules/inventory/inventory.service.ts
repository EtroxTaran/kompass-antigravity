import { Injectable, NotFoundException } from "@nestjs/common";
import { InventoryMovementRepository } from "./inventory.repository";
import { CreateInventoryMovementDto } from "./inventory.dto";
import { InventoryMovement, Material } from "@kompass/shared";
import { MaterialRepository } from "../material/material.repository";
import { MailService } from "../mail/mail.service";

@Injectable()
export class InventoryService {
    constructor(
        private readonly movementRepo: InventoryMovementRepository,
        private readonly materialRepo: MaterialRepository,
        private readonly mailService: MailService
    ) { }

    async recordMovement(dto: CreateInventoryMovementDto, userId: string): Promise<InventoryMovement> {
        // 1. Get Material
        const material = await this.materialRepo.findById(dto.materialId);
        if (!material) {
            throw new NotFoundException("Material not found");
        }

        // 2. Create Movement
        const movement: InventoryMovement = {
            ...dto,
            type: "inventory_movement",
            recordedBy: userId,
            // Calculate costs if unit cost is available on material or passed in DTO (future scope)
        } as any; // Cast for now as base entity fields handled by repo

        const savedMovement = await this.movementRepo.create(movement, userId);

        // 3. Update Material Stock
        const quantityChange = dto.quantity;

        const currentStock = material.currentStock || 0;
        const newStock = currentStock + quantityChange; // Trusting signed quantity

        const updateData: Partial<Material> = {
            currentStock: newStock,
        };

        // Update usage stats if outgoing
        if (quantityChange < 0) {
            updateData.lastUsedDate = new Date().toISOString();
            updateData.timesUsed = (material.timesUsed || 0) + 1;
        }

        await this.materialRepo.update(material._id, updateData, userId);

        // 4. Check for Low Stock Alert
        // Only alert if we dropped below (or equal to) min stock AND we were above it before (to avoid spam, ideally)
        // For simple MVP: Alert if newStock <= minStock
        if (material.minimumStock !== undefined && newStock <= material.minimumStock) {
            // Avoid spam? Ideally check if we already alerted. But stateless for now.
            // Check if it was ALREADY low. If so, maybe don't email again? 
            // The requirement just says "Alert when below".
            // Implementation: Send email.
            if (currentStock > material.minimumStock) {
                // Determine recipient (e.g. purchasing)
                const recipient = "purchasing@example.com";
                await this.mailService.sendMail({
                    to: recipient,
                    subject: `Low Stock Alert: ${material.name}`,
                    text: `Low stock warning for material ${material.name} (${material.itemNumber}).\nCurrent Stock: ${newStock} ${material.unit}\nMinimum Stock: ${material.minimumStock}\nPlease reorder.`
                });
            }
        }

        return savedMovement;
    }

    async getHistory(materialId: string): Promise<InventoryMovement[]> {
        return this.movementRepo.findByMaterial(materialId);
    }
}
