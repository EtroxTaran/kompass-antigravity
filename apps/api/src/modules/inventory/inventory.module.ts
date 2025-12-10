import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryMovementRepository } from "./inventory.repository";
import { DatabaseModule } from "../../database/database.module";
import { MaterialModule } from "../material/material.module"; // Needed for MaterialRepository

@Module({
    imports: [DatabaseModule, MaterialModule],
    controllers: [InventoryController],
    providers: [InventoryService, InventoryMovementRepository],
    exports: [InventoryService],
})
export class InventoryModule { }
