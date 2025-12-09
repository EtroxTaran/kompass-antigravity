import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from './import.service';

describe('ImportService', () => {
  let service: ImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportService],
    }).compile();

    service = module.get<ImportService>(ImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('autoDetectMappings', () => {
    it('should map common German headers', () => {
      const headers = ['Firma', 'E-Mail', 'Telefon', 'Straße', 'PLZ', 'Stadt'];
      const mappings = service.autoDetectMappings(headers);

      expect(mappings['Firma']).toBe('companyName');
      expect(mappings['E-Mail']).toBe('email');
      expect(mappings['Telefon']).toBe('phone');
      expect(mappings['Straße']).toBe('billingAddress.street');
      expect(mappings['PLZ']).toBe('billingAddress.zipCode');
      expect(mappings['Stadt']).toBe('billingAddress.city');
    });

    it('should map English headers', () => {
      const headers = ['Company', 'Email', 'Phone'];
      const mappings = service.autoDetectMappings(headers);

      expect(mappings['Company']).toBe('companyName');
      expect(mappings['Email']).toBe('email');
      expect(mappings['Phone']).toBe('phone');
    });

    it('should handle unknown headers', () => {
      const headers = ['UnknownField', 'AnotherField'];
      const mappings = service.autoDetectMappings(headers);

      expect(mappings['UnknownField']).toBeUndefined();
      expect(mappings['AnotherField']).toBeUndefined();
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date format', () => {
      const result = service.parseDate('2024-12-09');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(11); // 0-indexed
      expect(result?.getDate()).toBe(9);
    });

    it('should parse German date format (DD.MM.YYYY)', () => {
      const result = service.parseDate('09.12.2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(11);
      expect(result?.getDate()).toBe(9);
    });

    it('should parse US date format (MM/DD/YYYY)', () => {
      const result = service.parseDate('12/09/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('should return null for invalid dates', () => {
      expect(service.parseDate('invalid')).toBeNull();
      expect(service.parseDate('')).toBeNull();
    });
  });

  describe('session management', () => {
    it('should create and retrieve a session', () => {
      const mockBuffer = Buffer.from('col1,col2\nval1,val2');
      const session = service.parseFile(mockBuffer, 'test.csv');

      expect(session).toBeDefined();
      expect(session.filename).toBe('test.csv');
      expect(session.importId).toBeDefined();

      const retrieved = service.getSession(session.importId);
      expect(retrieved).toEqual(session);
    });

    it('should cleanup session', () => {
      const mockBuffer = Buffer.from('col1,col2\nval1,val2');
      const session = service.parseFile(mockBuffer, 'test.csv');
      const importId = session.importId;

      service.cleanupSession(importId);

      const retrieved = service.getSession(importId);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('setMappings', () => {
    it('should set field mappings for a session', () => {
      const mockBuffer = Buffer.from('Firma,Email\nTest GmbH,test@test.de');
      const session = service.parseFile(mockBuffer, 'test.csv');

      const mappings = {
        Firma: 'companyName',
        Email: 'email',
      };

      const updatedSession = service.setMappings(session.importId, mappings);

      expect(updatedSession.mappings).toEqual(mappings);
      expect(updatedSession.status).toBe('mapped');
    });

    it('should throw for non-existent session', () => {
      expect(() => {
        service.setMappings('non-existent-id', {});
      }).toThrow();
    });
  });
});
