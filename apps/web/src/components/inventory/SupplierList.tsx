import { useSuppliers } from '@/hooks/useSuppliers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Supplier } from '@kompass/shared';

export function SupplierList() {
    const { suppliers, loading, addSupplier } = useSuppliers();

    const handleAddDummy = () => {
        const dummy: Omit<Supplier, '_id' | '_rev'> = {
            type: 'supplier',
            companyName: `Supplier ${Date.now()}`,
            billingAddress: {
                street: 'Lieferstraße',
                zipCode: '54321',
                city: 'Lieferstadt',
                country: 'DE'
            },
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            modifiedBy: 'user-1',
            modifiedAt: new Date().toISOString(),
            version: 1,
        };
        addSupplier(dummy);
    };

    if (loading) return <div>Loading Suppliers...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Suppliers</h2>
                <Button onClick={handleAddDummy} variant="secondary">Add Supplier</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {suppliers.map((s) => (
                    <Card key={s._id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{s.companyName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">{s.billingAddress.city}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
