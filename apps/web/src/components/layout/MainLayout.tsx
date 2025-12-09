import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MobileQuickActions } from "@/components/mobile/MobileQuickActions";

interface MainLayoutProps {
  children: ReactNode;
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
  userName?: string;
  breadcrumbs?: { label: string; href?: string }[];
  isOffline?: boolean;
  pendingChanges?: number;
}

export function MainLayout({
  children,
  userRole = "ADM",
  userName,
  breadcrumbs,
  isOffline,
  pendingChanges,
}: MainLayoutProps) {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map short role to full role name for header
  const roleNames = {
    GF: "Geschäftsführung",
    ADM: "Außendienst",
    PLAN: "Planung",
    KALK: "Kalkulation",
    BUCH: "Buchhaltung",
    CRM: "Kundenmanagement",
    PM: "Projektmanagement",
    SALES: "Vertrieb",
    LAGER: "Lager & Logistik",
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        userRole={userRole}
        isOffline={isOffline}
        pendingChanges={pendingChanges}
        className="hidden md:flex flex-shrink-0"
      />

      {/* Mobile Drawer (Sidebar) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar
            userRole={userRole}
            isOffline={isOffline}
            pendingChanges={pendingChanges}
            className="w-full h-full border-none"
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={userName || "Michael Schmidt"}
          userRole={roleNames[userRole]}
          breadcrumbs={breadcrumbs}
          onMobileMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
        <MobileQuickActions />
      </div>
    </div>
  );
}
