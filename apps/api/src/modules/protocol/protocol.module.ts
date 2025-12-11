import { Module } from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { ProtocolController } from './protocol.controller';
import { ProtocolRepository } from './protocol.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProtocolController],
  providers: [ProtocolService, ProtocolRepository],
  exports: [ProtocolService, ProtocolRepository],
})
export class ProtocolModule {}
