import React from 'react';

/**
 * Search Utility Functions
 *
 * Utilities for text matching and highlighting in search results.
 * Used for client-side search functionality in list views.
 */

/**
 * Escape special regex characters in a string
 *
 * @param str - String to escape
 * @returns Escaped string safe for use in regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if text matches query (case-insensitive)
 *
 * @param text - Text to search in
 * @param query - Search query
 * @returns True if text contains query (case-insensitive)
 *
 * @example
 * ```ts
 * matchText('Müller GmbH', 'müller') // true
 * matchText('Müller GmbH', 'MÜLLER') // true
 * matchText('Müller GmbH', 'gmbh') // true
 * matchText('Müller GmbH', 'xyz') // false
 * ```
 */
export function matchText(text: string, query: string): boolean {
  if (!query || !text) {
    return false;
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return false;
  }

  return normalizedText.includes(normalizedQuery);
}

/**
 * Highlight matching text in a string
 *
 * Returns a React fragment with matching text wrapped in <mark> tags.
 * Case-insensitive matching, highlights all occurrences.
 *
 * @param text - Text to highlight
 * @param query - Search query to highlight
 * @returns React node with highlighted text
 *
 * @example
 * ```tsx
 * highlightMatch('Müller GmbH', 'müller')
 * // Returns: <><mark>Müller</mark> GmbH</>
 * ```
 */
export function highlightMatch(
  text: string,
  query: string
): React.ReactElement {
  if (!query || !text) {
    return <>{text}</>;
  }

  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return <>{text}</>;
  }

  // Escape special regex characters
  const escapedQuery = escapeRegex(normalizedQuery);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  // Split text by matches and create React elements
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the query (case-insensitive)
        if (part.toLowerCase() === normalizedQuery.toLowerCase()) {
          return (
            <mark
              key={index}
              className="bg-yellow-200 dark:bg-yellow-800 font-medium"
            >
              {part}
            </mark>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}
