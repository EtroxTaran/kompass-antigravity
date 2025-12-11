import PouchDB from 'pouchdb';

export interface LruDocument {
    _id: string;
    _rev: string;
    modifiedAt?: string;
    // We can add size estimation if needed, or rely on PouchDB's info
}

/**
 * Estimate size of a document in bytes
 * This is a rough approximation for JSON content
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function estimateDocSize(doc: any): number {
    return JSON.stringify(doc).length;
}

/**
 * Evict documents from Tier 2 (Recent) to free up space.
 * Uses 'modifiedAt' as a proxy for recency if 'lastAccessedAt' is not available.
 * 
 * @param db The PouchDB instance
 * @param targetBytes The number of bytes we want to free up (approximation)
 * @param userId Current user ID to ensure we don't evict Essential data if it happens to be in the same DB
 * @returns Object containing number of evicted docs and estimated freed bytes
 */
export async function evictLruDocuments(
    db: PouchDB.Database,
    targetBytes: number,
    userId: string
): Promise<{ evictedCount: number; freedBytes: number }> {
    /*
     Strategy:
     1. Query all documents content (or use a view if one existed, but allDocs is easier for now)
     2. Filter out Essential and Pinned documents (we only evict Tier 2)
     3. Sort remainder by modifiedAt (ascending - oldest first)
     4. Delete until targetBytes is reached
     */

    // 1. Fetch all docs with metadata
    // We need the doc content to check filters and size, but limits might be an issue.
    // For better performance, we might want to use a query index, but let's start with allDocs for MVP
    // assuming local DB isn't massive (50MB max).
    const allDocs = await db.allDocs({ include_docs: true });

    if (allDocs.total_rows === 0) {
        return { evictedCount: 0, freedBytes: 0 };
    }

    // 2. Identify candidates for eviction
    // We must NOT evict:
    // - Essential data (User, Owned Customer, Active Opportunity, Today's Activity)
    // - Pinned data (Tier 3) - passed as pinnedIds, but checking logic might be complex locally without the list.
    //   Ideally we check against a list of pinned IDs.
    //   For this implementation, we will rely on a "isEvictable" check.

    // To keep it simple: We assume Essential data is defined by the same logic as the filter.
    // We will re-use logic similar to essentialFilter but we need to import it or duplicate it.
    // Let's duplicate the essential check logic for simplicity and to avoid circular deps if any.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candidates: any[] = [];

    // Helper to check if essential
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isEssential = (doc: any) => {
        if (doc.type === 'user' && doc._id === `user-${userId}`) return true;
        if (doc.type === 'customer' && doc.owner === userId) return true;
        if (doc.type === 'opportunity' && doc.owner === userId && !['Lost', 'Won'].includes(doc.status)) return true;
        if (doc.type === 'activity' && doc.assignedTo === userId) {
            const activityDate = new Date(doc.scheduledAt);
            const today = new Date();
            return activityDate.toDateString() === today.toDateString();
        }
        return false;
    };

    for (const row of allDocs.rows) {
        const doc = row.doc;
        if (!doc) continue;
        // Skip design docs
        if (doc._id.startsWith('_design/')) continue;

        // Skip Essential docs
        if (isEssential(doc)) continue;

        // We assume Pinned docs are handled by the caller or we implement a check.
        // For now, let's treat everything non-essential as evictable "Recent" data.
        // TODO: Integrate pinned check

        candidates.push(doc);
    }

    // 3. Sort by modifiedAt (oldest first)
    candidates.sort((a, b) => {
        const timeA = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
        const timeB = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
        return timeA - timeB;
    });

    // 4. Evict
    let freed = 0;
    let evicted = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toDelete: any[] = [];

    for (const doc of candidates) {
        if (freed >= targetBytes) break;

        const size = estimateDocSize(doc);
        freed += size;
        evicted++;
        toDelete.push({ ...doc, _deleted: true });
    }

    if (toDelete.length > 0) {
        await db.bulkDocs(toDelete);
    }

    return { evictedCount: evicted, freedBytes: freed };
}
