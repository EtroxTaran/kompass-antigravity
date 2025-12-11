import { useState } from "react";
import { Search, User, LogOut, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useNavigate } from "react-router-dom";
import { SyncIndicator } from "@/components/shared/SyncIndicator";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMobileMenuClick?: () => void;
}

export function Header({
  userName = "Michael Schmidt",
  userRole = "Außendienst",
  breadcrumbs = [],
  onMobileMenuClick,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="h-16 border-b border-border bg-background px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden mr-2">
          <Button variant="ghost" size="icon" onClick={onMobileMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex-1 overflow-hidden">
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap whitespace-nowrap">
              {breadcrumbs.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem
                      className={
                        index === breadcrumbs.length - 1
                          ? "font-semibold"
                          : "hidden sm:inline-flex"
                      }
                    >
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="truncate max-w-[150px] sm:max-w-none">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href || "#"}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-2 ml-2">
          {/* Sync Status */}
          <SyncIndicator />

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Suche"
            className="hidden sm:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <NotificationBell />
          </div>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="pl-2 pr-2 gap-2 rounded-full h-9"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
