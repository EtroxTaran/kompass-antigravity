/**
 * Database-related types for KOMPASS
 *
 * Types for CouchDB configuration, security, and initialization
 */

/**
 * CouchDB security document structure
 * Defines role-based access control at the database level
 */
export interface CouchDBSecurity {
  /**
   * Administrators - full access to database
   * Can create, read, update, delete all documents
   * Can modify design documents and security settings
   */
  admins: {
    /** Admin user names (CouchDB user accounts) */
    names: string[];
    /** Admin roles (KOMPASS roles: ADMIN, GF) */
    roles: string[];
  };
  /**
   * Members - application-level access
   * Can read/write application documents based on RBAC rules
   */
  members: {
    /** Member user names (CouchDB user accounts) */
    names: string[];
    /** Member roles (KOMPASS roles: ADM, INNEN, PLAN, KALK, BUCH, GF) */
    roles: string[];
  };
}

/**
 * Database initialization result
 */
export interface DatabaseInitResult {
  /** Database name */
  database: string;
  /** Whether database was created (true) or already existed (false) */
  created: boolean;
  /** Whether security document was created/updated */
  securityConfigured: boolean;
  /** Database information */
  info: {
    db_name: string;
    doc_count: number;
    update_seq: string;
  };
}

/**
 * CouchDB connection configuration
 */
export interface CouchDBConfig {
  /** CouchDB URL */
  url: string;
  /** Admin username */
  user: string;
  /** Admin password */
  password: string;
  /** Database name */
  database: string;
}
