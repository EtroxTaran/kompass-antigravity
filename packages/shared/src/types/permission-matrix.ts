import { BaseEntity } from './base';
import { UserRole } from './user';

export interface PermissionMatrix extends BaseEntity {
    role: UserRole;
    permissions: {
        [entity: string]: {
            [action: string]: boolean;
        };
    };
}
