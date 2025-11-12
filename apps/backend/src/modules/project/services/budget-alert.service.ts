import { Injectable, Logger } from '@nestjs/common';
import {
  Project,
  CostTrackingStatus,
  ProfitabilityReport,
} from '@kompass/shared/types/entities/project';

/**
 * Budget Alert Service
 * 
 * Handles budget threshold monitoring and notifications.
 * Alerts are triggered at 80%, 100%, and 110% budget usage.
 * 
 * @see Phase 3.3 of Time Tracking Implementation Plan
 */
@Injectable()
export class BudgetAlertService {
  private readonly logger = new Logger(BudgetAlertService.name);

  /**
   * Check budget status and trigger alerts if needed
   */
  async checkAndAlert(
    project: Project,
    profitability: ProfitabilityReport,
  ): Promise<void> {
    const percentUsed = this.calculateBudgetUsagePercent(
      profitability.actualTotalCostEur,
      project.budgetedTotalCostEur,
    );

    this.logger.log(`Project ${project._id} budget usage: ${percentUsed.toFixed(1)}%`);

    // Determine alert level and trigger appropriate notifications
    if (percentUsed >= 110) {
      await this.alertOverBudget(project, profitability, percentUsed);
    } else if (percentUsed >= 100) {
      await this.alertCritical(project, profitability, percentUsed);
    } else if (percentUsed >= 80) {
      await this.alertWarning(project, profitability, percentUsed);
    }
  }

  /**
   * Alert: Over budget (> 110%)
   * 
   * Critical alert - notify project manager and GF immediately
   */
  private async alertOverBudget(
    project: Project,
    profitability: ProfitabilityReport,
    percentUsed: number,
  ): Promise<void> {
    const message = `CRITICAL: Project "${project.projectName}" is OVER BUDGET by €${Math.abs(profitability.costVarianceEur).toFixed(2)} (${percentUsed.toFixed(1)}% of budget used)`;

    this.logger.error(message);

    // TODO: Send email to project manager
    await this.sendEmail({
      to: await this.getProjectManagerEmail(project.projectManager),
      subject: `🚨 CRITICAL: Project Over Budget - ${project.projectName}`,
      body: this.buildOverBudgetEmailBody(project, profitability, percentUsed),
      priority: 'high',
    });

    // TODO: Send email to GF
    await this.sendEmail({
      to: await this.getGFEmails(),
      subject: `🚨 CRITICAL: Project Over Budget - ${project.projectName}`,
      body: this.buildOverBudgetEmailBody(project, profitability, percentUsed),
      priority: 'high',
    });

    // TODO: Create in-app notification for project manager
    await this.createNotification({
      userId: project.projectManager,
      type: 'budget_alert',
      severity: 'critical',
      title: 'Project Over Budget',
      message,
      projectId: project._id,
      actionUrl: `/projects/${project._id}/profitability`,
    });

    // TODO: Log to audit trail
    await this.logAuditEvent({
      type: 'budget_alert',
      level: 'over_budget',
      projectId: project._id,
      budgetUsagePercent: percentUsed,
      variance: profitability.costVarianceEur,
    });
  }

  /**
   * Alert: Critical (100-110%)
   * 
   * High priority - notify project manager and GF
   */
  private async alertCritical(
    project: Project,
    profitability: ProfitabilityReport,
    percentUsed: number,
  ): Promise<void> {
    const message = `CRITICAL: Project "${project.projectName}" is at ${percentUsed.toFixed(1)}% of budget. Immediate action required.`;

    this.logger.warn(message);

    // TODO: Send email to project manager
    await this.sendEmail({
      to: await this.getProjectManagerEmail(project.projectManager),
      subject: `⚠️ CRITICAL: Project At Budget Limit - ${project.projectName}`,
      body: this.buildCriticalEmailBody(project, profitability, percentUsed),
      priority: 'high',
    });

    // TODO: Send email to GF
    await this.sendEmail({
      to: await this.getGFEmails(),
      subject: `⚠️ CRITICAL: Project At Budget Limit - ${project.projectName}`,
      body: this.buildCriticalEmailBody(project, profitability, percentUsed),
      priority: 'high',
    });

    // TODO: Create in-app notification
    await this.createNotification({
      userId: project.projectManager,
      type: 'budget_alert',
      severity: 'critical',
      title: 'Project At Budget Limit',
      message,
      projectId: project._id,
      actionUrl: `/projects/${project._id}/profitability`,
    });
  }

  /**
   * Alert: Warning (80-100%)
   * 
   * Warning - notify project manager only
   */
  private async alertWarning(
    project: Project,
    profitability: ProfitabilityReport,
    percentUsed: number,
  ): Promise<void> {
    const message = `WARNING: Project "${project.projectName}" has used ${percentUsed.toFixed(1)}% of budget. Monitor closely.`;

    this.logger.warn(message);

    // TODO: Send email to project manager
    await this.sendEmail({
      to: await this.getProjectManagerEmail(project.projectManager),
      subject: `⚠️ WARNING: Project Budget Alert - ${project.projectName}`,
      body: this.buildWarningEmailBody(project, profitability, percentUsed),
      priority: 'normal',
    });

    // TODO: Create in-app notification
    await this.createNotification({
      userId: project.projectManager,
      type: 'budget_alert',
      severity: 'warning',
      title: 'Project Budget Warning',
      message,
      projectId: project._id,
      actionUrl: `/projects/${project._id}/profitability`,
    });
  }

