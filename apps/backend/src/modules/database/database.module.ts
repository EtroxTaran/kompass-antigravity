import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Nano from 'nano';

import { DATABASE_CONNECTION } from './database.constants';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const url =
          configService.get<string>('COUCHDB_URL') || 'http://localhost:5984';
        const user = configService.get<string>('COUCHDB_USER') || 'admin';
        const password =
          configService.get<string>('COUCHDB_PASSWORD') || 'password';

        // Construct URL with credentials
        // If url already contains auth, use it, otherwise inject it
        // Assuming standard http://host:port format from env
        const urlObj = new URL(url);
        urlObj.username = user;
        urlObj.password = password;

        return Nano.default(urlObj.toString());
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DATABASE_CONNECTION, DatabaseService],
})
export class DatabaseModule {}
