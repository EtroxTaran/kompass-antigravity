import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Phone, Clock, FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuickActivityDrawer } from "./QuickActivityDrawer";

export function MobileQuickActions() {
  const navigate = useNavigate();
  const [activityDrawerOpen, setActivityDrawerOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 md:hidden print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mb-2">
            <DropdownMenuLabel>Schnellaktionen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActivityDrawerOpen(true)}>
              <Phone className="mr-2 h-4 w-4" />
              <span>Aktivität loggen</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/projects/time-tracking")}
            >
              <Clock className="mr-2 h-4 w-4" />
              <span>Zeit erfassen</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/sales/new")}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Neue Opportunity</span>
            </DropdownMenuItem>
            {/* 
                        <DropdownMenuItem onClick={() => navigate('/contacts/new')}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Neuer Kontakt</span>
                        </DropdownMenuItem> 
                        */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <QuickActivityDrawer
        open={activityDrawerOpen}
        onOpenChange={setActivityDrawerOpen}
      />
    </>
  );
}
