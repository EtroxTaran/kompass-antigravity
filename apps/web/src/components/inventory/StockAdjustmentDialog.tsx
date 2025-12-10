import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useInventory } from "../../hooks/useInventory";
import { InventoryUnitOfMeasure, MovementType } from "@kompass/shared";

interface StockAdjustmentDialogProps {
    materialId: string;
    unit: string;
    onSuccess?: () => void;
}

export const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
    materialId,
    unit,
    onSuccess,
}) => {
    const [open, setOpen] = useState(false);
    const { recordMovement } = useInventory(materialId);
    const [type, setType] = useState<MovementType>(MovementType.INVENTORY_ADJUSTMENT);
    const [quantity, setQuantity] = useState<number>(0);
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Logic to determine sign based on type if needed, or user inputs signed value?
        // User expects to enter positive numbers for "Receipt" and positive for "Allocation" (which is subtraction).
        // Let's handle sign here for better UX.

        let finalQuantity = Number(quantity);
        if (
            type === MovementType.PROJECT_ALLOCATION ||
            type === MovementType.RETURN_TO_SUPPLIER ||
            type === MovementType.WRITE_OFF
        ) {
            finalQuantity = -Math.abs(finalQuantity);
        } else {
            finalQuantity = Math.abs(finalQuantity);
        }

        const success = await recordMovement({
            materialId,
            movementType: type,
            quantity: finalQuantity,
            unit: unit as InventoryUnitOfMeasure, // Assuming unit matches enum strings
            movementDate: new Date().toISOString(),
            reason,
            notes,
        });

        if (success) {
            setOpen(false);
            setQuantity(0);
            setReason("");
            setNotes("");
            onSuccess?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Bestand anpassen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lagerbestand anpassen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Typ
                        </Label>
                        <div className="col-span-3">
                            <Select value={type} onValueChange={(val) => setType(val as MovementType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Bewegungstyp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={MovementType.INVENTORY_ADJUSTMENT}>Manuelle Korrektur</SelectItem>
                                    <SelectItem value={MovementType.PURCHASE_RECEIPT}>Wareneingang</SelectItem>
                                    <SelectItem value={MovementType.PROJECT_ALLOCATION}>Ausgabe an Projekt</SelectItem>
                                    <SelectItem value={MovementType.WRITE_OFF}>Abschreibung / Verlust</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Menge
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="col-span-3"
                                required
                            />
                            <span className="text-sm text-muted-foreground">{unit}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                            Grund
                        </Label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="col-span-3"
                            placeholder="z.B. Inventur, Fehlerkorrektur"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notizen
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Speichern</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
