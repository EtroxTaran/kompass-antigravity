/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * DecisionAuthorityCard Component
 *
 * Read-only display of contact decision authority with edit button (PLAN/GF only)
 * Uses shadcn/ui Card component
 */

import { Edit, DollarSign, Briefcase, Building } from 'lucide-react';

import { FunctionalRole } from '@kompass/shared/types/enums';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import type { DecisionAuthorityResponseDto } from '../../../services/contact-api';

import { ContactDecisionBadge } from './ContactDecisionBadge';

interface DecisionAuthorityCardProps {
  authority: DecisionAuthorityResponseDto;
  onEdit?: () => void;
  canEdit?: boolean;
}

/**
 * Get German label for functional role
 */
function getFunctionalRoleLabel(role: FunctionalRole): string {
  switch (role) {
    case FunctionalRole.OWNER_CEO:
      return 'Geschäftsführer/CEO';
    case FunctionalRole.PURCHASING_MANAGER:
      return 'Einkaufsleiter';
    case FunctionalRole.FACILITY_MANAGER:
      return 'Facility Manager';
    case FunctionalRole.STORE_MANAGER:
      return 'Filialleiter';
    case FunctionalRole.PROJECT_COORDINATOR:
      return 'Projektkoordinator';
    case FunctionalRole.FINANCIAL_CONTROLLER:
      return 'Finanzkontrolle';
    case FunctionalRole.OPERATIONS_MANAGER:
      return 'Betriebsleiter';
    case FunctionalRole.ADMINISTRATIVE:
      return 'Verwaltung';
    default:
      return role;
  }
}

/**
 * DecisionAuthorityCard Component
 */
export function DecisionAuthorityCard({
  authority,
  onEdit,
  canEdit = false,
}: DecisionAuthorityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Entscheidungsbefugnis</span>
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Decision Making Role */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Entscheidungsrolle
          </h4>
          <ContactDecisionBadge
            role={authority.decisionMakingRole}
            authorityLevel={authority.authorityLevel}
          />
        </div>

        {/* Approval Authority */}
        {authority.canApproveOrders && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Genehmigungslimit
            </h4>
            <Badge variant="default">
              {authority.approvalLimitEur
                ? `bis €${authority.approvalLimitEur.toLocaleString('de-DE')}`
                : 'Unbegrenzt'}
            </Badge>
          </div>
        )}

        {!authority.canApproveOrders && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Genehmigungslimit
            </h4>
            <Badge variant="secondary">Keine Genehmigungsbefugnis</Badge>
          </div>
        )}

        {/* Functional Roles */}
        {authority.functionalRoles.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Funktionsbereiche</h4>
            <div className="flex flex-wrap gap-2">
              {authority.functionalRoles.map((role) => (
                <Badge key={role} variant="outline">
                  {getFunctionalRoleLabel(role)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Department Influence */}
        {authority.departmentInfluence.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Abteilungseinfluss
            </h4>
            <div className="flex flex-wrap gap-2">
              {authority.departmentInfluence.map((dept) => (
                <Badge key={dept} variant="secondary">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Locations */}
        {authority.assignedLocationIds.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Zugeordnete Standorte</h4>
            <p className="text-sm text-muted-foreground">
              {authority.assignedLocationIds.length} Standort(e) zugeordnet
            </p>
            {authority.isPrimaryContactForLocations.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Hauptansprechpartner für{' '}
                {authority.isPrimaryContactForLocations.length} Standort(e)
              </p>
            )}
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Zuletzt aktualisiert:{' '}
          {new Date(authority.lastUpdated).toLocaleString('de-DE')}
        </div>
      </CardContent>

      {/* RBAC Notice */}
      {!canEdit && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Nur ADM+ Nutzer (PLAN, GF) können Entscheidungsbefugnisse bearbeiten
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
