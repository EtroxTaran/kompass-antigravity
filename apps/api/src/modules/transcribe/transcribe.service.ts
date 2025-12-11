import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class TranscribeService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-dev',
    });
  }

  async transcribeAudio(file: Express.Multer.File): Promise<{ text: string }> {
    const tempFilePath = path.join(
      os.tmpdir(),
      `${Date.now()}-${file.originalname}`,
    );

    try {
      // OpenAI SDK requires a file path or a ReadStream.
      // Since Multer keeps it in memory (or disk depending on config), let's ensure we have a file path.
      // If buffer is present, write to temp file
      if (file.buffer) {
        fs.writeFileSync(tempFilePath, file.buffer);
      } else if (file.path) {
        // If multer is configured to store on disk, use that path but we need to check if we need to copy it
        // For now assuming memory storage as per standard defaults or handled here
        // If it was file.path, we might use it directly if it has correct extension
      }

      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        language: 'de', // Default logic to German as per requirements
      });

      return { text: transcription.text };
    } catch (error) {
      console.error('Transcription error:', error);
      throw new InternalServerErrorException('Failed to transcribe audio');
    } finally {
      // Cleanup temp file
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.error('Failed to delete temp file', e);
        }
      }
    }
  }
}
