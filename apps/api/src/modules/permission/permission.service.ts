import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import * as Nano from 'nano';
import { PermissionMatrix } from '@kompass/shared/src/types/permission-matrix';
import { UserRole, USER_ROLES } from '@kompass/shared/src/types/user';

@Injectable()
export class PermissionService implements OnModuleInit {
    private readonly logger = new Logger(PermissionService.name);
    private matrixCache: Record<string, PermissionMatrix['permissions']> = {};

    constructor(
        @Inject(OPERATIONAL_DB) private readonly db: Nano.DocumentScope<any>,
    ) { }

    async onModuleInit() {
        await this.loadPermissions();
    }

    /**
     * Load all permission matrices from DB and cache them
     */
    async loadPermissions() {
        try {
            this.logger.log('Loading permission matrices...');
            const result = await this.db.find({
                selector: {
                    type: 'permission_matrix',
                },
            });

            const docs = result.docs as PermissionMatrix[];

            // Reset cache
            this.matrixCache = {};

            for (const doc of docs) {
                this.matrixCache[doc.role] = doc.permissions;
            }

            this.logger.log(`Loaded permissions for ${docs.length} roles.`);
        } catch (error) {
            this.logger.error('Failed to load permissions', error);
        }
    }

    /**
     * Get permissions for a role, falling back to cache or empty
     */
    getPermissionsForRole(role: UserRole) {
        return this.matrixCache[role] || null;
    }

    /**
     * Refresh permissions (can be called via API)
     */
    async refreshPermissions() {
        await this.loadPermissions();
    }

    /**
     * Check if a role has permission for an action on an entity
     * Uses cached dynamic permissions, potentially merging with static defaults if needed.
     * For Hybrid RBAC, we assume DB permissions (if present) OVERRIDE static defaults?
     * Or we ONLY use DB permissions if present?
     * Current RbacGuard uses static matrix. We want to inject this service into RbacGuard.
     */
    // This logic will be in RbacGuard or here. Keeping it simple here.
}
