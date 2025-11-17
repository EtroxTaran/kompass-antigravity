import { EntityType, Permission } from '@kompass/shared';

/**
 * Route definition with RBAC permissions
 */
export interface RouteDefinition {
  /** Route path */
  path: string;
  /** Display label for navigation */
  label: string;
  /** German label for navigation */
  labelDe: string;
  /** Required entity type for permission check */
  entityType: EntityType;
  /** Required permission action */
  permission: Permission;
  /** Icon name (from lucide-react) */
  icon?: string;
  /** Route group/category */
  group?: string;
}

/**
 * Application routes with RBAC permissions
 *
 * Routes are mapped to EntityType + Permission.READ for access control.
 * Navigation menu will filter routes based on user's role permissions.
 */
export const APP_ROUTES: RouteDefinition[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    labelDe: 'Dashboard',
    entityType: EntityType.Customer, // All authenticated users can access dashboard
    permission: Permission.READ,
    icon: 'LayoutDashboard',
    group: 'main',
  },
  {
    path: '/customers',
    label: 'Customers',
    labelDe: 'Kunden',
    entityType: EntityType.Customer,
    permission: Permission.READ,
    icon: 'Users',
    group: 'crm',
  },
  {
    path: '/opportunities',
    label: 'Opportunities',
    labelDe: 'Chancen',
    entityType: EntityType.Opportunity,
    permission: Permission.READ,
    icon: 'TrendingUp',
    group: 'crm',
  },
  {
    path: '/projects',
    label: 'Projects',
    labelDe: 'Projekte',
    entityType: EntityType.Project,
    permission: Permission.READ,
    icon: 'FolderKanban',
    group: 'projects',
  },
  {
    path: '/finance',
    label: 'Finance',
    labelDe: 'Finanzen',
    entityType: EntityType.Invoice,
    permission: Permission.READ,
    icon: 'Euro',
    group: 'finance',
  },
  {
    path: '/admin',
    label: 'Admin',
    labelDe: 'Administration',
    entityType: EntityType.User,
    permission: Permission.READ,
    icon: 'Settings',
    group: 'admin',
  },
];

/**
 * Get route definition by path
 */
export function getRouteByPath(path: string): RouteDefinition | undefined {
  return APP_ROUTES.find((route) => route.path === path);
}

/**
 * Get all routes for a specific group
 */
export function getRoutesByGroup(group: string): RouteDefinition[] {
  return APP_ROUTES.filter((route) => route.group === group);
}

/**
 * Route groups in display order
 */
export const ROUTE_GROUPS = [
  { id: 'main', label: 'Main', labelDe: 'Hauptmenü' },
  { id: 'crm', label: 'CRM', labelDe: 'CRM' },
  { id: 'projects', label: 'Projects', labelDe: 'Projekte' },
  { id: 'finance', label: 'Finance', labelDe: 'Finanzen' },
  { id: 'admin', label: 'Administration', labelDe: 'Administration' },
] as const;
