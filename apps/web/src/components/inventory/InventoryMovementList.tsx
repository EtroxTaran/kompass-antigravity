import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { InventoryMovement, MovementType } from "@kompass/shared";
import { Badge } from "../../components/ui/badge";

interface InventoryMovementListProps {
    movements: InventoryMovement[];
}

export const InventoryMovementList: React.FC<InventoryMovementListProps> = ({
    movements,
}) => {
    const getMovementTypeLabel = (type: MovementType) => {
        switch (type) {
            case MovementType.PURCHASE_RECEIPT:
                return "Wareneingang";
            case MovementType.PROJECT_ALLOCATION:
                return "Projektallokation";
            case MovementType.RETURN_TO_SUPPLIER:
                return "Rückgabe an Lieferant";
            case MovementType.INVENTORY_ADJUSTMENT:
                return "Korrektur";
            case MovementType.WRITE_OFF:
                return "Abschreibung";
            case MovementType.TRANSFER:
                return "Umlagerung";
            default:
                return type;
        }
    };

    const getMovementTypeColor = (type: MovementType) => {
        switch (type) {
            case MovementType.PURCHASE_RECEIPT: return "default"; // Greenish usually or black
            case MovementType.PROJECT_ALLOCATION: return "secondary";
            case MovementType.WRITE_OFF: return "destructive";
            default: return "outline";
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Menge</TableHead>
                        <TableHead>Grund / Referenz</TableHead>
                        <TableHead>Erfasst von</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movements.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Keine Bewegungen gefunden.
                            </TableCell>
                        </TableRow>
                    ) : (
                        movements.map((movement) => (
                            <TableRow key={movement._id}>
                                <TableCell>
                                    {format(new Date(movement.movementDate), "dd.MM.yyyy HH:mm", {
                                        locale: de,
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getMovementTypeColor(movement.movementType) as any}>
                                        {getMovementTypeLabel(movement.movementType)}
                                    </Badge>
                                </TableCell>
                                <TableCell className={movement.quantity > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                    {movement.quantity > 0 ? "+" : ""}
                                    {movement.quantity} {movement.unit}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{movement.reason}</span>
                                        {movement.notes && (
                                            <span className="text-xs text-muted-foreground">{movement.notes}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{movement.recordedBy}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
