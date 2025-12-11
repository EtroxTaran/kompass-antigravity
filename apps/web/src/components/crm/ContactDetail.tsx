import { useNavigate, useParams } from "react-router-dom";
import { useContact } from "@/hooks/useContacts"; // Fixed import path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityTimeline } from "./ActivityTimeline";
import { Mail, Phone, Building2, Briefcase, ArrowLeft } from "lucide-react";

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contact, loading } = useContact(id);

  if (loading) return <div>Loading contact...</div>;
  if (!contact) return <div>Contact not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {contact.firstName} {contact.lastName}
          </h2>
          <p className="text-muted-foreground">{contact.position}</p>
        </div>
        <Button onClick={() => navigate(`/contacts/${contact._id}/edit`)}>
          Edit Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs font-semibold block text-muted-foreground mb-1">
                  Email
                </span>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm hover:underline truncate"
                  >
                    {contact.email || "-"}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold block text-muted-foreground mb-1">
                  Phone
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm hover:underline"
                  >
                    {contact.phone || "-"}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs font-semibold block text-muted-foreground mb-1">
                  Department
                </span>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{contact.departmentInfluence?.join(", ") || "-"}</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold block text-muted-foreground mb-1">
                  Role
                </span>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs capitalize">
                    {contact.decisionMakingRole?.replace("_", " ") || "-"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ActivityTimeline
                customerId={contact.customerId}
                contactId={contact._id}
                customerName="Linked Customer"
              />
            </TabsContent>

            <TabsContent value="activities">
              <ActivityTimeline
                customerId={contact.customerId}
                contactId={contact._id}
                customerName="Linked Customer"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
