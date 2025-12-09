import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { MaterialRepository } from './material.repository';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [MaterialController],
  providers: [MaterialService, MaterialRepository],
  exports: [MaterialService, MaterialRepository],
})
export class MaterialModule {}
