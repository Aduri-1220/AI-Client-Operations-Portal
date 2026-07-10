import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientStatus } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { WorkflowsService } from '../workflows/workflows.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly repo: Repository<Client>,
    private readonly workflows: WorkflowsService,
  ) {}

  findAll(status?: string) {
    const where = status ? { status: status as ClientStatus } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const client = await this.repo.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return client;
  }

  async create(dto: CreateClientDto) {
    const client = this.repo.create(dto);
    const saved = await this.repo.save(client);

    // Emit AFTER the DB write succeeds — never before. Fire-and-forget:
    // the API response does not wait on n8n. Payload fields match the
    // templates in automation/n8n-workflows/client-onboarding.json
    // ({{ $json.name }}, {{ $json.contactPerson }}, {{ $json.email }}).
    this.workflows.emit('client-created', {
      id: saved.id,
      name: saved.name,
      contactPerson: saved.contactPerson,
      email: saved.email,
      status: saved.status,
      createdAt: saved.createdAt,
    });

    return saved;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
