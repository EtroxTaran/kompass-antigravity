import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserProfilePage() {
  const { user } = useAuth();
  // Safe default if user is null
  const userRole =
    (user?.primaryRole as
      | "GF"
      | "ADM"
      | "PLAN"
      | "KALK"
      | "BUCH"
      | "CRM"
      | "PM"
      | "SALES"
      | "LAGER") || "ADM";

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout
      userRole={userRole}
      breadcrumbs={[{ label: "Mein Konto" }, { label: "Profil" }]}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-xl">
              {getInitials(user?.displayName || "User")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {user?.displayName || "Benutzer"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">{user?.email}</span>
              <Badge variant="outline">{userRole}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Name
                </span>
                <span>{user?.displayName || "-"}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Email
                </span>
                <span>{user?.email || "-"}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Benutzer ID
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {user?._id || "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Rolle</span>
                <Badge>{userRole}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Status</span>
                <Badge
                  variant={user?.active ? "outline" : "destructive"}
                  className={
                    user?.active
                      ? "bg-green-100 text-green-800 border-transparent hover:bg-green-100"
                      : ""
                  }
                >
                  {user?.active ? "Aktiv" : "Inaktiv"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
