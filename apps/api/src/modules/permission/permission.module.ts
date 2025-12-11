import { Module, Global } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { DatabaseModule } from '../../database/database.module';

@Global()
@Module({
    imports: [DatabaseModule],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule { }
