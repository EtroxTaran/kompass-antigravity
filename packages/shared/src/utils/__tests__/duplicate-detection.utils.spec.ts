import {
  fuzzyMatchCompanyName,
  isDuplicateCompanyName,
} from '../duplicate-detection.utils';

describe('duplicate-detection.utils', () => {
  describe('fuzzyMatchCompanyName', () => {
    it('should return 1.0 for exact matches', () => {
      expect(fuzzyMatchCompanyName('Müller GmbH', 'Müller GmbH')).toBe(1.0);
      expect(fuzzyMatchCompanyName('Test Company', 'Test Company')).toBe(1.0);
    });

    it('should return 1.0 for case-insensitive exact matches', () => {
      expect(fuzzyMatchCompanyName('Müller GmbH', 'MÜLLER GMBH')).toBe(1.0);
      expect(fuzzyMatchCompanyName('Test Company', 'test company')).toBe(1.0);
    });

    it('should return 1.0 for matches with different whitespace (after normalization)', () => {
      // After normalization (trim), these should be exact matches
      expect(fuzzyMatchCompanyName('Müller GmbH', '  Müller GmbH  ')).toBe(1.0);
      // Double space in middle will have slight difference, but still very high similarity
      const similarity = fuzzyMatchCompanyName('Test Company', 'Test  Company');
      expect(similarity).toBeGreaterThan(0.9); // Very high similarity
    });

    it('should return high similarity for similar names (above 0.8 threshold)', () => {
      const similarity1 = fuzzyMatchCompanyName('Müller GmbH', 'Mueller GmbH');
      expect(similarity1).toBeGreaterThan(0.8);
      expect(similarity1).toBeLessThanOrEqual(1.0);

      const similarity2 = fuzzyMatchCompanyName(
        'Hofladen Müller',
        'Hofladen Mueller'
      );
      expect(similarity2).toBeGreaterThan(0.8);
    });

    it('should return low similarity for different names (below 0.8 threshold)', () => {
      const similarity1 = fuzzyMatchCompanyName('Müller GmbH', 'Schmidt GmbH');
      expect(similarity1).toBeLessThan(0.8);

      const similarity2 = fuzzyMatchCompanyName('Test Company', 'XYZ Corp');
      expect(similarity2).toBeLessThan(0.8);
    });

    it('should handle single character differences', () => {
      const similarity = fuzzyMatchCompanyName('Test GmbH', 'Test GbH');
      expect(similarity).toBeGreaterThan(0.8);
    });

    it('should return 0 for empty strings', () => {
      expect(fuzzyMatchCompanyName('', 'Test')).toBe(0);
      expect(fuzzyMatchCompanyName('Test', '')).toBe(0);
      expect(fuzzyMatchCompanyName('', '')).toBe(0);
    });

    it('should handle special characters', () => {
      const similarity = fuzzyMatchCompanyName('Müller & Co.', 'Mueller & Co.');
      expect(similarity).toBeGreaterThan(0.8);
    });

    it('should handle long company names', () => {
      const name1 = 'Hofladen Müller GmbH & Co. KG';
      const name2 = 'Hofladen Mueller GmbH & Co. KG';
      const similarity = fuzzyMatchCompanyName(name1, name2);
      expect(similarity).toBeGreaterThan(0.8);
    });

    it('should normalize input (lowercase, trim)', () => {
      const similarity1 = fuzzyMatchCompanyName(
        '  MÜLLER GMBH  ',
        'müller gmbh'
      );
      expect(similarity1).toBe(1.0);

      const similarity2 = fuzzyMatchCompanyName(
        'Test Company',
        '  TEST COMPANY  '
      );
      expect(similarity2).toBe(1.0);
    });
  });

  describe('isDuplicateCompanyName', () => {
    it('should return true for exact matches', () => {
      expect(isDuplicateCompanyName('Müller GmbH', 'Müller GmbH')).toBe(true);
    });

    it('should return true for similar names above threshold', () => {
      expect(isDuplicateCompanyName('Müller GmbH', 'Mueller GmbH')).toBe(true);
      expect(
        isDuplicateCompanyName('Hofladen Müller', 'Hofladen Mueller')
      ).toBe(true);
    });

    it('should return false for different names below threshold', () => {
      expect(isDuplicateCompanyName('Müller GmbH', 'Schmidt GmbH')).toBe(false);
      expect(isDuplicateCompanyName('Test Company', 'XYZ Corp')).toBe(false);
    });

    it('should respect custom threshold', () => {
      // Test with names that have known similarity
      const name1 = 'Müller GmbH';
      const name2 = 'Mueller GmbH';

      // Check actual similarity first
      const similarity = fuzzyMatchCompanyName(name1, name2);

      // With default threshold (0.8), should be duplicates if similarity >= 0.8
      const isDuplicateDefault = isDuplicateCompanyName(name1, name2);

      // With higher threshold (0.95), might not be duplicates
      const isDuplicateHigh = isDuplicateCompanyName(name1, name2, 0.95);

      // With lower threshold (0.7), should still be duplicates
      const isDuplicateLow = isDuplicateCompanyName(name1, name2, 0.7);

      // Verify behavior based on actual similarity
      if (similarity >= 0.8) {
        expect(isDuplicateDefault).toBe(true);
      }
      // Higher threshold (0.95) should be more strict
      expect(isDuplicateHigh).toBe(similarity >= 0.95);
      // Lower threshold (0.7) should be less strict
      expect(isDuplicateLow).toBe(similarity >= 0.7);
    });

    it('should return false for empty strings', () => {
      expect(isDuplicateCompanyName('', 'Test')).toBe(false);
      expect(isDuplicateCompanyName('Test', '')).toBe(false);
      expect(isDuplicateCompanyName('', '')).toBe(false);
    });

    it('should handle case-insensitive comparison', () => {
      expect(isDuplicateCompanyName('MÜLLER GMBH', 'müller gmbh')).toBe(true);
    });
  });
});
