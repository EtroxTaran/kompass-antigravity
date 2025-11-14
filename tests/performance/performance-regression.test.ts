import { mkdir, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';

import type { Result } from 'autocannon';
import autocannon from 'autocannon';

/* eslint-disable no-console */

const THRESHOLDS = {
  latencyP50Ms: 400,
  latencyP95Ms: 1500,
  latencyP99Ms: 2500,
  minRequestsPerSecond: 200,
};

const TEST_DURATION_SECONDS = 10;
const CONNECTIONS = 25;
const ARTIFACT_DIR = path.join(process.cwd(), 'tests/performance/.artifacts');
let requestCounter = 0;

function simulateBusinessLogic(payload: Record<string, number>): number {
  // Deterministic CPU work to emulate data processing
  const values = Object.values(payload);
  return values
    .map((value, index) => Math.sin(value + index) * Math.cos(value - index))
    .reduce((acc, curr) => acc + curr, 0);
}

async function startMockApi(): Promise<{
  url: string;
  close: () => Promise<void>;
}> {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'GET' || req.url !== '/api/performance-test') {
      res.statusCode = 404;
      res.end();
      return;
    }

    requestCounter += 1;
    const payload = {
      id: requestCounter,
      timestamp: Date.now(),
      checksum: requestCounter * 31,
    };

    const workloadScore = simulateBusinessLogic(payload);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        workloadScore,
        receivedAt: payload.timestamp,
      })
    );
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}/api/performance-test`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }),
  };
}

function runAutocannon(url: string): Promise<Result> {
  return new Promise<Result>((resolve, reject) => {
    const instance = autocannon(
      {
        url,
        duration: TEST_DURATION_SECONDS,
        connections: CONNECTIONS,
        pipelining: 1,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    instance.on('error', reject);
  });
}

function assertThresholds(result: Result): void {
  const failures: string[] = [];

  if (result.latency.p50 > THRESHOLDS.latencyP50Ms) {
    failures.push(
      `p50 latency ${result.latency.p50}ms exceeded ${THRESHOLDS.latencyP50Ms}ms`
    );
  }

  if (result.latency.p97_5 > THRESHOLDS.latencyP95Ms) {
    failures.push(
      `p97.5 latency ${result.latency.p97_5}ms exceeded ${THRESHOLDS.latencyP95Ms}ms`
    );
  }

  if (result.latency.p99 > THRESHOLDS.latencyP99Ms) {
    failures.push(
      `p99 latency ${result.latency.p99}ms exceeded ${THRESHOLDS.latencyP99Ms}ms`
    );
  }

  if (result.requests.average < THRESHOLDS.minRequestsPerSecond) {
    failures.push(
      `Average throughput ${result.requests.average} req/s is below ${THRESHOLDS.minRequestsPerSecond} req/s`
    );
  }

  if (failures.length > 0) {
    const message = [
      'Performance regression detected:',
      ...failures.map((failure) => ` - ${failure}`),
      '',
      'Refer to docs/specifications/NFR_SPECIFICATION.md for target thresholds.',
    ].join('\n');
    throw new Error(message);
  }
}

async function writeSummary(result: Result): Promise<void> {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  const summaryPath = path.join(ARTIFACT_DIR, 'summary.json');

  const summary = {
    timestamp: new Date().toISOString(),
    durationSeconds: TEST_DURATION_SECONDS,
    connections: CONNECTIONS,
    latency: result.latency,
    requests: result.requests,
    throughput: result.throughput,
    errors: result.errors,
  };

  await writeFile(summaryPath, JSON.stringify(summary, null, 2));
}

async function main(): Promise<void> {
  const mockApi = await startMockApi();

  try {
    console.log(`🚀 Running performance test against ${mockApi.url}`);
    const result = await runAutocannon(mockApi.url);
    await writeSummary(result);
    assertThresholds(result);
    console.log(
      '✅ Performance baseline satisfied',
      JSON.stringify(
        {
          p50: result.latency.p50,
          p97_5: result.latency.p97_5,
          p99: result.latency.p99,
          requestsPerSecond: result.requests.average,
        },
        null,
        2
      )
    );
  } finally {
    await mockApi.close();
  }
}

main().catch((error) => {
  console.error('❌ Performance test failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
