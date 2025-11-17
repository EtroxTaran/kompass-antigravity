import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FolderKanban,
  Euro,
  Settings,
  Menu,
  type LucideIcon,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { hasAnyRolePermission } from '@kompass/shared';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import {
  APP_ROUTES,
  ROUTE_GROUPS,
  type RouteDefinition,
} from '../../config/routes.config';
import { useAuth } from '../../hooks/useAuth';

import { OfflineIndicator } from './OfflineIndicator';

/**
 * Icon mapping for routes
 */
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  TrendingUp,
  FolderKanban,
  Euro,
  Settings,
};

/**
 * Navigation Component
 *
 * Role-based navigation menu that shows only permitted routes.
 * Mobile-responsive with hamburger menu.
 * Uses useAuthGuard to filter visible routes.
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export function Navigation(): React.ReactElement {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle logout with proper binding
  const handleLogout = useCallback(() => {
    void logout();
  }, [logout]);

  /**
   * Filter routes by user permissions
   * Uses hasAnyRolePermission directly since we can't use hooks in filter
   */
  const visibleRoutes = useMemo(() => {
    if (!user || !user.roles || user.roles.length === 0) {
      // Only show dashboard if no roles
      return APP_ROUTES.filter((route) => route.path === '/dashboard');
    }

    return APP_ROUTES.filter((route) => {
      // Dashboard is always visible for authenticated users
      if (route.path === '/dashboard') {
        return true;
      }

      // Check permission using hasAnyRolePermission
      return hasAnyRolePermission(
        user.roles,
        route.entityType,
        route.permission
      );
    });
  }, [user]);

  /**
   * Group routes by category
   */
  const groupedRoutes = ROUTE_GROUPS.map((group) => ({
    ...group,
    routes: visibleRoutes.filter((route) => route.group === group.id),
  })).filter((group) => group.routes.length > 0);

  /**
   * Get icon component for route
   */
  const getIcon = (iconName?: string): LucideIcon | null => {
    if (!iconName) return null;
    return ICON_MAP[iconName] || null;
  };

  /**
   * Get user initials for avatar
   */
  const getUserInitials = useCallback((): string => {
    if (!user?.displayName) return 'U';
    const parts = user.displayName.split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.displayName.substring(0, 2).toUpperCase();
  }, [user?.displayName]);

  /**
   * Navigation link component
   */
  const NavLink = ({
    route,
    onClick,
  }: {
    route: RouteDefinition;
    onClick?: () => void;
  }): React.ReactElement => {
    const isActive = location.pathname === route.path;
    const Icon = getIcon(route.icon);

    return (
      <Link
        to={route.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted text-foreground'
        }`}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <span>{route.labelDe}</span>
      </Link>
    );
  };

  /**
   * Desktop navigation
   */
  const DesktopNav = useCallback(
    (): React.ReactElement => (
      <nav className="hidden md:flex flex-col gap-2 w-64 min-h-screen bg-background border-r p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">KOMPASS</h2>
          <OfflineIndicator />
        </div>

        {groupedRoutes.map((group, groupIndex) => (
          <div key={group.id}>
            {groupIndex > 0 && <Separator className="my-4" />}
            <div className="space-y-1">
              {group.routes.map((route) => (
                <NavLink key={route.path} route={route} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <Avatar>
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.displayName || 'Benutzer'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            Abmelden
          </Button>
        </div>
      </nav>
    ),
    [groupedRoutes, getUserInitials, user, handleLogout]
  );

  /**
   * Mobile navigation
   */
  const MobileNav = useCallback(
    (): React.ReactElement => (
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              KOMPASS
              <OfflineIndicator />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            {groupedRoutes.map((group, groupIndex) => (
              <div key={group.id}>
                {groupIndex > 0 && <Separator className="my-4" />}
                <div className="space-y-1">
                  {group.routes.map((route) => (
                    <NavLink
                      key={route.path}
                      route={route}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}

            <Separator className="my-4" />
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.displayName || 'Benutzer'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full"
            >
              Abmelden
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    ),
    [
      mobileMenuOpen,
      setMobileMenuOpen,
      groupedRoutes,
      getUserInitials,
      user,
      handleLogout,
    ]
  );

  return (
    <>
      <DesktopNav />
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">KOMPASS</h2>
        <div className="flex items-center gap-2">
          <OfflineIndicator />
          <MobileNav />
        </div>
      </div>
    </>
  );
}
