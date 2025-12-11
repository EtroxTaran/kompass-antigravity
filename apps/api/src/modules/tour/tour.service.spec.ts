import { Test, TestingModule } from '@nestjs/testing';
import { TourService } from './tour.service';
import { TourRepository } from './tour.repository';
import { BadRequestException } from '@nestjs/common';
import { RoutingProvider } from './providers/routing-provider.interface';

describe('TourService', () => {
  let service: TourService;
  let repository: Partial<TourRepository>;
  let mockRoutingProvider: Partial<RoutingProvider>;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockRoutingProvider = {
      calculateRoute: jest.fn().mockResolvedValue({
        totalDistanceKm: 10,
        totalDurationMinutes: 60,
        optimizedStops: [
          { index: 0, lat: 0, lng: 0 },
          { index: 1, lat: 10, lng: 10 },
        ],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourService,
        { provide: TourRepository, useValue: repository },
        { provide: 'ROUTING_PROVIDER', useValue: mockRoutingProvider },
      ],
    }).compile();

    service = module.get<TourService>(TourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('optimizeRoute', () => {
    it('should throw error for empty stops', async () => {
      await expect(service.optimizeRoute({ stops: [] })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should delegate to routing provider', async () => {
      const stops = [
        { id: '1', name: 'A', lat: 0, lng: 0, address: '' },
        { id: '2', name: 'B', lat: 10, lng: 10, address: '' },
      ];
      const result = await service.optimizeRoute({ stops });

      expect(mockRoutingProvider.calculateRoute).toHaveBeenCalled();
      expect(result.totalDistanceKm).toBe(10);
      expect(result.stops[0].id).toBe('1');
      expect(result.stops[1].id).toBe('2');
    });

    it('should handle startLocation correctly', async () => {
      const stops = [{ id: '1', name: 'A', lat: 10, lng: 10, address: '' }];
      const startLocation = { lat: 0, lng: 0 };

      // Provider should receive [start, stop] -> index 0 and 1
      // We mock provider to swap them? Or just return as is.
      // If provider returns [index 0, index 1], index 0 is start.
      // Service should filter out index 0.

      (mockRoutingProvider.calculateRoute as jest.Mock).mockResolvedValue({
        totalDistanceKm: 5,
        totalDurationMinutes: 30,
        optimizedStops: [
          { index: 0, lat: 0, lng: 0 }, // Start
          { index: 1, lat: 10, lng: 10 }, // Stop
        ],
      });

      const result = await service.optimizeRoute({ stops, startLocation });

      // Should verify called with 2 points
      expect(mockRoutingProvider.calculateRoute).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ isStart: true }),
          expect.objectContaining({ originalDtoIndex: 0 }),
        ]),
      );

      // Result should ONLY contain the stop, not start
      expect(result.stops).toHaveLength(1);
      expect(result.stops[0].id).toBe('1');
    });
  });
});