  /**
   * Calculate budget usage percentage
   */
  private calculateBudgetUsagePercent(
    actualCost: number,
    budgetedCost: number,
  ): number {
    if (budgetedCost === 0) return 0;
    return (actualCost / budgetedCost) * 100;
  }

  /**
   * Build email body for over budget alert
   */
  private buildOverBudgetEmailBody(
    project: Project,
    profitability: ProfitabilityReport,
    percentUsed: number,
  ): string {
    return `
🚨 CRITICAL BUDGET ALERT

Project: ${project.projectName}
Project Number: ${project.projectNumber || project._id}

BUDGET STATUS: OVER BUDGET (${percentUsed.toFixed(1)}%)

Budget Details:
• Budgeted Total: €${project.budgetedTotalCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
• Actual Cost: €${profitability.actualTotalCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
• Variance: €${Math.abs(profitability.costVarianceEur).toLocaleString('de-DE', { minimumFractionDigits: 2 })} OVER BUDGET
• Contract Value: €${project.contractValueEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}

Cost Breakdown:
• Labor Cost: €${profitability.actualLaborCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (Budget: €${project.budgetedLaborCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })})
• Material Cost: €${profitability.actualMaterialCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (Budget: €${project.budgetedMaterialCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })})

Profitability Impact:
• Estimated Profit: €${profitability.estimatedProfitEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
• Profit Margin: ${profitability.profitMarginPercent.toFixed(1)}%

IMMEDIATE ACTION REQUIRED:
1. Review project costs and identify over-expenditure
2. Assess remaining work and cost-to-complete
3. Discuss corrective actions with Geschäftsführer
4. Consider change orders or contract amendments if appropriate

View full profitability report: ${process.env.APP_URL}/projects/${project._id}/profitability

This is an automated alert from the KOMPASS project management system.
`;
  }

  /**
   * Build email body for critical alert
   */
  private buildCriticalEmailBody(
    project: Project,
    profitability: ProfitabilityReport,
    percentUsed: number,
  ): string {
    return `
⚠️ CRITICAL BUDGET ALERT

Project: ${project.projectName}
Project Number: ${project.projectNumber || project._id}

BUDGET STATUS: AT LIMIT (${percentUsed.toFixed(1)}%)

Budget Details:
• Budgeted Total: €${project.budgetedTotalCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
• Actual Cost: €${profitability.actualTotalCostEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
• Remaining: €${profitability.costVarianceEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}

ACTION REQUIRED:
• Stop all non-essential expenditure
• Review and approve all remaining costs
• Monitor daily cost tracking closely

View details: ${process.env.APP_URL}/projects/${project._id}/profitability
`;
  }

  /**
   * Build email body for warning alert
   */
  private buildWarningEmailBody(
    project: Project,
    profitability: ProfitabilityReport,
    percentUsed: number,
  ): string {
    return `
⚠️ BUDGET WARNING

Project: ${project.projectName}
Budget Usage: ${percentUsed.toFixed(1)}%

Remaining Budget: €${profitability.costVarianceEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })}

Please monitor project costs closely and plan remaining expenditure carefully.

View details: ${process.env.APP_URL}/projects/${project._id}/profitability
`;
  }

  /**
   * Send email notification
   * 
   * TODO: Implement actual email sending (e.g., using nodemailer, SendGrid, AWS SES)
   */
  private async sendEmail(params: {
    to: string | string[];
    subject: string;
    body: string;
    priority: 'high' | 'normal';
  }): Promise<void> {
    // Placeholder implementation
    this.logger.log(`[EMAIL] To: ${params.to}, Subject: ${params.subject}`);
    // TODO: Implement actual email sending
    // await this.emailService.send(params);
  }

  /**
   * Create in-app notification
   * 
   * TODO: Implement notification service
   */
  private async createNotification(notification: {
    userId: string;
    type: string;
    severity: 'warning' | 'critical';
    title: string;
    message: string;
    projectId: string;
    actionUrl: string;
  }): Promise<void> {
    // Placeholder implementation
    this.logger.log(`[NOTIFICATION] User: ${notification.userId}, Title: ${notification.title}`);
    // TODO: Implement notification creation
    // await this.notificationService.create(notification);
  }

  /**
   * Log audit event
   * 
   * TODO: Implement audit logging
   */
  private async logAuditEvent(event: {
    type: string;
    level: string;
    projectId: string;
    budgetUsagePercent: number;
    variance: number;
  }): Promise<void> {
    // Placeholder implementation
    this.logger.log(`[AUDIT] ${event.type}: Project ${event.projectId}, ${event.budgetUsagePercent.toFixed(1)}%`);
    // TODO: Implement audit logging
    // await this.auditService.log(event);
  }

  /**
   * Get project manager email
   * 
   * TODO: Implement user service lookup
   */
  private async getProjectManagerEmail(userId: string): Promise<string> {
    // Placeholder implementation
    // TODO: Implement user lookup
    // const user = await this.userService.findById(userId);
    // return user.email;
    return 'project.manager@example.com';
  }

  /**
   * Get GF (Geschäftsführer) emails
   * 
   * TODO: Implement user service lookup for GF role
   */
  private async getGFEmails(): Promise<string[]> {
    // Placeholder implementation
    // TODO: Implement user lookup for GF role
    // const gfUsers = await this.userService.findByRole(UserRole.GF);
    // return gfUsers.map(u => u.email);
    return ['gf@example.com'];
  }
}

