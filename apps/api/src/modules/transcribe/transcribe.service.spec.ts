import { Test, TestingModule } from '@nestjs/testing';
import { TranscribeService } from './transcribe.service';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';

// Mock OpenAI
jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => {
        return {
            audio: {
                transcriptions: {
                    create: jest.fn().mockResolvedValue({ text: 'Mock transcription' }),
                },
            },
        };
    });
});

// Mock fs
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    writeFileSync: jest.fn(),
    createReadStream: jest.fn(),
    existsSync: jest.fn().mockReturnValue(true),
    unlinkSync: jest.fn(),
}));

describe('TranscribeService', () => {
    let service: TranscribeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [TranscribeService],
        }).compile();

        service = module.get<TranscribeService>(TranscribeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should transcribe audio', async () => {
        const mockFile = {
            buffer: Buffer.from('test'),
            originalname: 'test.webm',
        } as Express.Multer.File;

        const result = await service.transcribeAudio(mockFile);
        expect(result).toEqual({ text: 'Mock transcription' });
        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(fs.createReadStream).toHaveBeenCalled();
        // expect(process.env.OPENAI_API_KEY).toBeDefined(); // Environment might not be set in test, but constructor handles it.
    });
});
