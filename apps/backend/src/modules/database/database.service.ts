import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Nano from 'nano';

import { DATABASE_CONNECTION, DATABASE_NAME } from './database.constants';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly nano: Nano.ServerScope,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    await this.ensureDatabaseExists();
  }

  async ensureDatabaseExists() {
    try {
      const dbList = await this.nano.db.list();
      if (!dbList.includes(DATABASE_NAME)) {
        this.logger.log(
          `Database ${DATABASE_NAME} does not exist. Creating...`
        );
        await this.nano.db.create(DATABASE_NAME);
        this.logger.log(`Database ${DATABASE_NAME} created successfully.`);
      } else {
        this.logger.log(`Database ${DATABASE_NAME} already exists.`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to check/create database: ${errorMessage}`,
        errorStack
      );
      // Don't throw here to allow app to start, but log critical error
      // In production, we might want to fail fast or have retry logic
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.nano.db.list();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Database connection check failed: ${errorMessage}`);
      return false;
    }
  }

  getDb(): Nano.DocumentScope<any> {
    return this.nano.use(DATABASE_NAME);
  }
}
