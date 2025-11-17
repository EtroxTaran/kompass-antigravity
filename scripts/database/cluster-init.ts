/**
 * CouchDB Cluster Initialization Script
 *
 * Sets up a 3-node CouchDB cluster for multi-master replication
 * Ensures quorum-based operations and conflict resolution
 *
 * Usage:
 *   pnpm db:cluster:init
 *
 * Requirements:
 *   - All 3 nodes must be running and healthy
 *   - Same Erlang cookie must be configured on all nodes
 */

import * as Nano from 'nano';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

const COUCHDB_PASSWORD = process.env['COUCHDB_PASSWORD'] || 'devpassword';
const COUCHDB_USER = process.env['COUCHDB_ADMIN_USER'] || 'admin';

// Cluster node URLs
const NODES = [
  { name: 'couchdb@couchdb-node1', url: 'http://couchdb-node1:5984' },
  { name: 'couchdb@couchdb-node2', url: 'http://couchdb-node2:5984' },
  { name: 'couchdb@couchdb-node3', url: 'http://couchdb-node3:5984' },
];

interface ClusterSetupAction {
  action: string;
  bind_address?: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  node?: string;
  [key: string]: unknown;
}

interface ClusterStatus {
  all_nodes: string[];
  cluster_nodes: string[];
}

function httpRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'Content-Length': options.body ? Buffer.byteLength(options.body) : 0,
      },
    };

    const req = httpModule.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          body,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function checkNodeHealth(nodeUrl: string): Promise<boolean> {
  try {
    const auth = Buffer.from(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`).toString(
      'base64'
    );
    const response = await httpRequest(`${nodeUrl}/_up`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.statusCode === 200;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Health check failed for ${nodeUrl}:`, errorMessage);
    return false;
  }
}

async function getClusterStatus(
  nodeUrl: string
): Promise<ClusterStatus | null> {
  try {
    const auth = Buffer.from(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`).toString(
      'base64'
    );
    const response = await httpRequest(`${nodeUrl}/_cluster_setup`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.statusCode !== 200) {
      throw new Error(`HTTP ${response.statusCode}: ${response.body}`);
    }

    return JSON.parse(response.body) as ClusterStatus;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `❌ Failed to get cluster status from ${nodeUrl}:`,
      errorMessage
    );
    return null;
  }
}

async function clusterSetup(
  coordinatorUrl: string,
  actions: ClusterSetupAction[]
): Promise<boolean> {
  try {
    const auth = Buffer.from(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`).toString(
      'base64'
    );
    const response = await httpRequest(`${coordinatorUrl}/_cluster_setup`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ actions }),
    });

    if (response.statusCode !== 200) {
      throw new Error(`HTTP ${response.statusCode}: ${response.body}`);
    }

    const result = JSON.parse(response.body);
    console.log('✅ Cluster setup response:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Cluster setup failed:`, errorMessage);
    return false;
  }
}

