/**
 * Address structure for KOMPASS
 *
 * Used for both billing addresses (Customer) and delivery addresses (Location)
 *
 * Validation rules from DATA_MODEL_SPECIFICATION.md:
 * - street: Required, 2-100 characters
 * - zipCode: Required, format depends on country (Germany: 5 digits)
 * - city: Required, 2-100 characters
 * - country: Required, default "Deutschland"
 * - Geolocation: If latitude provided, longitude MUST also be provided (and vice versa)
 */

export interface Address {
  /** Street name (REQUIRED) */
  street: string;

  /** House/building number */
  streetNumber?: string;

  /** Additional address info (e.g., "Hintereingang", "2. Stock") */
  addressLine2?: string;

  /** Postal code (REQUIRED) */
  zipCode: string;

  /** City name (REQUIRED) */
  city: string;

  /** State/Bundesland (e.g., "Bayern") */
  state?: string;

  /** Country name (REQUIRED, default: "Deutschland") */
  country: string;

  /** GPS latitude (for route planning) */
  latitude?: number;

  /** GPS longitude (for route planning) */
  longitude?: number;
}

/**
 * Validates that an address has required fields
 */
export function isValidAddress(address: unknown): address is Address {
  if (typeof address !== 'object' || address === null) {
    return false;
  }

  const addr = address as Address;

  // Required fields
  if (!addr.street || typeof addr.street !== 'string') {
    return false;
  }
  if (!addr.zipCode || typeof addr.zipCode !== 'string') {
    return false;
  }
  if (!addr.city || typeof addr.city !== 'string') {
    return false;
  }
  if (!addr.country || typeof addr.country !== 'string') {
    return false;
  }

  // Geolocation validation: both or neither
  if (
    (addr.latitude !== undefined && addr.longitude === undefined) ||
    (addr.longitude !== undefined && addr.latitude === undefined)
  ) {
    return false;
  }

  return true;
}

/**
 * Creates a default German address
 */
export function createDefaultAddress(overrides?: Partial<Address>): Address {
  return {
    street: '',
    zipCode: '',
    city: '',
    country: 'Deutschland',
    ...overrides,
  };
}

/**
 * Formats address as a single-line string
 */
export function formatAddress(address: Address): string {
  const parts: string[] = [];

  if (address.street) {
    parts.push(
      address.streetNumber
        ? `${address.street} ${address.streetNumber}`
        : address.street
    );
  }

  if (address.addressLine2) {
    parts.push(address.addressLine2);
  }

  if (address.zipCode && address.city) {
    parts.push(`${address.zipCode} ${address.city}`);
  }

  if (address.country && address.country !== 'Deutschland') {
    parts.push(address.country);
  }

  return parts.join(', ');
}

/**
 * Formats address as multi-line string
 */
export function formatAddressMultiLine(address: Address): string {
  const lines: string[] = [];

  if (address.street) {
    lines.push(
      address.streetNumber
        ? `${address.street} ${address.streetNumber}`
        : address.street
    );
  }

  if (address.addressLine2) {
    lines.push(address.addressLine2);
  }

  if (address.zipCode && address.city) {
    lines.push(`${address.zipCode} ${address.city}`);
  }

  if (address.state) {
    lines.push(address.state);
  }

  if (address.country) {
    lines.push(address.country);
  }

  return lines.join('\n');
}
