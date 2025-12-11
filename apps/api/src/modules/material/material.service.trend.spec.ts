import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from './material.service';
import { MaterialRepository } from './material.repository';
import { SearchService } from '../search/search.service';
import { Material, SupplierPrice } from '@kompass/shared';

describe('MaterialService - Trends', () => {
  let service: MaterialService;
  let repository: Partial<MaterialRepository>;
  let searchService: Partial<SearchService>;

  const mockMaterial: Material = {
    _id: 'mat1',
    itemNumber: '123',
    name: 'Test Material',
    description: 'Test',
    category: 'Test',
    unit: 'pc',
    purchasePrice: 100,
    currency: 'EUR',
    type: 'material',
    supplierPrices: [],
  };

  beforeEach(async () => {
    repository = {
      findById: jest.fn().mockResolvedValue(mockMaterial),
      update: jest
        .fn()
        .mockImplementation((id, data) =>
          Promise.resolve({ ...mockMaterial, ...data }),
        ),
    };
    searchService = {
      addDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        { provide: MaterialRepository, useValue: repository },
        { provide: SearchService, useValue: searchService },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
  });

  it('should calculate UP trend when price increases > 2%', async () => {
    // Setup existing price
    const existingPrice: SupplierPrice = {
      supplierId: 'sup1',
      supplierName: 'Sup 1',
      unitPrice: 100,
      currency: 'EUR',
      minimumOrderQuantity: 1,
      leadTimeDays: 1,
      isPreferred: true,
      lastUpdated: new Date().toISOString(),
      priceHistory: [],
    };
    mockMaterial.supplierPrices = [existingPrice];
    (repository.findById as jest.Mock).mockResolvedValue(mockMaterial);

    const result = await service.addSupplierPrice(
      'mat1',
      {
        supplierId: 'sup1',
        supplierName: 'Sup 1',
        unitPrice: 110, // 10% increase
        isPreferred: true,
      },
      { id: 'u1' },
    );

    expect(result.supplierPrices![0].priceTrend).toBe('up');
    expect(result.priceTrend).toBe('up');
    expect(result.supplierPrices![0].priceHistory).toHaveLength(1);
    expect(result.supplierPrices![0].priceHistory![0].price).toBe(100);
  });

  it('should calculate DOWN trend when price decreases > 2%', async () => {
    // Setup existing price
    const existingPrice: SupplierPrice = {
      supplierId: 'sup1',
      supplierName: 'Sup 1',
      unitPrice: 100,
      currency: 'EUR',
      minimumOrderQuantity: 1,
      leadTimeDays: 1,
      isPreferred: true,
      lastUpdated: new Date().toISOString(),
      priceHistory: [],
    };
    mockMaterial.supplierPrices = [existingPrice];
    (repository.findById as jest.Mock).mockResolvedValue(mockMaterial);

    const result = await service.addSupplierPrice(
      'mat1',
      {
        supplierId: 'sup1',
        supplierName: 'Sup 1',
        unitPrice: 90, // 10% decrease
        isPreferred: true,
      },
      { id: 'u1' },
    );

    expect(result.supplierPrices![0].priceTrend).toBe('down');
    expect(result.priceTrend).toBe('down');
  });

  it('should calculate STABLE trend when price changes < 2%', async () => {
    // Setup existing price
    const existingPrice: SupplierPrice = {
      supplierId: 'sup1',
      supplierName: 'Sup 1',
      unitPrice: 100,
      currency: 'EUR',
      minimumOrderQuantity: 1,
      leadTimeDays: 1,
      isPreferred: true,
      lastUpdated: new Date().toISOString(),
      priceHistory: [],
    };
    mockMaterial.supplierPrices = [existingPrice];
    (repository.findById as jest.Mock).mockResolvedValue(mockMaterial);

    const result = await service.addSupplierPrice(
      'mat1',
      {
        supplierId: 'sup1',
        supplierName: 'Sup 1',
        unitPrice: 101, // 1% increase
        isPreferred: true,
      },
      { id: 'u1' },
    );

    expect(result.supplierPrices![0].priceTrend).toBe('stable');
    expect(result.priceTrend).toBe('stable');
  });
});
