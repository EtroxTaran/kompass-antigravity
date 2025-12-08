import { useMaterials } from '@/hooks/useMaterials';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Material } from '@kompass/shared';

export function MaterialList() {
    const { materials, loading, addMaterial } = useMaterials();

    const handleAddDummy = () => {
        const dummy: Omit<Material, '_id' | '_rev'> = {
            type: 'material',
            itemNumber: `M-${Date.now()}`,
            name: `Wood Panel ${Date.now()}`,
            category: 'wood',
            unit: 'm2',
            purchasePrice: 45.50,
            currency: 'EUR',
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            modifiedBy: 'user-1',
            modifiedAt: new Date().toISOString(),
            version: 1,
        };
        addMaterial(dummy);
    };

    if (loading) return <div>Loading Materials...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Materials</h2>
                <Button onClick={handleAddDummy} variant="secondary">Add Material</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materials.map((m) => (
                        <TableRow key={m._id}>
                            <TableCell className="font-medium">{m.itemNumber}</TableCell>
                            <TableCell>{m.name}</TableCell>
                            <TableCell className="text-right">
                                {m.purchasePrice.toLocaleString('de-DE', { style: 'currency', currency: m.currency })} / {m.unit}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
