import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { UserTaskService } from '../user-task/user-task.service';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { CreateActionItemsDto, SummarizeResponseDto } from './dto/summarize.dto';

@Injectable()
export class SummarizeService {
    private openai: OpenAI;

    constructor(private readonly userTaskService: UserTaskService) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async summarizeText(text: string): Promise<SummarizeResponseDto> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant that summarizes transcribed audio notes for a Field Sales Rep.
Extract a concise summary, a list of actionable tasks (action items), and a suggested follow-up date effectively.
Return ONLY a valid JSON object with the following structure:
{
  "summary": "concise summary of the note",
  "actionItems": [
    {
      "title": "short title of action",
      "description": "more detailed description",
      "dueDate": "ISO 8601 date string if a date is mentioned or implied, otherwise null"
    }
  ],
  "suggestedFollowUpDate": "ISO 8601 date string or null"
}
Do not include markdown formatting (like \`\`\`json). Just the raw JSON.`,
                    },
                    {
                        role: 'user',
                        content: text,
                    },
                ],
                temperature: 0.3,
            });

            const content = response.choices[0].message.content;
            if (!content) {
                throw new InternalServerErrorException('Empty response from AI');
            }

            // Clean up potential markdown code blocks if the model ignores the instruction
            const jsonString = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');

            const parsed = JSON.parse(jsonString);
            return parsed as SummarizeResponseDto;
        } catch (error) {
            console.error('Summarization error:', error);
            throw new InternalServerErrorException('Failed to summarize text');
        }
    }

    async createActionItems(dto: CreateActionItemsDto, user: AuthenticatedUser) {
        const createdTasks = [];
        for (const item of dto.items) {
            const task = await this.userTaskService.create(
                {
                    title: item.title,
                    description: item.description,
                    dueDate: item.dueDate,
                    status: 'open',
                    priority: 'medium', // Default priority
                    assignedTo: user.id,
                },
                user,
            );
            createdTasks.push(task);
        }
        return createdTasks;
    }
}
