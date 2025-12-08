import { useCustomers } from '@/hooks/useCustomers';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Customer } from '@kompass/shared';

export function CustomerList() {
    const { customers, loading, addCustomer } = useCustomers();

    const handleAddDummy = () => {
        const dummy: Omit<Customer, '_id' | '_rev'> = {
            type: 'customer',
            companyName: `Test Company ${Date.now()}`,
            billingAddress: {
                street: 'Musterstraße',
                streetNumber: '1',
                zipCode: '12345',
                city: 'Musterstadt',
                country: 'Deutschland'
            },
            locations: [],
            owner: 'user-1', // Mock
            contactPersons: [],
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            modifiedBy: 'user-1',
            modifiedAt: new Date().toISOString(),
            version: 1
        };
        addCustomer(dummy);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Customers</h2>
                <Button onClick={handleAddDummy}>Add Dummy Customer</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer._id}>
                            <TableCell>{customer.companyName}</TableCell>
                            <TableCell>{customer.billingAddress.city}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {customers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No customers found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
