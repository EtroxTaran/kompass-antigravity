import { ReactNode } from "react";
import { PermissionGuard } from "./PermissionGuard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

interface RestrictedProps {
  to: string[];
  children: ReactNode;
  message?: string;
  asBlock?: boolean;
}

/**
 * Restricted wraps a component. If the user has permission, it renders the component as is.
 * If not, it renders a fallback. This specific implementation is for showing a "Lock" or disabled state.
 * However, since we can't easily disable any generic child, a common pattern is to just hide it or show a lock icon instead.
 *
 * For this initial version, if access is denied, we show a Lock icon with a tooltip.
 */
export function Restricted({
  to,
  children,
  message = "Sie haben keine Berechtigung für diese Aktion.",
  asBlock = false,
}: RestrictedProps) {
  return (
    <PermissionGuard
      requiredRoles={to}
      fallback={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`inline-flex items-center justify-center opacity-50 cursor-not-allowed ${asBlock ? "w-full h-full min-h-[40px] bg-muted rounded-md border border-dashed" : ""}`}
              >
                <Lock className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
    >
      {children}
    </PermissionGuard>
  );
}
