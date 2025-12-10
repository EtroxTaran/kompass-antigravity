import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PortalLayoutProps {
  children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kompass Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Add logout or user profile here later */}
          <Button variant="ghost" asChild>
            <Link to="/portal/logout">Logout</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container max-w-5xl mx-auto p-6">{children}</main>
      <footer className="bg-slate-100 py-6 border-t mt-auto">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Kompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
