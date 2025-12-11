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

  it('should call OSRM Trip API and parse response', async () => {
    const responseData = {
      code: 'Ok',
      trips: [
        {
          distance: 10000, // meters
          duration: 600, // seconds
        },
      ],
      waypoints: [
        { waypoint_index: 0, location: [10, 10] },
        { waypoint_index: 1, location: [20, 20] },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: responseData });

    const stops = [
      { lat: 10, lng: 10 },
      { lat: 20, lng: 20 },
    ];

    const result = await provider.calculateRoute(stops);

    expect(mockedAxios.get).toHaveBeenCalled();
    expect(result.totalDistanceKm).toBe(10); // 10000m / 1000
    expect(result.totalDurationMinutes).toBe(10); // 600s / 60

    // Check optimizedStops mappings
    expect(result.optimizedStops[0].index).toBe(0);
    expect(result.optimizedStops[1].index).toBe(1);
  });

  it('should handle OSRM error', async () => {
    mockedAxios.get.mockResolvedValue({ data: { code: 'NoRoute' } });
    const stops = [
      { lat: 10, lng: 10 },
      { lat: 20, lng: 20 },
    ];
    await expect(provider.calculateRoute(stops)).rejects.toThrow(
      'OSRM API Error: NoRoute',
    );
  });
});
