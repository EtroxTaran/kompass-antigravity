/**
 * ID Generation Utilities for KOMPASS
 *
 * Implements:
 * - UUID generation for most entities (offline-safe)
 * - Sequential GoBD-compliant IDs for Invoice and Project
 *
 * From DATA_MODEL_SPECIFICATION.md §4
 */

/**
 * Generate UUID-based entity ID
 *
 * Used for: Customer, Contact, Location, Opportunity, Protocol, etc.
 * Format: "{entityType}-{uuid}"
 *
 * @param entityType - Entity type (e.g., 'customer', 'opportunity')
 * @returns Entity ID
 *
 * @example
 * ```typescript
 * const customerId = generateEntityId('customer');
 * // => "customer-f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * ```
 */
export function generateEntityId(entityType: string): string {
  const uuid = crypto.randomUUID();
  return `${entityType}-${uuid}`;
}

/**
 * Generate GoBD-compliant sequential number
 *
 * Used for: Invoice, Project (legal requirement)
 *
 * **Invoice Format:** R-YYYY-#####
 * Example: R-2024-00456
 *
 * **Project Format:** P-YYYY-Q###
 * Example: P-2024-B023 (B = Q2)
 *
 * @param prefix - 'P' for Project, 'R' for Invoice (R = Rechnung)
 * @param year - Year (e.g., 2024)
 * @param sequence - Sequence number
 * @param quarter - Quarter for projects (1-4), converted to A-D
 * @returns GoBD-compliant number
 *
 * @example
 * ```typescript
 * // Invoice
 * const invoiceNumber = generateGoBDNumber('R', 2024, 456);
 * // => "R-2024-00456"
 *
 * // Project
 * const projectNumber = generateGoBDNumber('P', 2024, 23, 2);
 * // => "P-2024-B023"
 * ```
 */
export function generateGoBDNumber(
  prefix: 'P' | 'R',
  year: number,
  sequence: number,
  quarter?: number
): string {
  if (prefix === 'P') {
    // Project: Include quarter letter
    if (quarter === undefined) {
      const currentMonth = new Date().getMonth();
      quarter = Math.floor(currentMonth / 3) + 1;
    }

    const quarterLetter = ['A', 'B', 'C', 'D'][quarter - 1];
    const paddedSequence = String(sequence).padStart(3, '0');

    return `${prefix}-${year}-${quarterLetter}${paddedSequence}`;
  }

  // Invoice: Simple sequential
  const paddedSequence = String(sequence).padStart(5, '0');
  return `${prefix}-${year}-${paddedSequence}`;
}

/**
 * Parse entity ID to extract UUID
 *
 * @param id - Entity ID (format: "entityType-uuid")
 * @returns UUID or null if invalid format
 */
export function extractUUID(id: string): string | null {
  const parts = id.split('-');
  if (parts.length < 2) return null;

  // Rejoin everything after first hyphen (UUID contains hyphens)
  return parts.slice(1).join('-');
}

/**
 * Extract entity type from ID
 *
 * @param id - Entity ID
 * @returns Entity type or null
 */
export function extractEntityType(id: string): string | null {
  const parts = id.split('-');
  return parts.length > 0 ? (parts[0] ?? null) : null;
}

/**
 * Validate entity ID format
 *
 * @param id - Entity ID to validate
 * @param expectedType - Expected entity type (optional)
 * @returns True if valid
 */
export function isValidEntityId(id: string, expectedType?: string): boolean {
  if (!id || typeof id !== 'string') return false;

  const type = extractEntityType(id);
  if (!type) return false;

  if (expectedType && type !== expectedType) return false;

  const uuid = extractUUID(id);
  if (!uuid) return false;

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate GoBD number format
 *
 * @param number - GoBD number to validate
 * @param type - 'invoice' or 'project'
 * @returns True if valid
 */
export function isValidGoBDNumber(
  number: string,
  type: 'invoice' | 'project'
): boolean {
  if (type === 'invoice') {
    // Format: R-YYYY-##### (e.g., R-2024-00456)
    return /^R-\d{4}-\d{5}$/.test(number);
  }

  if (type === 'project') {
    // Format: P-YYYY-Q### (e.g., P-2024-B023)
    return /^P-\d{4}-[A-D]\d{3}$/.test(number);
  }

  return false;
}
