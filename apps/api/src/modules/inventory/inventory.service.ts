import { Injectable, NotFoundException } from "@nestjs/common";
import { InventoryMovementRepository } from "./inventory.repository";
import { CreateInventoryMovementDto, InventoryStockDto } from "./inventory.dto";
import { InventoryMovement, Material } from "@kompass/shared";
import { MaterialRepository } from "../material/material.repository";

@Injectable()
export class InventoryService {
    constructor(
        private readonly movementRepo: InventoryMovementRepository,
        private readonly materialRepo: MaterialRepository
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

        // Ensure quantity is treated correctly based on type if needed, but assuming DTO is signed correctly.

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

        return savedMovement;
    }

    async getHistory(materialId: string): Promise<InventoryMovement[]> {
        return this.movementRepo.findByMaterial(materialId);
    }
}
