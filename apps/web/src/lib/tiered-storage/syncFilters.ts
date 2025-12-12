// Essential Tier (5MB) - Always synced
/* eslint-disable @typescript-eslint/no-explicit-any */
export function essentialFilter(doc: any, req: any): boolean {
  const { userId } = req.query;

  // User profile
  if (doc.type === "user" && doc._id === `user-${userId}`) return true;

  // Owned customers
  if (doc.type === "customer" && doc.owner === userId) return true;

  // Active opportunities (status !== 'Lost'/'Won')
  if (
    doc.type === "opportunity" &&
    doc.owner === userId &&
    !["Lost", "Won"].includes(doc.status)
  )
    return true;

  // Today's appointments/activities
  if (doc.type === "activity" && doc.assignedTo === userId) {
    const activityDate = new Date(doc.scheduledAt);
    const today = new Date();
    // Comparing date strings is a simple way to check if it's the same day,
    // assuming local time relevance.
    return activityDate.toDateString() === today.toDateString();
  }

  // Visit Reports / Protocols (Essential for Offline)
  if (doc.type === "protocol" && doc.createdBy === userId) return true;

  // Deletions should generally be propagated to ensure consistency
  if (doc._deleted) return true;

  return false;
}

// Recent Tier (10MB) - Last 30 days, LRU eviction
export function recentFilter(doc: any): boolean {
  // If no modifiedAt, we can't determine age, so we might skip or include.
  // Safest is to skip unless it's essential (handled by essential filter).
  // But strictly for "Recent" tier:
  if (!doc.modifiedAt) return false;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return new Date(doc.modifiedAt).getTime() >= thirtyDaysAgo;
}

// On-Demand Tier (35MB) - User-pinned documents only
export function onDemandFilter(doc: any, req: any): boolean {
  const { pinnedIds } = req.query;
  // pinnedIds comes in as a query param, might be a comma-separated string or array depending on PouchDB
  // For client-side filter function (which PouchDB uses sometimes directly), we might need to handle context differently.
  // However, usually filters run on the server (CouchDB).
  // If running on client (replicating FROM remote), we pass `query_params`.

  if (!pinnedIds) return false;

  // Handle array or string case
  const ids = Array.isArray(pinnedIds) ? pinnedIds : pinnedIds.split(",");

  return ids.includes(doc._id);
}
