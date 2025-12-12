import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDuplicateCheck } from "@/hooks/useDuplicateCheck";
import { useLocations } from "@/hooks/useLocation";
import { ContactPerson } from "@kompass/shared";
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

interface ContactFormProps {
  defaultValues?: Partial<ContactPerson>;
  onSubmit: (data: Partial<ContactPerson>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContactForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ContactFormProps) {
  const { locations } = useLocations();
  const form = useForm<Partial<ContactPerson>>({
    defaultValues: {
      decisionMakingRole: "operational_contact",
      authorityLevel: "low",
      ...defaultValues,
    },
  });

  const { duplicates, checkDuplicates } = useDuplicateCheck();
  const email = useWatch({ control: form.control, name: "email" });
  const phone = useWatch({ control: form.control, name: "phone" });

  useEffect(() => {
    const timer = setTimeout(() => {
      checkDuplicates({
        email: email,
        phone: phone,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [email, phone, checkDuplicates]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {duplicates.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">Warning:</span> Match found with
                  existing Customer(s).
                  {duplicates.map((d) => (
                    <span key={d.id} className="block mt-1">
                      {d.companyName} ({d.matchReason})
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+49..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="decisionMakingRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="decision_maker">
                      Decision Maker
                    </SelectItem>
                    <SelectItem value="key_influencer">
                      Key Influencer
                    </SelectItem>
                    <SelectItem value="recommender">Recommender</SelectItem>
                    <SelectItem value="gatekeeper">Gatekeeper</SelectItem>
                    <SelectItem value="operational_contact">
                      Operational
                    </SelectItem>
                    <SelectItem value="informational">Informational</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="final_authority">
                      Final Authority
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormField
            control={form.control}
            name="canApproveOrders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Can Approve Orders</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {form.watch("canApproveOrders") && (
            <FormField
              control={form.control}
              name="approvalLimitEur"
              render={({ field }) => (
                <FormItem className="flex-1 ml-4">
                  <FormLabel>Approval Limit (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 5000"
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
          )}
        </div>

        <div className="flex items-center space-x-2 rounded-md border p-4">
          <FormField
            control={form.control}
            name="isPrimary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Primary Contact</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Mark as the main point of contact for this customer
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assignedLocationIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Locations</FormLabel>
              <FormControl>
                <Select
                  // Simplified multi-select using standard select for now, ideally strictly multi-select component needed
                  // For MVP, letting them pick one primary location or comma-sep if we had a multi-select component
                  // Switching to a simple multi-select mock or just one location for now if UI lib doesn't have MultiSelect built-in
                  // Actually, shadcn Select is single select. I will use a multiple select implementation or checkboxes.
                  // Checkboxes for locations seems reasonable if not too many.
                  // Let's assume few locations per customer.
                  onValueChange={(val) => {
                    // appending to array for now as a simple toggle is hard with single select
                    // implementation of multi-select is complex without external lib or custom comp
                    // I'll leave as single select or comma separated string for now?
                    // No, type is string[].
                    // I'll implement a simple vertical list of checkboxes if locations are available.
                    // I need to fetch locations first.
                    // I'll just skip this complexity for a second and add the visual field stub
                    // actually better: useLocations hook.
                    // Let's use a multiple select simple implementation.
                    // Since I can't easily add a complex component inline, I'll use a simple native multiple select or just checkboxes.
                    // Native select multiple:
                    // <select multiple onChange={...} ... >
                    const options = Array.from(
                      (
                        (val as unknown as React.ChangeEvent<HTMLSelectElement>)
                          .target as HTMLSelectElement
                      ).selectedOptions,
                      (option: HTMLOptionElement) => option.value,
                    );
                    field.onChange(options);
                  }}
                >
                  {/* Placeholder for locations, need to inject locations from prop or hook */}
                </Select>
              </FormControl>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto grid gap-2">
                {locations.map((loc) => (
                  <div key={loc._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.value?.includes(loc._id)}
                      onChange={(e) => {
                        const current = field.value || [];
                        if (e.target.checked) {
                          field.onChange([...current, loc._id]);
                        } else {
                          field.onChange(
                            current.filter((id: string) => id !== loc._id),
                          );
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">
                      {loc.locationName} - {loc.deliveryAddress?.city}
                    </span>
                  </div>
                ))}
                {locations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No locations available
                  </p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save Contact
          </Button>
        </div>
      </form>
    </Form>
  );
}
