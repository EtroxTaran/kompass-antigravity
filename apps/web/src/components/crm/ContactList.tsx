import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./ContactForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// Color-coded styles for decision-making roles
const roleStyles: Record<string, string> = {
  decision_maker: "bg-purple-100 text-purple-800 border-purple-300",
  key_influencer: "bg-blue-100 text-blue-800 border-blue-300",
  recommender: "bg-green-100 text-green-800 border-green-300",
  gatekeeper: "bg-orange-100 text-orange-800 border-orange-300",
  operational_contact: "bg-gray-100 text-gray-800 border-gray-300",
  informational: "bg-slate-100 text-slate-600 border-slate-300",
};

interface ContactListProps {
  customerId: string;
}

export function ContactList({ customerId }: ContactListProps) {
  const { contacts, loading, addContact } = useContacts(customerId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (data: any) => {
    await addContact(data);
    setIsDialogOpen(false);
  };

  if (loading) return <div>Loading contacts...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contact Persons</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact Person</DialogTitle>
            </DialogHeader>
            <ContactForm
              onSubmit={handleCreate}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
            >
              <Avatar>
                <AvatarFallback>
                  {contact.firstName[0]}
                  {contact.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {contact.firstName} {contact.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contact.position}
                </p>
                <div className="text-xs text-muted-foreground">
                  {contact.email && (
                    <div className="mt-1">📧 {contact.email}</div>
                  )}
                  {contact.phone && <div>📞 {contact.phone}</div>}
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {contact.isPrimary && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-[10px] uppercase">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Primary
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase ${roleStyles[contact.decisionMakingRole] || ""}`}
                >
                  {contact.decisionMakingRole.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No contact persons added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
