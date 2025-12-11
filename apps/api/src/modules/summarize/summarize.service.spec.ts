import { Test, TestingModule } from '@nestjs/testing';
import { SummarizeService } from './summarize.service';
import { UserTaskService } from '../user-task/user-task.service';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
    return class MockOpenAI {
        chat = {
            completions: {
                create: jest.fn(),
            },
        };
    };
});

describe('SummarizeService', () => {
    let service: SummarizeService;
    let userTaskService: UserTaskService;
    let openai: any;

    const mockUserTaskService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SummarizeService,
                {
                    provide: UserTaskService,
                    useValue: mockUserTaskService,
                },
            ],
        }).compile();

        service = module.get<SummarizeService>(SummarizeService);
        userTaskService = module.get<UserTaskService>(UserTaskService);
        openai = (service as any).openai; // Access private property for specific mock invalidation if needed
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('summarizeText', () => {
        it('should return parsed summary and action items', async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                summary: 'Test Summary',
                                actionItems: [
                                    { title: 'Test Task', description: 'Desc', dueDate: '2025-01-01' },
                                ],
                                suggestedFollowUpDate: '2025-01-02',
                            }),
                        },
                    },
                ],
            };

            openai.chat.completions.create.mockResolvedValue(mockResponse);

            const result = await service.summarizeText('some transcribed text');

            expect(openai.chat.completions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    messages: expect.arrayContaining([
                        expect.objectContaining({ role: 'user', content: 'some transcribed text' }),
                    ]),
                }),
            );
            expect(result.summary).toBe('Test Summary');
            expect(result.actionItems).toHaveLength(1);
        });

        it('should handle markdown code blocks in response', async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            content: '```json\n{"summary": "Markdown Summary", "actionItems": []}\n```',
                        },
                    },
                ],
            };

            openai.chat.completions.create.mockResolvedValue(mockResponse);

            const result = await service.summarizeText('text');
            expect(result.summary).toBe('Markdown Summary');
        });
    });

    describe('createActionItems', () => {
        it('should create tasks for each action item', async () => {
            const items = [
                { title: 'Task 1', description: 'Desc 1', dueDate: '2025-01-01' },
                { title: 'Task 2', description: 'Desc 2' },
            ];
            const mockUser = { id: 'user1', email: 'test@example.com' } as any;

            mockUserTaskService.create.mockResolvedValue({ id: 'task_id' });

            await service.createActionItems({ items }, mockUser);

            expect(userTaskService.create).toHaveBeenCalledTimes(2);
            expect(userTaskService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Task 1',
                    assignedTo: 'user1',
                }),
                mockUser,
            );
        });
    });
});
