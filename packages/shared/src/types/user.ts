import { BaseEntity } from './base';

export const USER_ROLES = ['GF', 'PLAN', 'ADM', 'INNEN', 'KALK', 'BUCH', 'LAGER', 'ADMIN'] as const;
export type UserRole = typeof USER_ROLES[number];

export interface User extends BaseEntity {
    username: string;
    email: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    roles: UserRole[];
    primaryRole: UserRole;
    active: boolean;

    // Profile settings
    workingHours?: number;
    availability?: string;
    officePresence?: string;

    // Auth
    keycloakId?: string;
}
