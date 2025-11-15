import { useState } from 'react';

import type { User, UserRole } from '@kompass/shared';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

/**
 * Role Assignment Dialog Component
 *
 * Allows GF and ADMIN users to assign multiple roles to a user and set primary role.
 *
 * TODO: Implement role assignment API calls
 * TODO: Add role descriptions and explanations
 * TODO: Add validation (primary role must be in selected roles)
 * TODO: Add loading states
 * TODO: Add success/error toast notifications
 * TODO: Add role change history display
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-role-management-endpoints
 * @see docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md
 */

interface RoleAssignmentDialogProps {
  /** User to assign roles to */
  user: User | null;
  /** Dialog open state */
  open: boolean;
  /** Callback to close dialog */
  onClose: () => void;
  /** Callback after successful role assignment */
  onSuccess?: (user: User) => void;
}

const ROLE_OPTIONS: Array<{
  value: UserRole;
  label: string;
  description: string;
}> = [
  {
    value: 'ADM' as UserRole,
    label: 'Außendienst (ADM)',
    description: 'Field sales - manages own customers and opportunities',
  },
  {
    value: 'INNEN' as UserRole,
    label: 'Innendienst (INNEN)',
    description: 'Inside sales - manages quotes and customer data',
  },
  {
    value: 'PLAN' as UserRole,
    label: 'Planung (PLAN)',
    description:
      'Project planning - full CRUD on projects, read-only customers',
  },
  {
    value: 'KALK' as UserRole,
    label: 'Kalkulation (KALK)',
    description: 'Cost calculation and time tracking',
  },
  {
    value: 'BUCH' as UserRole,
    label: 'Buchhaltung (BUCH)',
    description: 'Accounting - invoicing and payments',
  },
  {
    value: 'GF' as UserRole,
    label: 'Geschäftsführer (GF)',
    description: 'Executive management - full access to all data',
  },
  {
    value: 'ADMIN' as UserRole,
    label: 'System Administrator (ADMIN)',
    description:
      'System administration - full access including user management',
  },
];

export function RoleAssignmentDialog({
  user,
  open,
  onClose,
  onSuccess: _onSuccess, // TODO: Implement success callback
}: RoleAssignmentDialogProps): React.ReactElement {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(
    user?.roles || []
  );
  const [primaryRole, setPrimaryRole] = useState<UserRole | null>(
    user?.primaryRole || null
  );
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = (role: UserRole, checked: boolean): void => {
    // TODO: Implement role selection logic
    if (checked) {
      setSelectedRoles((prev) => [...prev, role]);
    } else {
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
      // If removing primary role, clear primary selection
      if (primaryRole === role) {
        setPrimaryRole(null);
      }
    }
  };

  const handleSubmit = async (): Promise<void> => {
    // TODO: Implement API call to assign roles
    // TODO: Validate that primaryRole is in selectedRoles
    // TODO: Show loading state
    // TODO: Show success/error toast
    // TODO: Call onSuccess callback
    setIsLoading(true);
    // API call will be implemented here
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rollen zuweisen - {user?.email}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Zugewiesene Rollen
            </Label>
            <p className="text-sm text-muted-foreground">
              Wählen Sie alle Rollen, die der Benutzer haben soll. Ein Benutzer
              muss mindestens eine Rolle haben.
            </p>

            <div className="space-y-3">
              {ROLE_OPTIONS.map((role) => (
                <div
                  key={role.value}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) =>
                      handleRoleToggle(role.value, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`role-${role.value}`}
                      className="font-medium cursor-pointer"
                    >
                      {role.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Role Selection */}
          {selectedRoles.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Primäre Rolle</Label>
              <p className="text-sm text-muted-foreground">
                Die primäre Rolle bestimmt die Standard-Berechtigungen und das
                Dashboard des Benutzers.
              </p>

              <RadioGroup
                value={primaryRole || ''}
                onValueChange={(value: string) => {
                  setPrimaryRole(value as UserRole);
                }}
              >
                {selectedRoles.map((role) => {
                  const roleOption = ROLE_OPTIONS.find((r) => r.value === role);
                  return (
                    <div key={role} className="flex items-center space-x-2">
                      <RadioGroupItem value={role} id={`primary-${role}`} />
                      <Label
                        htmlFor={`primary-${role}`}
                        className="cursor-pointer"
                      >
                        {roleOption?.label || role}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Grund für die Änderung (optional)</Label>
            <Textarea
              id="reason"
              placeholder="z.B. Beförderung zum Teamleiter, Aufgabenwechsel..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setReason(e.target.value);
              }}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                void handleSubmit();
              }}
              disabled={isLoading || selectedRoles.length === 0 || !primaryRole}
            >
              {isLoading ? 'Wird gespeichert...' : 'Rollen zuweisen'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
