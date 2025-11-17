import { describe, expect, it } from 'vitest';

import { getPaginationInfo, paginateData, sortData } from '../table-utils';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const testData: TestItem[] = [
  { id: '1', name: 'Alice', value: 10 },
  { id: '2', name: 'Bob', value: 20 },
  { id: '3', name: 'Charlie', value: 30 },
  { id: '4', name: 'David', value: 40 },
  { id: '5', name: 'Eve', value: 50 },
];

describe('table-utils', () => {
  describe('sortData', () => {
    it('should sort by string field ascending', () => {
      const result = sortData(testData, 'name', 'asc');
      expect(result[0].name).toBe('Alice');
      expect(result[4].name).toBe('Eve');
    });

    it('should sort by string field descending', () => {
      const result = sortData(testData, 'name', 'desc');
      expect(result[0].name).toBe('Eve');
      expect(result[4].name).toBe('Alice');
    });

    it('should sort by number field ascending', () => {
      const result = sortData(testData, 'value', 'asc');
      expect(result[0].value).toBe(10);
      expect(result[4].value).toBe(50);
    });

    it('should sort by number field descending', () => {
      const result = sortData(testData, 'value', 'desc');
      expect(result[0].value).toBe(50);
      expect(result[4].value).toBe(10);
    });

    it('should handle empty array', () => {
      const result = sortData([], 'name', 'asc');
      expect(result).toEqual([]);
    });

    it('should handle null/undefined values', () => {
      const dataWithNulls: TestItem[] = [
        { id: '1', name: 'Alice', value: 10 },
        { id: '2', name: null as any, value: 20 },
        { id: '3', name: 'Charlie', value: 30 },
      ];
      const result = sortData(dataWithNulls, 'name', 'asc');
      expect(result.length).toBe(3);
    });
  });

  describe('paginateData', () => {
    it('should return first page with correct size', () => {
      const result = paginateData(testData, 1, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return second page correctly', () => {
      const result = paginateData(testData, 2, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('3');
      expect(result[1].id).toBe('4');
    });

    it('should return last page with remaining items', () => {
      const result = paginateData(testData, 3, 2);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('5');
    });

    it('should return empty array for page beyond data', () => {
      const result = paginateData(testData, 10, 2);
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = paginateData([], 1, 10);
      expect(result).toEqual([]);
    });
  });

  describe('getPaginationInfo', () => {
    it('should calculate correct pagination info for first page', () => {
      const info = getPaginationInfo(25, 1, 10);
      expect(info).toEqual({
        total: 25,
        page: 1,
        pageSize: 10,
        totalPages: 3,
        startIndex: 1, // 1-based for display
        endIndex: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('should calculate correct pagination info for middle page', () => {
      const info = getPaginationInfo(25, 2, 10);
      expect(info).toEqual({
        total: 25,
        page: 2,
        pageSize: 10,
        totalPages: 3,
        startIndex: 11, // 1-based for display
        endIndex: 20,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('should calculate correct pagination info for last page', () => {
      const info = getPaginationInfo(25, 3, 10);
      expect(info).toEqual({
        total: 25,
        page: 3,
        pageSize: 10,
        totalPages: 3,
        startIndex: 21, // 1-based for display
        endIndex: 25,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it('should handle empty data', () => {
      const info = getPaginationInfo(0, 1, 10);
      expect(info).toEqual({
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        startIndex: 1, // 1-based for display
        endIndex: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });
});
