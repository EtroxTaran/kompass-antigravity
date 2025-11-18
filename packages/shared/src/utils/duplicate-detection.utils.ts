/**
 * Duplicate Detection Utilities for KOMPASS
 *
 * Implements fuzzy matching using Levenshtein distance algorithm
 * for detecting potential duplicate customers.
 *
 * Threshold: 0.8 similarity (80% match)
 */

/**
 * Calculate Levenshtein distance between two strings
 *
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into another.
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Levenshtein distance (number of edits required)
 *
 * @example
 * ```typescript
 * levenshteinDistance('kitten', 'sitting') // 3
 * levenshteinDistance('Müller', 'Mueller') // 2
 * ```
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  // Initialize first column (str2 -> empty string)
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row (empty string -> str1)
  for (let j = 0; j <= str1.length; j++) {
    const firstRow = matrix[0];
    if (firstRow) {
      firstRow[j] = j;
    }
  }

  // Fill the matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      const prevRow = matrix[i - 1];
      const currRow = matrix[i];
      if (!prevRow || !currRow) {
        continue;
      }

      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        // Characters match, no edit needed
        currRow[j] = prevRow[j - 1] ?? 0;
      } else {
        // Characters don't match, find minimum edit cost
        const substitution = (prevRow[j - 1] ?? 0) + 1; // substitution
        const insertion = (currRow[j - 1] ?? 0) + 1; // insertion
        const deletion = (prevRow[j] ?? 0) + 1; // deletion
        currRow[j] = Math.min(substitution, insertion, deletion);
      }
    }
  }

  // Return the distance (bottom-right cell of matrix)
  const lastRow = matrix[str2.length];
  return lastRow?.[str1.length] ?? 0;
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 *
 * Returns a value between 0 and 1, where:
 * - 1.0 = exact match
 * - 0.0 = completely different
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score (0-1)
 *
 * @example
 * ```typescript
 * calculateSimilarity('Müller GmbH', 'Mueller GmbH') // ~0.85
 * calculateSimilarity('Test', 'Test') // 1.0
 * calculateSimilarity('Test', 'XYZ') // ~0.0
 * ```
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) {
    return 1.0; // Both empty strings are identical
  }

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength;
}

/**
 * Normalize string for comparison
 *
 * Converts to lowercase and trims whitespace.
 * This ensures consistent comparison regardless of case or spacing.
 *
 * @param str - String to normalize
 * @returns Normalized string
 *
 * @example
 * ```typescript
 * normalizeString('  Müller GmbH  ') // 'müller gmbh'
 * normalizeString('MÜLLER') // 'müller'
 * ```
 */
function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

/**
 * Fuzzy match company names using Levenshtein distance
 *
 * Compares two company names and returns a similarity score (0-1).
 * Uses normalized comparison (lowercase, trimmed) and Levenshtein distance.
 *
 * **Threshold:** 0.8 similarity (80% match) is considered a potential duplicate
 *
 * @param name1 - First company name
 * @param name2 - Second company name
 * @returns Similarity score (0-1, where 1 = exact match)
 *
 * @example
 * ```typescript
 * fuzzyMatchCompanyName('Müller GmbH', 'Mueller GmbH') // ~0.85 (above threshold)
 * fuzzyMatchCompanyName('Müller GmbH', 'Schmidt GmbH') // ~0.40 (below threshold)
 * fuzzyMatchCompanyName('Test GmbH', 'Test GmbH') // 1.0 (exact match)
 * ```
 */
export function fuzzyMatchCompanyName(name1: string, name2: string): number {
  if (!name1 || !name2) {
    return 0;
  }

  const normalized1 = normalizeString(name1);
  const normalized2 = normalizeString(name2);

  if (normalized1 === normalized2) {
    return 1.0; // Exact match after normalization
  }

  return calculateSimilarity(normalized1, normalized2);
}

/**
 * Check if two company names are similar enough to be considered duplicates
 *
 * Uses fuzzy matching with a threshold of 0.8 (80% similarity).
 *
 * @param name1 - First company name
 * @param name2 - Second company name
 * @param threshold - Similarity threshold (default: 0.8)
 * @returns True if similarity >= threshold
 *
 * @example
 * ```typescript
 * isDuplicateCompanyName('Müller GmbH', 'Mueller GmbH') // true (0.85 >= 0.8)
 * isDuplicateCompanyName('Müller GmbH', 'Schmidt GmbH') // false (0.40 < 0.8)
 * ```
 */
export function isDuplicateCompanyName(
  name1: string,
  name2: string,
  threshold: number = 0.8
): boolean {
  const similarity = fuzzyMatchCompanyName(name1, name2);
  return similarity >= threshold;
}
