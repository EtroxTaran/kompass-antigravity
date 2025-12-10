import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Briefcase,
  FileText,
  ClipboardList,
  Settings,
  CloudOff,
  LogOut,
  ChevronDown,
  CheckCircle2,
  ListTodo,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { StorageQuotaIndicator } from "@/components/storage";
import { HelpButton } from "@/components/help";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string; // Changed from just ID to potentially having a path
  badge?: number;
  submenu?: { id: string; label: string; path: string }[];
  disabled?: boolean;
}

interface SidebarProps {
  userRole?:
    | "GF"
    | "ADM"
    | "PLAN"
    | "KALK"
    | "BUCH"
    | "CRM"
    | "PM"
    | "SALES"
    | "LAGER";
  isOffline?: boolean;
  pendingChanges?: number;
  className?: string;
}

export function Sidebar({
  userRole = "ADM",
  isOffline = false,
  pendingChanges = 0,
  className,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "dashboard",
    "kunden",
    "vertrieb",
    "projekte",
    "rechnungen",
    "aktivitaeten",
  ]);

  // Menu configuration based on role
  const getMenuItems = (): MenuItem[] => {
    const allItems: MenuItem[] = [
      {
        id: "dashboard",
        label: "Dashboards",
        icon: LayoutDashboard,
        path: "/",
        submenu: [
          // Simplified for MVP - mostly pointing to dashboard or specific detail pages if we had them
          // For now, using query params or sub-routes
        ],
      },
      {
        id: "kunden",
        label: "Kunden",
        icon: Users,
        path: "/customers",
        submenu: [
          { id: "kundenliste", label: "Kundenliste", path: "/customers" },
          { id: "standorte", label: "Standorte", path: "/locations" }, // Placeholder
        ],
      },
      {
        id: "vertrieb",
        label: "Vertrieb",
        icon: TrendingUp,
        path: "/sales",
        badge: 5,
        submenu: [
          { id: "opportunities", label: "Opportunity Board", path: "/sales" },
          { id: "pipeline", label: "Pipeline", path: "/sales/pipeline" },
        ],
      },
      {
        id: "projekte",
        label: "Projekte",
        icon: Briefcase,
        path: "/projects",
        submenu: [
          {
            id: "projektuebersicht",
            label: "Projektübersicht",
            path: "/projects",
          },
        ],
      },
      {
        id: "inventory",
        label: "Lager & Katalog",
        icon: ClipboardList,
        path: "/inventory",
        submenu: [
          { id: "material", label: "Material", path: "/materials" },
          { id: "supplier", label: "Lieferanten", path: "/suppliers" },
          { id: "warehouses", label: "Lagerorte", path: "/warehouses" },
        ],
      },
      {
        id: "rechnungen",
        label: "Rechnungen (Kunde)",
        icon: FileText,
        path: "/invoices",
      },
      {
        id: "supplier-invoices",
        label: "Rechnungen (Lieferant)",
        icon: FileText,
        path: "/supplier-invoices",
      },
      {
        id: "tasks",
        label: "Meine Aufgaben",
        icon: ListTodo,
        path: "/tasks",
      },
      {
        id: "calendar",
        label: "Kalender",
        icon: CalendarDays,
        path: "/calendar",
      },
    ];

    return allItems;
  };

  const menuItems = getMenuItems();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      toggleExpanded(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const roleBadgeConfig = {
    GF: { label: "Geschäftsführung", color: "bg-primary" },
    ADM: { label: "Außendienst", color: "bg-chart-1" },
    PLAN: { label: "Planung", color: "bg-chart-2" },
    KALK: { label: "Kalkulation", color: "bg-chart-3" },
    BUCH: { label: "Buchhaltung", color: "bg-chart-4" },
    CRM: { label: "Kundenmanagement", color: "bg-primary" },
    PM: { label: "Projektmanagement", color: "bg-chart-2" },
    SALES: { label: "Vertrieb", color: "bg-chart-1" },
    LAGER: { label: "Lager & Logistik", color: "bg-chart-3" },
  };

  return (
    <aside
      className={cn(
        "w-64 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col",
        className,
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">K</span>
          </div>
          <h3>KOMPASS</h3>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">
              {user?.displayName || "Benutzer"}
            </p>
            <Badge
              variant="outline"
              className={cn(
                "mt-1 border-none text-white text-[10px] px-1.5 py-0 h-5",
                roleBadgeConfig[userRole].color,
              )}
            >
              {roleBadgeConfig[userRole].label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if active based on current path
            const isActive =
              location.pathname === item.path ||
              item.submenu?.some((sub) => location.pathname === sub.path);
            const isExpanded = expandedItems.includes(item.id);
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                    isActive &&
                      !hasSubmenu &&
                      "bg-sidebar-primary text-sidebar-primary-foreground", // Highlight if leaf node matched
                    !isActive &&
                      !item.disabled &&
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    item.disabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {hasSubmenu && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <ul className="mt-1 ml-4 border-l border-sidebar-border space-y-1">
                    {item.submenu!.map((subitem) => (
                      <li key={subitem.id}>
                        <button
                          onClick={() => navigate(subitem.path)}
                          className={cn(
                            "w-full text-left px-3 py-1.5 rounded-md transition-colors text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground",
                            location.pathname === subitem.path &&
                              "text-sidebar-primary font-medium bg-sidebar-accent/50",
                          )}
                        >
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
          {isOffline ? (
            <>
              <CloudOff className="h-4 w-4 text-destructive flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-destructive">Offline</p>
                <p className="text-xs text-muted-foreground">
                  {pendingChanges} ausstehend
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-left text-sm text-primary">
                Synchronisiert
              </span>
            </>
          )}
        </button>

        {/* Storage Quota Indicator */}
        <StorageQuotaIndicator />

        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium",
            location.pathname === "/settings" &&
              "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Einstellungen</span>
        </button>

        {/* Help Button */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-gray-500">Hilfe</span>
          <HelpButton />
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Abmelden</span>
        </button>
      </div>
    </aside>
  );
}
