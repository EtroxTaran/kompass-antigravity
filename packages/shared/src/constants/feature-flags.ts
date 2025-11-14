/**
 * Feature Flags for KOMPASS
 *
 * Centralized feature flag management using environment variables
 * Phase 2.x AI extensions are behind feature flags for gradual rollout
 */

/**
 * AI & Automation Feature Flags
 *
 * Phase 2.1: RAG (Retrieval-Augmented Generation) Features
 * Phase 2.2: n8n Intelligent Automation
 * Phase 2.3: ML Predictive Analytics
 */
interface FeatureFlags {
  AI_RAG_ENABLED: boolean;
  AI_N8N_ENABLED: boolean;
  AI_ML_ENABLED: boolean;
  OPENFEATURE_ENABLED: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  /**
   * Phase 2.1: RAG (LlamaIndex + Weaviate)
   *
   * Enables:
   * - Semantic search across documents
   * - Context-aware customer insights
   * - Intelligent document processing
   */
  AI_RAG_ENABLED: process.env['AI_RAG_ENABLED'] === 'true',

  /**
   * Phase 2.2: n8n Intelligent Automation
   *
   * Enables:
   * - Workflow automation
   * - Webhook-triggered actions
   * - Third-party integrations
   */
  AI_N8N_ENABLED: process.env['AI_N8N_ENABLED'] === 'true',

  /**
   * Phase 2.3: ML Forecasting & Predictive Analytics
   *
   * Enables:
   * - Opportunity win probability prediction
   * - Cash flow forecasting
   * - Customer churn prediction
   */
  AI_ML_ENABLED: process.env['AI_ML_ENABLED'] === 'true',

  /**
   * OpenFeature Integration (Future)
   *
   * Enables:
   * - Advanced feature flag management
   * - A/B testing
   * - Gradual rollout
   */
  OPENFEATURE_ENABLED: process.env['OPENFEATURE_ENABLED'] === 'true',
};

/**
 * Check if any AI features are enabled
 */
export function isAnyAIFeatureEnabled(): boolean {
  return (
    FEATURE_FLAGS['AI_RAG_ENABLED'] ||
    FEATURE_FLAGS['AI_N8N_ENABLED'] ||
    FEATURE_FLAGS['AI_ML_ENABLED']
  );
}

/**
 * Get enabled AI features list
 */
export function getEnabledAIFeatures(): string[] {
  const enabled: string[] = [];

  if (FEATURE_FLAGS['AI_RAG_ENABLED']) {
    enabled.push('RAG (Semantic Search & Document Intelligence)');
  }

  if (FEATURE_FLAGS['AI_N8N_ENABLED']) {
    enabled.push('n8n (Workflow Automation)');
  }

  if (FEATURE_FLAGS['AI_ML_ENABLED']) {
    enabled.push('ML (Predictive Analytics & Forecasting)');
  }

  return enabled;
}

/**
 * Feature flag guard decorator (for NestJS)
 *
 * Usage:
 * @FeatureFlagGuard('AI_RAG_ENABLED')
 * async searchDocuments() { ... }
 */
export function requireFeatureFlag(flag: keyof FeatureFlags) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Feature flag guard can only be applied to methods');
    }

    const originalMethod = descriptor.value as (
      ...methodArgs: unknown[]
    ) => unknown;

    descriptor.value = function (...args: unknown[]): unknown {
      if (!FEATURE_FLAGS[flag]) {
        throw new Error(`Feature "${flag}" is not enabled`);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
