import { Role, PermissionMatrix } from '@kompass/shared/types/entities/role';

/**
 * Role Repository Interface
 * 
 * Defines data access operations for Role and PermissionMatrix entities.
 * 
 * TODO: Implement CouchDB operations
 * TODO: Add query methods for role filtering
 * TODO: Add permission matrix versioning queries
 */
export interface IRoleRepository {
  /**
   * Find all roles
   * 
   * @param activeOnly - If true, return only active roles
   * @returns Array of role documents
   * 
   * TODO: Implement CouchDB query
   */
  findAll(activeOnly?: boolean): Promise<Role[]>;

  /**
   * Find role by roleId
   * 
   * @param roleId - Role identifier (e.g., 'ADM', 'INNEN')
   * @returns Role document or null if not found
   * 
   * TODO: Implement CouchDB get by _id='role-{roleId}'
   */
  findByRoleId(roleId: string): Promise<Role | null>;

  /**
   * Create or update role configuration
   * 
   * @param role - Role document to save
   * @returns Saved role document with _rev
   * 
   * TODO: Implement CouchDB insert/update
   */
  save(role: Role): Promise<Role>;

  /**
   * Find active permission matrix
   * 
   * @returns Active permission matrix or null
   * 
   * TODO: Implement CouchDB query for active=true
   */
  findActivePermissionMatrix(): Promise<PermissionMatrix | null>;

  /**
   * Find permission matrix by version number
   * 
   * @param version - Version number
   * @returns Permission matrix document or null
   * 
   * TODO: Implement CouchDB query by version
   */
  findPermissionMatrixByVersion(version: number): Promise<PermissionMatrix | null>;

  /**
   * Create permission matrix version
   * 
   * @param matrix - Permission matrix document
   * @returns Saved permission matrix with _rev
   * 
   * TODO: Implement CouchDB insert
   */
  createPermissionMatrix(matrix: PermissionMatrix): Promise<PermissionMatrix>;

  /**
   * Update permission matrix (mark as active/inactive)
   * 
   * @param matrix - Permission matrix document to update
   * @returns Updated permission matrix with new _rev
   * 
   * TODO: Implement CouchDB update
   */
  updatePermissionMatrix(matrix: PermissionMatrix): Promise<PermissionMatrix>;

  /**
   * List all permission matrix versions
   * 
   * @returns Array of permission matrix versions, sorted by version desc
   * 
   * TODO: Implement CouchDB query
   */
  listPermissionMatrixVersions(): Promise<PermissionMatrix[]>;
}

