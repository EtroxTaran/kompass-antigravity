import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface PermissionGuardProps {
  requiredRoles: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  requiredRoles,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasRole, hasAnyRole } = useAuth();

  const allowed = requireAll
    ? requiredRoles.every((role) => hasRole(role))
    : hasAnyRole(requiredRoles);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
