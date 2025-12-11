/**
 * OpenTelemetry Instrumentation Setup
 *
 * This file MUST be imported before any other imports in main.ts
 * to ensure all modules are properly instrumented.
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable debug logging in development
if (process.env.OTEL_DEBUG === 'true') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

// Configure Prometheus metrics exporter
// South team uses port 9564 (offset from default 9464)
const prometheusPort = parseInt(process.env.PROMETHEUS_PORT || '9564', 10);
const prometheusExporter = new PrometheusExporter({
  port: prometheusPort,
  endpoint: '/metrics',
});

// Configure OTLP trace exporter (to Tempo)
// South team uses port 4417 (offset from default 4317)
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4417',
});

// Create OpenTelemetry SDK
// South team service name for identification
const sdk = new NodeSDK({
  serviceName: 'south-kompass-api',
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable some noisy instrumentations
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-nestjs-core': {
        enabled: true,
      },
    }),
  ],
});

// Start the SDK
sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) =>
      console.error('Error shutting down OpenTelemetry SDK', error),
    )
    .finally(() => process.exit(0));
});

console.log('OpenTelemetry instrumentation initialized (South team)');
console.log(`Prometheus metrics available at: http://localhost:${prometheusPort}/metrics`);
console.log(
  `Traces being sent to: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4417'}`,
);

export { sdk };
