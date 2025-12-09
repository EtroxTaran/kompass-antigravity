import { Injectable, Logger } from '@nestjs/common';
import { MeiliSearch, Index } from 'meilisearch';

@Injectable()
export class SearchService {
  private client: MeiliSearch;
  private readonly logger = new Logger(SearchService.name);

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILI_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_API_KEY || 'masterKey',
    });
  }

  async testConnection() {
    try {
      const version = await this.client.getVersion();
      this.logger.log(
        `Connected to MeiliSearch version: ${version.pkgVersion}`,
      );
    } catch (error) {
      this.logger.error('Failed to connect to MeiliSearch', error);
    }
  }

  getIndex(indexUid: string): Index {
    return this.client.index(indexUid);
  }

  async addDocuments(indexUid: string, documents: any[]) {
    try {
      const task = await this.client.index(indexUid).addDocuments(documents);
      return task;
    } catch (e) {
      this.logger.error(`Error adding documents to ${indexUid}`, e);
      throw e;
    }
  }

  async search(indexUid: string, query: string, options?: any) {
    return this.client.index(indexUid).search(query, options);
  }
}
