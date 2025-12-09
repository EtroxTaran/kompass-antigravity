import { Module, Global, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';

@Global()
@Module({
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}

  async onModuleInit() {
    // Initialize indices or checking connection
    await this.searchService.testConnection();
  }
}
