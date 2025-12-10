import { Module, Global, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Global()
@Module({
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) { }

  async onModuleInit() {
    // Initialize indices or checking connection
    await this.searchService.testConnection();
  }
}
