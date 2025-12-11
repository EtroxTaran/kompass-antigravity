import { Injectable, Logger } from '@nestjs/common';
import { MeiliSearch, Index, SearchResponse } from 'meilisearch';

export interface GlobalSearchResult {
  query: string;
  processingTimeMs: number;
  results: {
    customers: SearchHit[];
    projects: SearchHit[];
    opportunities: SearchHit[];
    suppliers: SearchHit[];
    materials: SearchHit[];
    contacts: SearchHit[];
  };
  totalHits: number;
}

export interface SearchHit {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  _matchesPosition?: Record<string, Array<{ start: number; length: number }>>;
}

const INDEX_CONFIGS = {
  customers: {
    searchableAttributes: [
      'companyName',
      'billingAddress.city',
      'billingAddress.street',
      'vatNumber',
      'notes',
      'email',
      'phone',
    ],
    displayedAttributes: ['_id', 'companyName', 'billingAddress'],
  },
  projects: {
    searchableAttributes: ['name', 'projectNumber', 'description', 'status'],
    displayedAttributes: ['_id', 'name', 'projectNumber', 'status'],
  },
  opportunities: {
    searchableAttributes: ['title', 'description', 'stage'],
    displayedAttributes: ['_id', 'title', 'stage', 'expectedValue'],
  },
  suppliers: {
    searchableAttributes: [
      'companyName',
      'billingAddress.city',
      'contactEmail',
      'notes',
    ],
    displayedAttributes: ['_id', 'companyName', 'billingAddress'],
  },
  materials: {
    searchableAttributes: ['name', 'itemNumber', 'description', 'category'],
    displayedAttributes: ['_id', 'name', 'itemNumber', 'category'],
  },
  contacts: {
    searchableAttributes: ['firstName', 'lastName', 'email', 'phone', 'position'],
    displayedAttributes: ['_id', 'firstName', 'lastName', 'email', 'phone'],
  },
};

@Injectable()
export class SearchService {
  private client: MeiliSearch;
  private readonly logger = new Logger(SearchService.name);

  constructor() {
    // South team uses port 7800 (offset from default 7700)
    this.client = new MeiliSearch({
      host: process.env.MEILI_HOST || 'http://localhost:7800',
      apiKey: process.env.MEILI_API_KEY || 'masterKey',
    });
  }

  async testConnection() {
    try {
      const version = await this.client.getVersion();
      this.logger.log(
        `Connected to MeiliSearch version: ${version.pkgVersion}`,
      );
      // Initialize indexes
      await this.initializeIndexes();
    } catch (error) {
      this.logger.error('Failed to connect to MeiliSearch', error);
    }
  }

  private async initializeIndexes() {
    for (const [indexName, config] of Object.entries(INDEX_CONFIGS)) {
      try {
        const index = this.client.index(indexName);
        await index.updateSettings({
          searchableAttributes: config.searchableAttributes,
          displayedAttributes: config.displayedAttributes,
        });
        this.logger.log(`Initialized index: ${indexName}`);
      } catch (error) {
        this.logger.warn(`Could not initialize index ${indexName}:`, error);
      }
    }
  }

  getIndex(indexUid: string): Index {
    return this.client.index(indexUid);
  }

  async indexDocument(indexUid: string, document: any) {
    try {
      const task = await this.client
        .index(indexUid)
        .addDocuments([document], { primaryKey: '_id' });
      return task;
    } catch (e) {
      this.logger.error(`Error indexing document to ${indexUid}`, e);
      throw e;
    }
  }

  async deleteDocument(indexUid: string, documentId: string) {
    try {
      const task = await this.client.index(indexUid).deleteDocument(documentId);
      return task;
    } catch (e) {
      this.logger.error(`Error deleting document from ${indexUid}`, e);
      throw e;
    }
  }

  async addDocuments(indexUid: string, documents: any[]) {
    try {
      const task = await this.client
        .index(indexUid)
        .addDocuments(documents, { primaryKey: '_id' });
      return task;
    } catch (e) {
      this.logger.error(`Error adding documents to ${indexUid}`, e);
      throw e;
    }
  }

  async search(indexUid: string, query: string, options?: any) {
    return this.client.index(indexUid).search(query, options);
  }

  /**
   * Global search across all entity indexes
   */
  async globalSearch(query: string, limit = 10): Promise<GlobalSearchResult> {
    const startTime = Date.now();
    const indexNames = Object.keys(INDEX_CONFIGS);

    const searchPromises = indexNames.map(async (indexName) => {
      try {
        const results = await this.client.index(indexName).search(query, {
          limit,
          showMatchesPosition: true,
          attributesToHighlight: ['*'],
        });
        return { indexName, results };
      } catch (error) {
        this.logger.warn(`Search failed for index ${indexName}:`, error);
        return { indexName, results: { hits: [], estimatedTotalHits: 0 } };
      }
    });

    const searchResults = await Promise.all(searchPromises);

    const results: GlobalSearchResult['results'] = {
      customers: [],
      projects: [],
      opportunities: [],
      suppliers: [],
      materials: [],
      contacts: [],
    };

    let totalHits = 0;

    for (const { indexName, results: indexResults } of searchResults) {
      const hits = this.transformHits(indexName, indexResults.hits);
      results[indexName as keyof typeof results] = hits;
      totalHits += indexResults.estimatedTotalHits || hits.length;
    }

    return {
      query,
      processingTimeMs: Date.now() - startTime,
      results,
      totalHits,
    };
  }

  private transformHits(indexName: string, hits: any[]): SearchHit[] {
    return hits.map((hit) => {
      switch (indexName) {
        case 'customers':
          return {
            id: hit._id,
            title: hit.companyName || 'Unknown Customer',
            subtitle: hit.billingAddress?.city || '',
            url: `/customers/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
        case 'projects':
          return {
            id: hit._id,
            title: hit.name || 'Unknown Project',
            subtitle: `PrNr: ${hit.projectNumber || 'N/A'}`,
            url: `/projects/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
        case 'opportunities':
          return {
            id: hit._id,
            title: hit.title || 'Unknown Opportunity',
            subtitle: `${hit.stage || ''} | ${hit.expectedValue || 0}€`,
            url: `/sales/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
        case 'suppliers':
          return {
            id: hit._id,
            title: hit.companyName || 'Unknown Supplier',
            subtitle: hit.billingAddress?.city || '',
            url: `/suppliers/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
        case 'materials':
          return {
            id: hit._id,
            title: hit.name || 'Unknown Material',
            subtitle: `ArtNr: ${hit.itemNumber || 'N/A'}`,
            url: `/materials/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
        case 'contacts':
          return {
            id: hit._id,
            title: `${hit.firstName} ${hit.lastName}`.trim() || 'Unknown Contact',
            subtitle: hit.position || hit.email || '',
            url: `/contacts/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
        default:
          return {
            id: hit._id,
            title: hit._id,
            url: `/${indexName}/${hit._id}`,
            _matchesPosition: hit._matchesPosition,
          };
      }
    });
  }
}