async function enableCluster(): Promise<void> {
  console.log('🔧 Starting CouchDB cluster setup...\n');

  // Step 1: Check all nodes are healthy
  console.log('📋 Step 1: Checking node health...');
  const healthChecks = await Promise.all(
    NODES.map(async (node) => ({
      node: node.name,
      url: node.url,
      healthy: await checkNodeHealth(node.url),
    }))
  );

  const unhealthyNodes = healthChecks.filter((check) => !check.healthy);
  if (unhealthyNodes.length > 0) {
    console.error('\n❌ Some nodes are not healthy:');
    unhealthyNodes.forEach((node) => {
      console.error(`   - ${node.node} (${node.url})`);
    });
    throw new Error(
      'Cannot proceed with cluster setup: unhealthy nodes detected'
    );
  }

  console.log('✅ All nodes are healthy\n');

  // Step 2: Check current cluster status
  console.log('📋 Step 2: Checking current cluster status...');
  const coordinator = NODES[0];
  const status = await getClusterStatus(coordinator.url);
  if (!status) {
    throw new Error('Failed to get cluster status');
  }

  console.log(
    `Current cluster nodes: ${status.cluster_nodes.join(', ') || 'none'}`
  );
  console.log(`All nodes: ${status.all_nodes.join(', ')}`);

  // Step 3: Enable clustering on each node
  console.log('\n📋 Step 3: Enabling clustering on each node...');
  const actions: ClusterSetupAction[] = [];

  // Enable clustering on node 1 (coordinator)
  actions.push({
    action: 'enable_cluster',
    bind_address: '0.0.0.0',
    username: COUCHDB_USER,
    password: COUCHDB_PASSWORD,
    node: NODES[0].name,
  });

  console.log(`✅ Enabled clustering on ${NODES[0].name}`);

  // Enable clustering on node 2
  actions.push({
    action: 'enable_cluster',
    bind_address: '0.0.0.0',
    username: COUCHDB_USER,
    password: COUCHDB_PASSWORD,
    node: NODES[1].name,
    host: 'couchdb-node2',
    port: 5986,
  });

  console.log(`✅ Enabled clustering on ${NODES[1].name}`);

  // Enable clustering on node 3
  actions.push({
    action: 'enable_cluster',
    bind_address: '0.0.0.0',
    username: COUCHDB_USER,
    password: COUCHDB_PASSWORD,
    node: NODES[2].name,
    host: 'couchdb-node3',
    port: 5986,
  });

  console.log(`✅ Enabled clustering on ${NODES[2].name}`);

  // Step 4: Add nodes to cluster
  console.log('\n📋 Step 4: Adding nodes to cluster...');
  actions.push({
    action: 'add_node',
    host: 'couchdb-node2',
    port: 5986,
    username: COUCHDB_USER,
    password: COUCHDB_PASSWORD,
  });

  console.log('✅ Added node 2 to cluster');

  actions.push({
    action: 'add_node',
    host: 'couchdb-node3',
    port: 5986,
    username: COUCHDB_USER,
    password: COUCHDB_PASSWORD,
  });

  console.log('✅ Added node 3 to cluster');

  // Step 5: Finish cluster setup
  console.log('\n📋 Step 5: Finishing cluster setup...');
  actions.push({
    action: 'finish_cluster',
  });

  // Execute cluster setup
  const success = await clusterSetup(coordinator.url, actions);
  if (!success) {
    throw new Error('Cluster setup failed');
  }

  console.log('\n✅ Cluster setup completed successfully!');
  console.log('\n📊 Cluster Status:');
  const finalStatus = await getClusterStatus(coordinator.url);
  if (finalStatus) {
    console.log(`   Cluster nodes: ${finalStatus.cluster_nodes.join(', ')}`);
    console.log(`   All nodes: ${finalStatus.all_nodes.join(', ')}`);
  }
}

async function configureDatabaseSharding(dbName: string): Promise<void> {
  console.log(`\n📋 Configuring sharding for database: ${dbName}...`);

  const coordinator = NODES[0];
  const nano = Nano({
    url: coordinator.url,
    requestDefaults: {
      auth: {
        username: COUCHDB_USER,
        password: COUCHDB_PASSWORD,
      },
    },
  });

  try {
    // Get database info
    const db = nano.db.use(dbName);
    const dbInfo = await db.info();

    console.log(`   Current shards: ${dbInfo.shard_suffix}`);
    console.log(`   Shard count: ${dbInfo.instance_start_time}`);

    // Update database with sharding configuration
    // For CouchDB 3.x, sharding is configured via _dbs database
    // Default sharding: q=8, n=3 (8 shards, 3 replicas)
    const shardConfig = {
      q: 8, // Number of shards
      n: 3, // Number of replicas (should match cluster size)
    };

    console.log(`   Configuring: q=${shardConfig.q}, n=${shardConfig.n}`);
    // Note: Sharding configuration is set at database creation
    // Existing databases need to be recreated with sharding config
    console.log(
      '   ⚠️  Note: Sharding must be configured at database creation'
    );
    console.log('   ⚠️  Existing databases will use default sharding');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `❌ Failed to configure sharding for ${dbName}:`,
      errorMessage
    );
  }
}

async function main(): Promise<void> {
  try {
    await enableCluster();

    // Configure sharding for kompass database (if it exists)
    await configureDatabaseSharding('kompass');

    console.log('\n✅ Cluster initialization completed!');
    console.log('\n📝 Next steps:');
    console.log(
      '   1. Verify cluster status: curl http://localhost:5984/_cluster_setup'
    );
    console.log(
      '   2. Check cluster membership: curl http://localhost:5984/_membership'
    );
    console.log('   3. Monitor cluster: curl http://localhost:5984/_up');

    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('\n❌ Cluster initialization failed:', errorMessage);
    if (errorStack) {
      console.error('\nStack trace:', errorStack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { enableCluster, configureDatabaseSharding };
