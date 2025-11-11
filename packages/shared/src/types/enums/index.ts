/**
 * Enums for KOMPASS Domain Model
 * 
 * All enums used across the application
 */

/**
 * Decision-making role in the purchasing/approval process
 * 
 * Based on DATA_MODEL_SPECIFICATION.md
 */
export enum DecisionMakingRole {
  /** Final decision authority (e.g., CEO, Owner) */
  DECISION_MAKER = 'decision_maker',
  
  /** Strong influence on decisions (e.g., Purchasing Manager) */
  KEY_INFLUENCER = 'key_influencer',
  
  /** Provides recommendations (e.g., Project Manager) */
  RECOMMENDER = 'recommender',
  
  /** Controls access to decision makers (e.g., Executive Assistant) */
  GATEKEEPER = 'gatekeeper',
  
  /** Day-to-day operations only (e.g., Store Manager) */
  OPERATIONAL_CONTACT = 'operational_contact',
  
  /** Kept informed, no decision power (e.g., Receptionist) */
  INFORMATIONAL = 'informational',
}

/**
 * Functional responsibilities of a contact
 */
export enum FunctionalRole {
  /** Business owner or CEO */
  OWNER_CEO = 'owner_ceo',
  
  /** Purchasing/procurement */
  PURCHASING_MANAGER = 'purchasing_manager',
  
  /** Facility management */
  FACILITY_MANAGER = 'facility_manager',
  
  /** Store/branch management */
  STORE_MANAGER = 'store_manager',
  
  /** Project coordination */
  PROJECT_COORDINATOR = 'project_coordinator',
  
  /** Financial control */
  FINANCIAL_CONTROLLER = 'financial_controller',
  
  /** Operations management */
  OPERATIONS_MANAGER = 'operations_manager',
  
  /** Administrative support */
  ADMINISTRATIVE = 'administrative',
}

/**
 * Authority level for approvals
 * 
 * Guidelines (actual limits set per contact):
 * - low: €0 (no approval authority)
 * - medium: up to €10,000
 * - high: up to €50,000
 * - final_authority: any amount
 */
export type AuthorityLevel = 'low' | 'medium' | 'high' | 'final_authority';

/**
 * Type of physical location
 */
export enum LocationType {
  /** Main headquarters */
  HEADQUARTER = 'headquarter',
  
  /** Branch office or store */
  BRANCH = 'branch',
  
  /** Warehouse or distribution center */
  WAREHOUSE = 'warehouse',
  
  /** Temporary project site */
  PROJECT_SITE = 'project_site',
  
  /** Other location type */
  OTHER = 'other',
}

/**
 * Customer lifecycle status
 */
export enum CustomerType {
  /** Potential customer (lead) */
  PROSPECT = 'prospect',
  
  /** Active customer with ongoing business */
  ACTIVE = 'active',
  
  /** Inactive customer (no recent activity) */
  INACTIVE = 'inactive',
  
  /** Archived customer (historical) */
  ARCHIVED = 'archived',
}

/**
 * Customer business type
 */
export enum CustomerBusinessType {
  /** Direct marketing to consumers */
  DIRECT_MARKETER = 'direct_marketer',
  
  /** Retail store */
  RETAIL = 'retail',
  
  /** Franchise operation */
  FRANCHISE = 'franchise',
  
  /** Cooperative */
  COOPERATIVE = 'cooperative',
  
  /** Other business type */
  OTHER = 'other',
}

/**
 * Customer rating/tier
 */
export type CustomerRating = 'A' | 'B' | 'C';

/**
 * Preferred contact method
 */
export type PreferredContactMethod = 'email' | 'phone' | 'mobile';

