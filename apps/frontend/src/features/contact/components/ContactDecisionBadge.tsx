/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * ContactDecisionBadge Component
 *
 * Badge displaying decision-making role and authority level
 * Uses shadcn/ui Badge component with icons
 */

import { Crown, User, MessageSquare, Shield, Users, Info } from 'lucide-react';

import {
  getDecisionMakingRoleLabel,
  getAuthorityLevelLabel,
} from '@kompass/shared/types/entities/contact';
import {
  DecisionMakingRole,
  type AuthorityLevel,
} from '@kompass/shared/types/enums';

import { Badge } from '@/components/ui/badge';

interface ContactDecisionBadgeProps {
  role: DecisionMakingRole;
  authorityLevel: AuthorityLevel;
  showLabel?: boolean;
}

/**
 * Get icon for decision-making role
 */
function getRoleIcon(role: DecisionMakingRole) {
  switch (role) {
    case DecisionMakingRole.DECISION_MAKER:
      return Crown;
    case DecisionMakingRole.KEY_INFLUENCER:
      return Shield;
    case DecisionMakingRole.RECOMMENDER:
      return MessageSquare;
    case DecisionMakingRole.GATEKEEPER:
      return Users;
    case DecisionMakingRole.OPERATIONAL_CONTACT:
      return User;
    case DecisionMakingRole.INFORMATIONAL:
      return Info;
    default:
      return User;
  }
}

/**
 * Get badge variant for role
 */
function getRoleVariant(
  role: DecisionMakingRole
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (role) {
    case DecisionMakingRole.DECISION_MAKER:
      return 'default';
    case DecisionMakingRole.KEY_INFLUENCER:
      return 'default';
    case DecisionMakingRole.RECOMMENDER:
      return 'secondary';
    case DecisionMakingRole.GATEKEEPER:
      return 'secondary';
    case DecisionMakingRole.OPERATIONAL_CONTACT:
      return 'outline';
    case DecisionMakingRole.INFORMATIONAL:
      return 'outline';
    default:
      return 'secondary';
  }
}

/**
 * ContactDecisionBadge Component
 */
export function ContactDecisionBadge({
  role,
  authorityLevel,
  showLabel = true,
}: ContactDecisionBadgeProps) {
  const Icon = getRoleIcon(role);
  const variant = getRoleVariant(role);

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {getDecisionMakingRoleLabel(role)}
      </Badge>
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          ({getAuthorityLevelLabel(authorityLevel)})
        </span>
      )}
    </div>
  );
}
