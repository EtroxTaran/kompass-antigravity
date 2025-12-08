import { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Customer } from '@kompass/shared';

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = dbService.getDB();

        const fetchCustomers = async () => {
            try {
                const result = await db.find({
                    selector: { type: 'customer' },
                });
                setCustomers(result.docs as unknown as Customer[]);
            } catch (err) {
                console.error('Error fetching customers', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();

        const changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true,
            filter: (doc) => doc.type === 'customer',
        }).on('change', () => {
            // Simple reload for MVP (could be optimized)
            fetchCustomers();
        });

        return () => {
            changes.cancel();
        };
    }, []);

    const addCustomer = async (customer: Omit<Customer, '_id' | '_rev'>) => {
        const db = dbService.getDB();
        const newDoc = {
            ...customer,
            _id: `customer-${crypto.randomUUID()}`,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            version: 1,
        };
        await db.put(newDoc);
    };

    return { customers, loading, addCustomer };
}
