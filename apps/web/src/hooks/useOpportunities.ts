import { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Opportunity } from '@kompass/shared';

export function useOpportunities() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOpportunities = async () => {
        const db = dbService.getDB();
        try {
            const result = await db.find({
                selector: { type: 'opportunity' },
            });
            setOpportunities(result.docs as unknown as Opportunity[]);
        } catch (err) {
            console.error('Error fetching opportunities', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
        const db = dbService.getDB();
        const changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true,
            filter: (doc) => doc.type === 'opportunity',
        }).on('change', () => {
            fetchOpportunities();
        });

        return () => {
            changes.cancel();
        };
    }, []);

    const addOpportunity = async (opp: Omit<Opportunity, '_id' | '_rev'>) => {
        const db = dbService.getDB();
        const newDoc = {
            ...opp,
            _id: `opportunity-${crypto.randomUUID()}`,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            version: 1,
            createdBy: 'user-1', // Mock
            modifiedBy: 'user-1', // Mock
        };
        await db.put(newDoc);
    };

    return { opportunities, loading, addOpportunity };
}
