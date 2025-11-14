import { Fragment, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

import type {
  UserRole,
  EntityType,
  Permission,
} from '@kompass/shared/constants/rbac.constants';
import type { PermissionMatrix } from '@kompass/shared/types/entities/role';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Textarea } from '../ui/textarea';

/**
 * Permission Matrix Editor Component
 *
 * Allows GF users to edit the permission matrix and create new versions.
 * Displays the current active permission matrix and allows editing.
 *
 * TODO: Implement permission matrix API calls
 * TODO: Add version history view
 * TODO: Add version activation/rollback functionality
 * TODO: Add validation and conflict detection
 * TODO: Add loading states
 * TODO: Add success/error toast notifications
 * TODO: Add diff view for changes
 * TODO: Add confirmation dialog for changes
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#permission-matrix-endpoints
 * @see docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md
 */

const ENTITY_LABELS: Record<EntityType, string> = {
  Customer: 'Kunden',
  Contact: 'Kontakte',
  Location: 'Standorte',
  Opportunity: 'Chancen',
  Offer: 'Angebote',
  Project: 'Projekte',
  Task: 'Aufgaben',
  Invoice: 'Rechnungen',
  Payment: 'Zahlungen',
  Protocol: 'Protokolle',
  Document: 'Dokumente',
  User: 'Benutzer',
  TimeEntry: 'Zeiterfassung',
  ProjectCost: 'Projektkosten',
};

const PERMISSION_LABELS: Record<Permission, string> = {
  CREATE: 'Erstellen',
  READ: 'Lesen',
  UPDATE: 'Bearbeiten',
  DELETE: 'Löschen',
  APPROVE: 'Genehmigen',
  EXPORT: 'Exportieren',
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADM: 'Außendienst',
  INNEN: 'Innendienst',
  PLAN: 'Planung',
  KALK: 'Kalkulation',
  BUCH: 'Buchhaltung',
  GF: 'Geschäftsführer',
  ADMIN: 'Administrator',
};

export function PermissionMatrixEditor(): JSX.Element {
  const [activeMatrix, _setActiveMatrix] = useState<PermissionMatrix | null>(
    null
  );
  const [editedMatrix, setEditedMatrix] = useState<
    Record<UserRole, Record<EntityType, Partial<Record<Permission, boolean>>>>
  >(
    {} as Record<
      UserRole,
      Record<EntityType, Partial<Record<Permission, boolean>>>
    >
  );
  const [changeReason, setChangeReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // TODO: Load active permission matrix on mount
  useEffect(() => {
    if (activeMatrix) {
      setEditedMatrix(activeMatrix.matrix);
    }
  }, [activeMatrix]);

  const handlePermissionToggle = (
    role: UserRole,
    entity: EntityType,
    permission: Permission,
    checked: boolean
  ): void => {
    setEditedMatrix((previous) => {
      const updatedRoleMatrix: Record<
        EntityType,
        Partial<Record<Permission, boolean>>
      > = {
        ...(previous[role] ?? {}),
      };

      const updatedEntityMatrix: Partial<Record<Permission, boolean>> = {
        ...(updatedRoleMatrix[entity] ?? {}),
        [permission]: checked,
      };

      updatedRoleMatrix[entity] = updatedEntityMatrix;

      return {
        ...previous,
        [role]: updatedRoleMatrix,
      };
    });
    setIsDirty(true);
  };

  const handleSave = (): void => {
    // TODO: Implement API call to create new permission matrix version
    // TODO: Validate changes
    // TODO: Show confirmation dialog
    // TODO: Show loading state
    // TODO: Show success/error toast
    setIsLoading(true);
    // API call will be implemented here
    setIsLoading(false);
  };

  const handleReset = (): void => {
    if (activeMatrix) {
      setEditedMatrix(activeMatrix.matrix);
    }
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Berechtigungsmatrix-Editor</CardTitle>
          <CardDescription>
            Bearbeiten Sie die Berechtigungen für jede Rolle und jede Entität.
            Änderungen erstellen eine neue Version der Berechtigungsmatrix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeMatrix && (
            <div className="flex items-center gap-4">
              <Badge>Version {activeMatrix.matrixVersion}</Badge>
              <span className="text-sm text-muted-foreground">
                Aktiv seit:{' '}
                {new Date(activeMatrix.effectiveDate).toLocaleDateString(
                  'de-DE'
                )}
              </span>
              {isDirty && (
                <Badge variant="warning">Ungespeicherte Änderungen</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Berechtigungen pro Rolle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Entität</TableHead>
                  {Object.entries(ROLE_LABELS).map(([role, label]) => (
                    <TableHead key={role} className="text-center">
                      {label}
                      <br />
                      <span className="text-xs font-normal text-muted-foreground">
                        ({role})
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(ENTITY_LABELS).map(([entity, entityLabel]) => (
                  <Fragment key={entity}>
                    {/* Entity Header Row */}
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted font-semibold">
                        {entityLabel}
                      </TableCell>
                    </TableRow>

                    {/* Permission Rows */}
                    {Object.entries(PERMISSION_LABELS).map(
                      ([permission, permLabel]) => (
                        <TableRow key={`${entity}-${permission}`}>
                          <TableCell className="pl-8">{permLabel}</TableCell>
                          {(Object.keys(ROLE_LABELS) as UserRole[]).map(
                            (role) => (
                              <TableCell
                                key={`${entity}-${permission}-${role}`}
                                className="text-center"
                              >
                                <Checkbox
                                  checked={
                                    editedMatrix[role]?.[
                                      entity as EntityType
                                    ]?.[permission as Permission] ?? false
                                  }
                                  onCheckedChange={(checked) =>
                                    handlePermissionToggle(
                                      role,
                                      entity as EntityType,
                                      permission as Permission,
                                      checked as boolean
                                    )
                                  }
                                />
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      )
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Change Reason */}
      {isDirty && (
        <Card>
          <CardHeader>
            <CardTitle>Grund für die Änderung</CardTitle>
            <CardDescription>
              Bitte geben Sie einen Grund für die Änderungen an. Dies wird im
              Änderungsprotokoll gespeichert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="z.B. Neue Rolle hinzugefügt, Berechtigungen für PLAN-Rolle angepasst..."
              value={changeReason}
              onChange={(event) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const nextValue = (event as ChangeEvent<HTMLTextAreaElement>)
                  .currentTarget.value;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setChangeReason(nextValue);
              }}
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isDirty || isLoading}
        >
          Zurücksetzen
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || !changeReason || isLoading}
        >
          {isLoading ? 'Wird gespeichert...' : 'Neue Version erstellen'}
        </Button>
      </div>

      {/* TODO: Add version history section */}
      {/* TODO: Add version comparison view */}
      {/* TODO: Add rollback functionality */}
    </div>
  );
}
