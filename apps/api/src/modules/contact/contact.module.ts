import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ContactRepository } from './contact.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
  exports: [ContactService],
})
export class ContactModule {}
