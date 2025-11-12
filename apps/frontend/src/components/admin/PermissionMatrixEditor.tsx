import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UserRole, EntityType, Permission } from '@kompass/shared/constants/rbac.constants';
import { PermissionMatrix } from '@kompass/shared/types/entities/role';

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

export function PermissionMatrixEditor() {
  const [activeMatrix, setActiveMatrix] = useState<PermissionMatrix | null>(null);
  const [editedMatrix, setEditedMatrix] = useState<Record<UserRole, Record<EntityType, Partial<Record<Permission, boolean>>>>>({} as any);
  const [changeReason, setChangeReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // TODO: Load active permission matrix on mount
  useEffect(() => {
    // TODO: Fetch active permission matrix from API
    // setActiveMatrix(data);
    // setEditedMatrix(data.matrix);
  }, []);

  const handlePermissionToggle = (
    role: UserRole,
    entity: EntityType,
    permission: Permission,
    checked: boolean
  ) => {
    // TODO: Implement permission toggle logic
    // TODO: Mark as dirty
    setIsDirty(true);
    console.log('Toggle permission:', { role, entity, permission, checked });
  };

  const handleSave = async () => {
    // TODO: Implement API call to create new permission matrix version
    // TODO: Validate changes
    // TODO: Show confirmation dialog
    // TODO: Show loading state
    // TODO: Show success/error toast
    console.log('Save permission matrix:', { editedMatrix, changeReason });
  };

  const handleReset = () => {
    // TODO: Reset edited matrix to active matrix
    // TODO: Clear dirty flag
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
              <Badge>Version {activeMatrix.version}</Badge>
              <span className="text-sm text-muted-foreground">
                Aktiv seit: {new Date(activeMatrix.effectiveDate).toLocaleDateString('de-DE')}
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
                  <>
                    {/* Entity Header Row */}
                    <TableRow key={`${entity}-header`}>
                      <TableCell colSpan={8} className="bg-muted font-semibold">
                        {entityLabel}
                      </TableCell>
                    </TableRow>

                    {/* Permission Rows */}
                    {Object.entries(PERMISSION_LABELS).map(([permission, permLabel]) => (
                      <TableRow key={`${entity}-${permission}`}>
                        <TableCell className="pl-8">{permLabel}</TableCell>
                        {Object.keys(ROLE_LABELS).map((role) => (
                          <TableCell key={`${entity}-${permission}-${role}`} className="text-center">
                            <Checkbox
                              checked={
                                editedMatrix[role as UserRole]?.[entity as EntityType]?.[permission as Permission] ||
                                false
                              }
                              onCheckedChange={(checked) =>
                                handlePermissionToggle(
                                  role as UserRole,
                                  entity as EntityType,
                                  permission as Permission,
                                  checked as boolean
                                )
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
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
              Bitte geben Sie einen Grund für die Änderungen an. Dies wird im Änderungsprotokoll gespeichert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="z.B. Neue Rolle hinzugefügt, Berechtigungen für PLAN-Rolle angepasst..."
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
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

