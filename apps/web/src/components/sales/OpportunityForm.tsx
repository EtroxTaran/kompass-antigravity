import { useForm, useWatch } from "react-hook-form";
import { Opportunity, ContactPerson } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomers } from "@/hooks/useCustomers";
import { useContacts } from "@/hooks/useContacts";
import { ApprovalLimitWarning } from "./ApprovalLimitWarning";
import { useMemo } from "react";

interface OpportunityFormProps {
  defaultValues?: Partial<Opportunity>;
  onSubmit: (data: Partial<Opportunity>) => void;
  isLoading?: boolean;
}

const STAGES = [
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "Qualified" },
  { value: "analysis", label: "Analysis" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

export function OpportunityForm({
  defaultValues,
  onSubmit,
  isLoading,
}: OpportunityFormProps) {
  const { customers } = useCustomers();

  const form = useForm<Opportunity>({
    defaultValues: {
      stage: "lead",
      probability: 10,
      currency: "EUR",
      ...defaultValues,
    },
  });

  // Watch form values for approval limit check
  const customerId = useWatch({ control: form.control, name: "customerId" });
  const contactPersonId = useWatch({ control: form.control, name: "contactPersonId" });
  const expectedValue = useWatch({ control: form.control, name: "expectedValue" });

  // Fetch contacts for selected customer
  const { contacts } = useContacts(customerId);

  // Find selected contact and calculate approval limit warning
  const selectedContact = useMemo(
    () => contacts.find((c) => c._id === contactPersonId),
    [contacts, contactPersonId]
  );

  const approvalLimitExceeded = useMemo(() => {
    if (!selectedContact?.approvalLimitEur || !expectedValue) return false;
    return expectedValue > selectedContact.approvalLimitEur;
  }, [selectedContact, expectedValue]);

  // Find alternative contacts with higher approval limits
  const alternativeContacts = useMemo((): ContactPerson[] => {
    if (!expectedValue || !selectedContact) return [];
    return contacts.filter(
      (c) =>
        c._id !== contactPersonId &&
        c.approvalLimitEur &&
        c.approvalLimitEur >= expectedValue
    );
  }, [contacts, contactPersonId, expectedValue, selectedContact]);

  // Handle selecting an alternative contact
  const handleSelectAlternative = (newContactId: string) => {
    form.setValue("contactPersonId", newContactId);
  };

  // Enhanced submit handler that sets requiresHigherApproval flag
  const handleSubmit = (data: Partial<Opportunity>) => {
    const enhancedData = {
      ...data,
      requiresHigherApproval: approvalLimitExceeded,
    };
    onSubmit(enhancedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Approval Limit Warning */}
        {approvalLimitExceeded && selectedContact && (
          <ApprovalLimitWarning
            expectedValue={expectedValue}
            approvalLimit={selectedContact.approvalLimitEur!}
            contactName={`${selectedContact.firstName} ${selectedContact.lastName}`}
            alternativeContacts={alternativeContacts}
            onSelectAlternative={handleSelectAlternative}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opportunity Name</FormLabel>
                      <FormControl>
                        <Input placeholder="New Website Redesign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerId"
                  rules={{ required: "Customer is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear contact when customer changes
                          form.setValue("contactPersonId", undefined);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Person Selector */}
                <FormField
                  control={form.control}
                  name="contactPersonId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!customerId || contacts.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !customerId
                                  ? "Select a customer first"
                                  : contacts.length === 0
                                    ? "No contacts available"
                                    : "Select a contact person"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contacts.map((contact) => (
                            <SelectItem key={contact._id} value={contact._id}>
                              {contact.firstName} {contact.lastName}
                              {contact.position && ` - ${contact.position}`}
                              {contact.approvalLimitEur && (
                                <span className="text-muted-foreground ml-1">
                                  (Limit: €
                                  {contact.approvalLimitEur.toLocaleString(
                                    "de-DE"
                                  )}
                                  )
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Details about the opportunity..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STAGES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedValue"
                  rules={{ required: "Value is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Value (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="probability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probability (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedCloseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Close Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Opportunity"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
