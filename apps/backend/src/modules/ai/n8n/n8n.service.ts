/**
 * n8n Service (Stub)
 * 
 * Intelligent Workflow Automation using n8n
 * 
 * Phase 2.2: n8n Integration
 * - Trigger workflows on entity changes
 * - Send emails, notifications, Slack messages
 * - Sync data with external systems
 * - Execute scheduled tasks
 * 
 * Feature Flag: AI_N8N_ENABLED
 * 
 * TODO: Implement in Phase 2.2
 * - Configure n8n connection
 * - Implement webhook handlers
 * - Add workflow trigger methods
 * - Set up workflow templates
 */

import { Injectable, Logger } from '@nestjs/common';
import { FEATURE_FLAGS } from '@kompass/shared/constants/feature-flags';

/**
 * Workflow trigger payload
 */
export interface WorkflowTrigger {
  workflowId: string;
  event: string;
  data: Record<string, unknown>;
}

/**
 * Workflow execution status
 */
export interface WorkflowStatus {
  executionId: string;
  status: 'running' | 'success' | 'error';
  startTime: Date;
  endTime?: Date;
  error?: string;
}

/**
 * n8n Service (Stub Implementation)
 */
@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);

  constructor() {
    if (!FEATURE_FLAGS.AI_N8N_ENABLED) {
      this.logger.warn('n8n service initialized but AI_N8N_ENABLED=false');
    }
  }

  /**
   * Trigger a workflow execution
   * 
   * TODO Phase 2.2:
   * - Send webhook to n8n instance
   * - Pass event data as payload
   * - Return execution ID for status tracking
   * 
   * Example workflows:
   * - customer_created: Send welcome email, create Slack notification
   * - opportunity_won: Generate invoice, update external CRM
   * - invoice_overdue: Send reminder email, notify account manager
   */
  async triggerWorkflow(trigger: WorkflowTrigger): Promise<string> {
    this.ensureEnabled();

    this.logger.log(`[STUB] Triggering workflow ${trigger.workflowId} for event: ${trigger.event}`);
    // TODO: Implement in Phase 2.2
    throw new Error('n8n workflow triggering not yet implemented. Coming in Phase 2.2');
  }

  /**
   * Get workflow execution status
   * 
   * TODO Phase 2.2:
   * - Query n8n API for execution status
   * - Return execution details
   * - Include error information if failed
   */
  async getWorkflowStatus(executionId: string): Promise<WorkflowStatus> {
    this.ensureEnabled();

    this.logger.log(`[STUB] Getting workflow status: ${executionId}`);
    // TODO: Implement in Phase 2.2
    throw new Error('n8n status retrieval not yet implemented. Coming in Phase 2.2');
  }

  /**
   * List available workflows
   * 
   * TODO Phase 2.2:
   * - Query n8n API for workflow list
   * - Return workflow metadata
   */
  async listWorkflows(): Promise<Array<{ id: string; name: string; active: boolean }>> {
    this.ensureEnabled();

    this.logger.log('[STUB] Listing available workflows');
    // TODO: Implement in Phase 2.2
    return [];
  }

  /**
   * Ensure n8n feature is enabled
   */
  private ensureEnabled(): void {
    if (!FEATURE_FLAGS.AI_N8N_ENABLED) {
      throw new Error('n8n feature is not enabled. Set AI_N8N_ENABLED=true in environment');
    }
  }
}

