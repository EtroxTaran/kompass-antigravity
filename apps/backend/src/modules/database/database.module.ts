/**
 * Database Module
 *
 * Provides CouchDB NANO client as a singleton for dependency injection.
 * All repositories that need CouchDB access should inject 'NANO' token.
 *
 * Configuration:
 * - COUCHDB_URL: CouchDB server URL (default: http://localhost:5984)
 * - COUCHDB_ADMIN_USER: Admin username (default: admin)
 * - COUCHDB_ADMIN_PASSWORD: Admin password (required)
 * - COUCHDB_DATABASE: Database name (default: kompass)
 */

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import nanoFactory = require('nano');

import type { ServerScope as Nano } from 'nano';

/**
 * Database Module
 *
 * Global module that provides NANO client singleton.
 * Import this module once in AppModule, and all feature modules
 * can inject 'NANO' token to access CouchDB.
 */
@Global()
@Module({
  providers: [
    {
      provide: 'NANO',
      useFactory: (configService: ConfigService): Nano => {
        const url = configService.get<string>(
          'COUCHDB_URL',
          'http://localhost:5984'
        );
        const user = configService.get<string>('COUCHDB_ADMIN_USER', 'admin');
        const password = configService.get<string>('COUCHDB_ADMIN_PASSWORD');

        if (!password) {
          throw new Error(
            'COUCHDB_ADMIN_PASSWORD environment variable is required'
          );
        }

        // Create authenticated CouchDB connection URL
        // Parse URL to handle http/https correctly
        const urlObj = new URL(url);
        urlObj.username = user;
        urlObj.password = password;
        const authUrl = urlObj.toString();

        // Create NANO client with authenticated URL
        return nanoFactory(authUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['NANO'],
})
export class DatabaseModule {}
