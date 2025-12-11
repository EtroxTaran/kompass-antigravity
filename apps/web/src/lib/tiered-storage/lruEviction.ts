import { storageService } from "../../services/storage.service";

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
 * @param userId Current user ID to ensure we don't evict Essential data
 * @returns Object containing number of evicted docs and estimated freed bytes
 */
export async function evictLruDocuments(
    db: PouchDB.Database,
    targetBytes: number,
    userId: string
): Promise<{ evictedCount: number; freedBytes: number }> {
    /*
     Strategy:
     1. Query all documents content 
     2. Filter out Essential and Pinned documents
     3. Sort remainder by modifiedAt (ascending - oldest first)
     4. Delete until targetBytes is reached
     */

    // 1. Fetch all docs with metadata
    const allDocs = await db.allDocs({ include_docs: true });

    if (allDocs.total_rows === 0) {
        return { evictedCount: 0, freedBytes: 0 };
    }

    // 2. Identify candidates for eviction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candidates: any[] = [];

    for (const row of allDocs.rows) {
        const doc = row.doc;
        if (!doc) continue;
        // Skip design docs
        if (doc._id.startsWith('_design/')) continue;

        // Skip Tier 1 (Essential)
        if (storageService.isEssential(doc, userId)) continue;

        // Skip Tier 3 (Pinned)
        if (storageService.isPinned(doc._id)) continue;

        // If neither, it's Tier 2 (Recent) -> Candidate for eviction
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
