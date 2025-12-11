import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Nano from 'nano';

export const COUCHDB_CONNECTION = 'COUCHDB_CONNECTION';
export const OPERATIONAL_DB = 'OPERATIONAL_DB';
export const AUDIT_DB = 'AUDIT_DB';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: COUCHDB_CONNECTION,
      useFactory: (configService: ConfigService) => {
        // South team uses port 6084 (offset from default 5984)
        const url = configService.get<string>(
          'COUCHDB_URL',
          'http://admin:password@localhost:6084',
        );
        return Nano.default(url);
      },
      inject: [ConfigService],
    },
    {
      provide: OPERATIONAL_DB,
      useFactory: async (
        nano: Nano.ServerScope,
        configService: ConfigService,
      ) => {
        const dbName = configService.get<string>(
          'COUCHDB_OPERATIONAL_DB',
          'kompass_operational',
        );
        try {
          await nano.db.create(dbName);
          console.log(`Created database: ${dbName}`);
        } catch (error: any) {
          if (error.statusCode !== 412) {
            // 412 = DB already exists
            throw error;
          }
        }
        const db = nano.db.use(dbName);

        // Create indexes for common queries
        await createIndexes(db);

        return db;
      },
      inject: [COUCHDB_CONNECTION, ConfigService],
    },
    {
      provide: AUDIT_DB,
      useFactory: async (
        nano: Nano.ServerScope,
        configService: ConfigService,
      ) => {
        const dbName = configService.get<string>(
          'COUCHDB_AUDIT_DB',
          'kompass_audit',
        );
        try {
          await nano.db.create(dbName);
          console.log(`Created database: ${dbName}`);
        } catch (error: any) {
          if (error.statusCode !== 412) {
            throw error;
          }
        }
        return nano.db.use(dbName);
      },
      inject: [COUCHDB_CONNECTION, ConfigService],
    },
  ],
  exports: [COUCHDB_CONNECTION, OPERATIONAL_DB, AUDIT_DB],
})
export class DatabaseModule { }

async function createIndexes(db: Nano.DocumentScope<any>) {
  const indexes = [
    { index: { fields: ['type'] }, name: 'idx-type', ddoc: 'indexes' },
    {
      index: { fields: ['type', 'createdAt'] },
      name: 'idx-type-created',
      ddoc: 'indexes',
    },
    {
      index: { fields: ['type', 'customerId'] },
      name: 'idx-type-customer',
      ddoc: 'indexes',
    },
  ];

  for (const indexDef of indexes) {
    try {
      await db.createIndex(indexDef);
    } catch (error: any) {
      // Index might already exist, that's fine
      if (error.error !== 'index_already_exists') {
        console.warn(`Failed to create index ${indexDef.name}:`, error.message);
      }
    }
  }
}
