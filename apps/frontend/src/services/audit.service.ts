import axios from 'axios';

/**
 * Audit log entry for unauthorized access attempts
 */
export interface AuditLogEntry {
  /** User ID who attempted access */
  userId: string;
  /** Route path that was accessed */
  route: string;
  /** Timestamp of the attempt */
  timestamp: Date;
  /** Reason for denial */
  reason: string;
  /** User roles at time of attempt */
  roles: string[];
}

/**
 * Audit service for logging unauthorized access attempts
 *
 * Handles offline mode by queueing logs for sync when online.
 */
class AuditService {
  private readonly queue: AuditLogEntry[] = [];
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl =
      typeof import.meta.env['VITE_API_BASE_URL'] === 'string'
        ? import.meta.env['VITE_API_BASE_URL']
        : 'http://localhost:3000';
  }

  /**
   * Log unauthorized access attempt
   *
   * @param entry - Audit log entry
   */
  async logUnauthorizedAccess(entry: AuditLogEntry): Promise<void> {
    // Add to queue for offline sync
    this.queue.push(entry);

    // Try to send immediately if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      await this.flushQueue();
    }
  }

  /**
   * Flush queued audit logs to backend
   */
  async flushQueue(): Promise<void> {
    if (
      this.queue.length === 0 ||
      (typeof navigator !== 'undefined' && !navigator.onLine)
    ) {
      return;
    }

    const entries = [...this.queue];
    this.queue.length = 0; // Clear queue

    try {
      await axios.post(`${this.apiBaseUrl}/api/v1/audit/log`, {
        entries,
      });
    } catch (error) {
      // Re-queue failed entries
      this.queue.unshift(...entries);
      console.error('Failed to send audit logs:', error);
    }
  }

  /**
   * Initialize offline sync listener
   */
  initialize(): void {
    // Flush queue when coming back online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        void this.flushQueue();
      });
    }
  }
}

// Singleton instance
export const auditService = new AuditService();

// Initialize on module load
if (typeof window !== 'undefined') {
  auditService.initialize();
}
