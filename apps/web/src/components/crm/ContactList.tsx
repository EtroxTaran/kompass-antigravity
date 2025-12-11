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
import { ContactPerson } from "@kompass/shared";
import { Pencil, Trash2 } from "lucide-react";

interface ContactListProps {
  customerId: string;
}

export function ContactList({ customerId }: ContactListProps) {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts(customerId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);

  const handleCreate = async (data: any) => {
    await addContact(data);
    setIsDialogOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (editingContact) {
      await updateContact(editingContact._id, data);
      setEditingContact(null);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      await deleteContact(id);
    }
  };

  const openAddDialog = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: ContactPerson) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading contacts...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contact Persons</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAddDialog}>Add Contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Contact" : "Add New Contact Person"}
              </DialogTitle>
            </DialogHeader>
            <ContactForm
              defaultValues={editingContact || undefined}
              onSubmit={editingContact ? handleUpdate : handleCreate}
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
              <div className="flex flex-col gap-2 items-end">
                <Badge variant="outline" className="text-[10px] uppercase">
                  {contact.decisionMakingRole.replace("_", " ")}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(contact)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(contact._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
