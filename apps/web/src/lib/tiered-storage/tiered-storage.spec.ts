import { describe, it, expect, vi, beforeEach } from "vitest";
import { essentialFilter, recentFilter } from "./syncFilters";
import { evictLruDocuments } from "./lruEviction";

// Mock type for PouchDB Database
interface MockDatabase {
  allDocs: ReturnType<typeof vi.fn>;
  bulkDocs: ReturnType<typeof vi.fn>;
}

// Mock PouchDB
const mockBulkDocs = vi.fn();
const mockAllDocs = vi.fn();

const mockDb: MockDatabase = {
  allDocs: mockAllDocs,
  bulkDocs: mockBulkDocs,
};

describe("Tiered Storage Strategy", () => {
  const userId = "test-user-123";
  const req = { query: { userId } };

  describe("essentialFilter", () => {
    it("should return true for User profile", () => {
      const doc = { type: "user", _id: `user-${userId}` };
      expect(essentialFilter(doc, req)).toBe(true);
    });

    it("should return true for Owned Customer", () => {
      const doc = { type: "customer", owner: userId };
      expect(essentialFilter(doc, req)).toBe(true);
    });

    it("should return true for Active Opportunity", () => {
      const doc = { type: "opportunity", owner: userId, status: "Open" };
      expect(essentialFilter(doc, req)).toBe(true);
    });

    it("should return false for Lost Opportunity", () => {
      const doc = { type: "opportunity", owner: userId, status: "Lost" };
      expect(essentialFilter(doc, req)).toBe(false);
    });

    it("should return true for Todays Activity", () => {
      const doc = {
        type: "activity",
        assignedTo: userId,
        scheduledAt: new Date().toISOString(),
      };
      expect(essentialFilter(doc, req)).toBe(true);
    });

    it("should return false for Future Activity", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      const doc = {
        type: "activity",
        assignedTo: userId,
        scheduledAt: futureDate.toISOString(),
      };
      expect(essentialFilter(doc, req)).toBe(false);
    });

    it("should return false for unrelated docs", () => {
      const doc = { type: "random", owner: userId };
      expect(essentialFilter(doc, req)).toBe(false);
    });
  });

  describe("recentFilter", () => {
    it("should return true for docs modified within 30 days", () => {
      const doc = { modifiedAt: new Date().toISOString() };
      expect(recentFilter(doc)).toBe(true);
    });

    it("should return false for docs older than 30 days", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);
      const doc = { modifiedAt: oldDate.toISOString() };
      expect(recentFilter(doc)).toBe(false);
    });

    it("should return false if modifiedAt is missing", () => {
      const doc = { some: "daata" };
      expect(recentFilter(doc)).toBe(false);
    });
  });

  describe("evictLruDocuments", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should evict oldest non-essential documents to reach target bytes", async () => {
      const docOld = {
        _id: "1",
        type: "note",
        modifiedAt: "2023-01-01T00:00:00Z",
        content: "x".repeat(100),
      };
      const docNew = {
        _id: "2",
        type: "note",
        modifiedAt: "2023-12-01T00:00:00Z",
        content: "x".repeat(100),
      };
      const docEssential = {
        _id: "3",
        type: "customer",
        owner: userId,
        modifiedAt: "2023-01-01T00:00:00Z",
      };

      const allDocs = {
        total_rows: 3,
        rows: [{ doc: docOld }, { doc: docNew }, { doc: docEssential }],
      };

      mockAllDocs.mockResolvedValue(allDocs);

      // Target 50 bytes. docOld is > 100 bytes. So deleting docOld should be enough.
      const targetBytes = 50;
      const result = await evictLruDocuments(mockDb as unknown as Parameters<typeof evictLruDocuments>[0], targetBytes, userId);

      expect(result.evictedCount).toBe(1);
      expect(mockBulkDocs).toHaveBeenCalledTimes(1);
      // Check that docOld was deleted
      const deletedDocs = mockBulkDocs.mock.calls[0][0];
      expect(deletedDocs).toHaveLength(1);
      expect(deletedDocs[0]._id).toBe("1");
      expect(deletedDocs[0]._deleted).toBe(true);
    });

    it("should not evict essential documents even if old", async () => {
      const docEssential = {
        _id: "3",
        type: "customer",
        owner: userId,
        modifiedAt: "2020-01-01T00:00:00Z",
      };
      mockAllDocs.mockResolvedValue({
        total_rows: 1,
        rows: [{ doc: docEssential }],
      });

      const result = await evictLruDocuments(mockDb as unknown as Parameters<typeof evictLruDocuments>[0], 1000, userId);

      expect(result.evictedCount).toBe(0);
      expect(mockBulkDocs).not.toHaveBeenCalled();
    });
  });
});
