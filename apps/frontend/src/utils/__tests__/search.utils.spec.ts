import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { highlightMatch, matchText } from '../search.utils';

describe('search.utils', () => {
  describe('matchText', () => {
    it('should match text case-insensitively', () => {
      expect(matchText('Müller GmbH', 'müller')).toBe(true);
      expect(matchText('Müller GmbH', 'MÜLLER')).toBe(true);
      expect(matchText('Müller GmbH', 'gmbh')).toBe(true);
      expect(matchText('Müller GmbH', 'MÜLLER')).toBe(true);
    });

    it('should match partial text', () => {
      expect(matchText('Müller GmbH', 'Müll')).toBe(true);
      expect(matchText('Müller GmbH', 'Gmb')).toBe(true);
    });

    it('should not match when query is not in text', () => {
      expect(matchText('Müller GmbH', 'xyz')).toBe(false);
      expect(matchText('Müller GmbH', 'test')).toBe(false);
    });

    it('should handle empty query', () => {
      expect(matchText('Müller GmbH', '')).toBe(false);
      expect(matchText('Müller GmbH', '   ')).toBe(false);
    });

    it('should handle empty text', () => {
      expect(matchText('', 'müller')).toBe(false);
      expect(matchText('', '')).toBe(false);
    });

    it('should handle null/undefined text', () => {
      expect(matchText(null as any, 'müller')).toBe(false);
      expect(matchText(undefined as any, 'müller')).toBe(false);
    });

    it('should trim query before matching', () => {
      expect(matchText('Müller GmbH', '  müller  ')).toBe(true);
      expect(matchText('Müller GmbH', '  gmbh  ')).toBe(true);
    });

    it('should match VAT numbers', () => {
      expect(matchText('DE123456789', '123456789')).toBe(true);
      expect(matchText('DE123456789', 'DE123')).toBe(true);
      expect(matchText('DE123456789', 'de123')).toBe(true);
    });
  });

  describe('highlightMatch', () => {
    it('should return original text when query is empty', () => {
      const { container } = render(highlightMatch('Müller GmbH', ''));
      expect(container.textContent).toBe('Müller GmbH');
      expect(container.querySelector('mark')).toBeNull();
    });

    it('should return original text when query is whitespace only', () => {
      const { container } = render(highlightMatch('Müller GmbH', '   '));
      expect(container.textContent).toBe('Müller GmbH');
      expect(container.querySelector('mark')).toBeNull();
    });

    it('should highlight matching text case-insensitively', () => {
      const { container } = render(highlightMatch('Müller GmbH', 'müller'));
      expect(container.textContent).toBe('Müller GmbH');
      const mark = container.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark?.textContent).toBe('Müller');
    });

    it('should highlight matching text with uppercase query', () => {
      const { container } = render(highlightMatch('Müller GmbH', 'MÜLLER'));
      expect(container.textContent).toBe('Müller GmbH');
      const mark = container.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark?.textContent).toBe('Müller');
    });

    it('should highlight partial matches', () => {
      const { container } = render(highlightMatch('Müller GmbH', 'Müll'));
      expect(container.textContent).toBe('Müller GmbH');
      const mark = container.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark?.textContent).toBe('Müll');
    });

    it('should highlight multiple occurrences', () => {
      const { container } = render(
        highlightMatch('Müller Müller GmbH', 'Müller')
      );
      expect(container.textContent).toBe('Müller Müller GmbH');
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(2);
      expect(marks[0]?.textContent).toBe('Müller');
      expect(marks[1]?.textContent).toBe('Müller');
    });

    it('should not highlight when query does not match', () => {
      const { container } = render(highlightMatch('Müller GmbH', 'xyz'));
      expect(container.textContent).toBe('Müller GmbH');
      expect(container.querySelector('mark')).toBeNull();
    });

    it('should handle special regex characters in query', () => {
      const { container } = render(highlightMatch('Test (GmbH)', '(GmbH)'));
      expect(container.textContent).toBe('Test (GmbH)');
      const mark = container.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark?.textContent).toBe('(GmbH)');
    });

    it('should handle query with dots', () => {
      const { container } = render(highlightMatch('Test GmbH', 'Test.'));
      expect(container.textContent).toBe('Test GmbH');
      // Should not crash, but may not match if dot is escaped
      expect(container.textContent).toBe('Test GmbH');
    });

    it('should preserve text structure', () => {
      const { container } = render(
        highlightMatch('Müller & Co. GmbH', 'Müller')
      );
      expect(container.textContent).toBe('Müller & Co. GmbH');
      const mark = container.querySelector('mark');
      expect(mark?.textContent).toBe('Müller');
    });

    it('should apply highlight styling classes', () => {
      const { container } = render(highlightMatch('Müller GmbH', 'Müller'));
      const mark = container.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark?.className).toContain('bg-yellow-200');
      expect(mark?.className).toContain('font-medium');
    });

    it('should handle empty text', () => {
      const { container } = render(highlightMatch('', 'müller'));
      expect(container.textContent).toBe('');
      expect(container.querySelector('mark')).toBeNull();
    });

    it('should handle VAT number highlighting', () => {
      const { container } = render(highlightMatch('DE123456789', '123456'));
      expect(container.textContent).toBe('DE123456789');
      const mark = container.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark?.textContent).toBe('123456');
    });
  });
});
