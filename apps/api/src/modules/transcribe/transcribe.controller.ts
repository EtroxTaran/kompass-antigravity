import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    ParseFilePipeBuilder,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscribeService } from './transcribe.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('transcribe')
@UseGuards(JwtAuthGuard)
export class TranscribeController {
    constructor(private readonly transcribeService: TranscribeService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async transcribeAudio(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(audio\/mpeg|audio\/wav|audio\/webm|audio\/mp4|audio\/m4a|audio\/mp3)/,
                })
                .addMaxSizeValidator({
                    maxSize: 25 * 1024 * 1024, // 25MB (Whisper limit)
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
    ) {
        return this.transcribeService.transcribeAudio(file);
    }
}
