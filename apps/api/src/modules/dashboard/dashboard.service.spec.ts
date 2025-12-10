import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { OPERATIONAL_DB } from '../../database/database.module';

describe('DashboardService', () => {
  let service: DashboardService;
  let mockDb: any;

  const mockInvoices = [
    {
      _id: 'inv-1',
      type: 'invoice',
      status: 'paid',
      totalGross: 10000,
      date: '2024-12-01',
      invoiceNumber: 'INV-2024-00001',
      customerId: 'cust-1',
      dueDate: '2024-12-15',
    },
    {
      _id: 'inv-2',
      type: 'invoice',
      status: 'overdue',
      totalGross: 5000,
      date: '2024-11-01',
      invoiceNumber: 'INV-2024-00002',
      customerId: 'cust-2',
      dueDate: '2024-11-15',
    },
    {
      _id: 'inv-3',
      type: 'invoice',
      status: 'sent',
      totalGross: 3000,
      date: '2024-12-05',
      invoiceNumber: 'INV-2024-00003',
      customerId: 'cust-1',
      dueDate: '2024-12-20',
    },
  ];

  const mockOpportunities = [
    {
      _id: 'opp-1',
      type: 'opportunity',
      title: 'Big Project',
      customerId: 'cust-1',
      stage: 'proposal',
      expectedValue: 50000,
      probability: 60,
    },
    {
      _id: 'opp-2',
      type: 'opportunity',
      title: 'Medium Project',
      customerId: 'cust-2',
      stage: 'qualified',
      expectedValue: 20000,
      probability: 40,
    },
    {
      _id: 'opp-3',
      type: 'opportunity',
      title: 'Small Project',
      customerId: 'cust-1',
      stage: 'lead',
      expectedValue: 10000,
      probability: 20,
    },
  ];

  const mockProjects = [
    {
      _id: 'proj-1',
      type: 'project',
      name: 'Active Project 1',
      status: 'active',
      endDate: '2025-01-15',
    },
    {
      _id: 'proj-2',
      type: 'project',
      name: 'Active Project 2',
      status: 'active',
      endDate: '2024-11-01', // past date = delayed
    },
    {
      _id: 'proj-3',
      type: 'project',
      name: 'Planning Project',
      status: 'planning',
    },
    {
      _id: 'proj-4',
      type: 'project',
      name: 'Completed Project',
      status: 'completed',
    },
  ];

  const mockTimeEntries = [
    {
      _id: 'te-1',
      type: 'time_entry',
      userId: 'user-1',
      userName: 'Max Mustermann',
      durationMinutes: 480,
      startTime: new Date().toISOString(),
    },
    {
      _id: 'te-2',
      type: 'time_entry',
      userId: 'user-1',
      userName: 'Max Mustermann',
      durationMinutes: 480,
      startTime: new Date().toISOString(),
    },
    {
      _id: 'te-3',
      type: 'time_entry',
      userId: 'user-2',
      userName: 'Anna Schmidt',
      durationMinutes: 240,
      startTime: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    mockDb = {
      find: jest.fn().mockImplementation(({ selector }) => {
        if (selector.type === 'invoice') {
          return Promise.resolve({ docs: mockInvoices });
        }
        if (selector.type === 'opportunity') {
          return Promise.resolve({ docs: mockOpportunities });
        }
        if (selector.type === 'project') {
          return Promise.resolve({ docs: mockProjects });
        }
        if (selector.type === 'time_entry') {
          return Promise.resolve({ docs: mockTimeEntries });
        }
        return Promise.resolve({ docs: [] });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: OPERATIONAL_DB,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGFMetrics', () => {
    it('should return complete GF metrics object', async () => {
      const result = await service.getGFMetrics();

      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('outstandingRevenue');
      expect(result).toHaveProperty('pipelineValue');
      expect(result).toHaveProperty('weightedPipeline');
      expect(result).toHaveProperty('activeProjectCount');
      expect(result).toHaveProperty('pipelineStages');
      expect(result).toHaveProperty('monthlyRevenue');
      expect(result).toHaveProperty('projectsByStatus');
      expect(result).toHaveProperty('topOpportunities');
      expect(result).toHaveProperty('overdueInvoices');
      expect(result).toHaveProperty('teamUtilization');
    });

    it('should calculate total revenue from paid invoices', async () => {
      const result = await service.getGFMetrics();
      expect(result.totalRevenue).toBe(10000); // Only inv-1 is paid
    });

    it('should calculate outstanding revenue from sent and overdue invoices', async () => {
      const result = await service.getGFMetrics();
      expect(result.outstandingRevenue).toBe(8000); // inv-2 (5000) + inv-3 (3000)
    });

    it('should calculate pipeline value from open opportunities', async () => {
      const result = await service.getGFMetrics();
      expect(result.pipelineValue).toBe(80000); // 50000 + 20000 + 10000
    });

    it('should calculate weighted pipeline with probability', async () => {
      const result = await service.getGFMetrics();
      // (50000 * 0.6) + (20000 * 0.4) + (10000 * 0.2) = 30000 + 8000 + 2000 = 40000
      expect(result.weightedPipeline).toBe(40000);
    });

    it('should count active projects correctly', async () => {
      const result = await service.getGFMetrics();
      expect(result.activeProjectCount).toBe(3); // active + planning
    });

    it('should return pipeline stages with counts and values', async () => {
      const result = await service.getGFMetrics();
      expect(result.pipelineStages).toBeInstanceOf(Array);
      expect(result.pipelineStages.length).toBeGreaterThan(0);

      const proposalStage = result.pipelineStages.find(
        (s) => s.stage === 'proposal',
      );
      expect(proposalStage).toBeDefined();
      expect(proposalStage?.value).toBe(50000);
      expect(proposalStage?.count).toBe(1);
    });

    it('should return top 5 opportunities sorted by value', async () => {
      const result = await service.getGFMetrics();
      expect(result.topOpportunities).toBeInstanceOf(Array);
      expect(result.topOpportunities.length).toBeLessThanOrEqual(5);

      if (result.topOpportunities.length >= 2) {
        expect(result.topOpportunities[0].expectedValue).toBeGreaterThanOrEqual(
          result.topOpportunities[1].expectedValue,
        );
      }
    });

    it('should return projects by status', async () => {
      const result = await service.getGFMetrics();
      expect(result.projectsByStatus).toBeInstanceOf(Array);

      const activeStatus = result.projectsByStatus.find(
        (s) => s.status === 'active',
      );
      expect(activeStatus).toBeDefined();
      expect(activeStatus?.count).toBe(2);
    });

    it('should return team utilization data', async () => {
      const result = await service.getGFMetrics();
      expect(result.teamUtilization).toBeInstanceOf(Array);
    });

    it('should return monthly revenue for last 12 months', async () => {
      const result = await service.getGFMetrics();
      expect(result.monthlyRevenue).toBeInstanceOf(Array);
      expect(result.monthlyRevenue.length).toBe(12);
    });
  });

  describe('edge cases', () => {
    it('should handle empty data gracefully', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      const result = await service.getGFMetrics();

      expect(result.totalRevenue).toBe(0);
      expect(result.outstandingRevenue).toBe(0);
      expect(result.pipelineValue).toBe(0);
      expect(result.activeProjectCount).toBe(0);
      expect(result.pipelineStages).toBeInstanceOf(Array);
      expect(result.topOpportunities).toEqual([]);
    });
  });
});
