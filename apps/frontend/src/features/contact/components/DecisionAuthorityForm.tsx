/**
 * DecisionAuthorityForm Component
 *
 * Form for updating contact decision-making role and authority
 * Uses shadcn/ui Form components
 *
 * RESTRICTED: Only PLAN and GF roles can use this form
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  DecisionMakingRole,
  FunctionalRole,
  getDecisionMakingRoleLabel,
} from '@kompass/shared';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Form validation schema
 */
const decisionAuthorityFormSchema = z
  .object({
    decisionMakingRole: z.nativeEnum(DecisionMakingRole),
    authorityLevel: z.enum(['low', 'medium', 'high', 'final_authority']),
    canApproveOrders: z.boolean(),
    approvalLimitEur: z.number().min(0).max(10000000).optional(),
    functionalRoles: z.array(z.nativeEnum(FunctionalRole)),
    departmentInfluence: z.array(z.string()),
  })
  .refine(
    (data) => {
      // Business rule CO-001: Approval limit required if canApproveOrders is true
      if (data.canApproveOrders === true) {
        return data.approvalLimitEur && data.approvalLimitEur > 0;
      }
      return true;
    },
    {
      message:
        'Genehmigungslimit ist erforderlich, wenn Genehmigungsbefugnis aktiviert ist',
      path: ['approvalLimitEur'],
    }
  );

type DecisionAuthorityFormValues = z.infer<typeof decisionAuthorityFormSchema>;

interface DecisionAuthorityFormProps {
  initialValues?: Partial<DecisionAuthorityFormValues>;
  onSubmit: (values: DecisionAuthorityFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * DecisionAuthorityForm Component
 */
export function DecisionAuthorityForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: DecisionAuthorityFormProps) {
  const form = useForm<DecisionAuthorityFormValues>({
    resolver: zodResolver(decisionAuthorityFormSchema),
    defaultValues: {
      decisionMakingRole:
        initialValues?.decisionMakingRole ||
        DecisionMakingRole.OPERATIONAL_CONTACT,
      authorityLevel: initialValues?.authorityLevel || 'low',
      canApproveOrders: initialValues?.canApproveOrders || false,
      approvalLimitEur: initialValues?.approvalLimitEur,
      functionalRoles: initialValues?.functionalRoles || [],
      departmentInfluence: initialValues?.departmentInfluence || [],
    },
  });

  const canApproveOrders = form.watch('canApproveOrders');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Decision Making Role */}
        <FormField
          control={form.control}
          name="decisionMakingRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entscheidungsrolle *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Rolle wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={DecisionMakingRole.DECISION_MAKER}>
                    {getDecisionMakingRoleLabel(
                      DecisionMakingRole.DECISION_MAKER
                    )}
                  </SelectItem>
                  <SelectItem value={DecisionMakingRole.KEY_INFLUENCER}>
                    {getDecisionMakingRoleLabel(
                      DecisionMakingRole.KEY_INFLUENCER
                    )}
                  </SelectItem>
                  <SelectItem value={DecisionMakingRole.RECOMMENDER}>
                    {getDecisionMakingRoleLabel(DecisionMakingRole.RECOMMENDER)}
                  </SelectItem>
                  <SelectItem value={DecisionMakingRole.GATEKEEPER}>
                    {getDecisionMakingRoleLabel(DecisionMakingRole.GATEKEEPER)}
                  </SelectItem>
                  <SelectItem value={DecisionMakingRole.OPERATIONAL_CONTACT}>
                    {getDecisionMakingRoleLabel(
                      DecisionMakingRole.OPERATIONAL_CONTACT
                    )}
                  </SelectItem>
                  <SelectItem value={DecisionMakingRole.INFORMATIONAL}>
                    {getDecisionMakingRoleLabel(
                      DecisionMakingRole.INFORMATIONAL
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Rolle im Entscheidungsprozess</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Authority Level */}
        <FormField
          control={form.control}
          name="authorityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Befugnisstufe *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Stufe wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">
                    Niedrig (keine Genehmigung)
                  </SelectItem>
                  <SelectItem value="medium">Mittel (bis €10.000)</SelectItem>
                  <SelectItem value="high">Hoch (bis €50.000)</SelectItem>
                  <SelectItem value="final_authority">
                    Letztentscheidung (unbegrenzt)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Can Approve Orders */}
        <FormField
          control={form.control}
          name="canApproveOrders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Kann Bestellungen genehmigen</FormLabel>
                <FormDescription>
                  Kontakt darf Bestellungen/Angebote genehmigen
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Approval Limit (conditional) */}
        {canApproveOrders && (
          <FormField
            control={form.control}
            name="approvalLimitEur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genehmigungslimit (EUR) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximaler Auftragswert, den der Kontakt genehmigen kann
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Functional Roles (multi-select) */}
        <div className="space-y-2">
          <FormLabel>Funktionsbereiche</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(FunctionalRole).map((role) => (
              <FormField
                key={role}
                control={form.control}
                name="functionalRoles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(role)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, role]);
                          } else {
                            field.onChange(
                              current.filter((r: FunctionalRole) => r !== role)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        {role === FunctionalRole.OWNER_CEO &&
                          'Geschäftsführer/CEO'}
                        {role === FunctionalRole.PURCHASING_MANAGER &&
                          'Einkaufsleiter'}
                        {role === FunctionalRole.FACILITY_MANAGER &&
                          'Facility Manager'}
                        {role === FunctionalRole.STORE_MANAGER &&
                          'Filialleiter'}
                        {role === FunctionalRole.PROJECT_COORDINATOR &&
                          'Projektkoordinator'}
                        {role === FunctionalRole.FINANCIAL_CONTROLLER &&
                          'Finanzkontrolle'}
                        {role === FunctionalRole.OPERATIONS_MANAGER &&
                          'Betriebsleiter'}
                        {role === FunctionalRole.ADMINISTRATIVE && 'Verwaltung'}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* RBAC Warning */}
        <div className="rounded-md bg-yellow-50 p-4 text-sm">
          <p className="font-medium text-yellow-800">Hinweis:</p>
          <p className="text-yellow-700">
            Nur ADM+ Nutzer (PLAN, GF) können Entscheidungsbefugnisse ändern.
            Diese Änderungen werden im Audit-Log protokolliert.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Wird gespeichert...' : 'Speichern'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
