import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: getRepositoryToken(Client), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all clients', async () => {
      const clients = [{ id: '1', name: 'Acme' }];
      mockRepo.find.mockResolvedValue(clients);
      const result = await service.findAll();
      expect(result).toEqual(clients);
      expect(mockRepo.find).toHaveBeenCalledWith({ where: {}, order: { createdAt: 'DESC' } });
    });

    it('filters by status', async () => {
      mockRepo.find.mockResolvedValue([]);
      await service.findAll('ACTIVE');
      expect(mockRepo.find).toHaveBeenCalledWith({ where: { status: 'ACTIVE' }, order: { createdAt: 'DESC' } });
    });
  });

  describe('findOne', () => {
    it('returns client when found', async () => {
      const client = { id: '1', name: 'Acme' };
      mockRepo.findOne.mockResolvedValue(client);
      const result = await service.findOne('1');
      expect(result).toEqual(client);
    });

    it('throws NotFoundException when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates and returns a client', async () => {
      const dto = { name: 'New Corp', contactPerson: 'Jane', email: 'jane@new.com', phone: '555', company: 'New Corp', status: 'ACTIVE' as const };
      const created = { ...dto, id: '2' };
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);
      const result = await service.create(dto);
      expect(result).toEqual(created);
    });
  });
});
