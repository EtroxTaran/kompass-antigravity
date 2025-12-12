import { Test, TestingModule } from '@nestjs/testing';
import { OSRMProvider } from './osrm.provider';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OSRMProvider', () => {
  let provider: OSRMProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OSRMProvider],
    }).compile();

    provider = module.get<OSRMProvider>(OSRMProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('calculateRoute', () => {
    it('should return empty result for 0 or 1 stop', async () => {
      const stops = [{ lat: 0, lng: 0 }];
      const result = await provider.calculateRoute(stops);
      expect(result.totalDistanceKm).toBe(0);
      expect(result.optimizedStops).toHaveLength(1);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should call OSRM API and parse response correctly', async () => {
      const stops = [
        { lat: 10, lng: 10 }, // Index 0
        { lat: 11, lng: 11 }, // Index 1
        { lat: 12, lng: 12 }, // Index 2
      ];

      // Mock response where order is 0 -> 2 -> 1
      const mockResponse = {
        data: {
          code: 'Ok',
          trips: [
            {
              distance: 5000, // meters
              duration: 300, // seconds
              legs: [],
            },
          ],
          waypoints: [
            { waypoint_index: 0, location: [10, 10] },
            { waypoint_index: 2, location: [12, 12] },
            { waypoint_index: 1, location: [11, 11] },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await provider.calculateRoute(stops);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      // Check that URL contains coordinates
      const expectedUrlPart = '10,10;11,11;12,12';
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(expectedUrlPart),
      );

      // Verify mapping
      expect(result.totalDistanceKm).toBe(5); // 5000m / 1000
      expect(result.totalDurationMinutes).toBe(5); // 300s / 60
      expect(result.optimizedStops).toHaveLength(3);

      // Check order
      expect(result.optimizedStops[0].index).toBe(0);
      expect(result.optimizedStops[1].index).toBe(2);
      expect(result.optimizedStops[2].index).toBe(1);
    });

    it('should handle OSRM API errors', async () => {
      const stops = [
        { lat: 10, lng: 10 },
        { lat: 11, lng: 11 },
      ];
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(provider.calculateRoute(stops)).rejects.toThrow(
        'Network Error',
      );
    });

    it('should throw if OSRM returns non-Ok code', async () => {
      const stops = [
        { lat: 10, lng: 10 },
        { lat: 11, lng: 11 },
      ];
      mockedAxios.get.mockResolvedValue({
        data: { code: 'NoRoute' },
      });

      await expect(provider.calculateRoute(stops)).rejects.toThrow(
        'OSRM API Error: NoRoute',
      );
    });
  });
});
