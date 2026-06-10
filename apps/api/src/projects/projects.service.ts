import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly repo: Repository<Project>) {}

  findAll(clientId?: string, status?: string) {
    const where: Record<string, string> = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    return this.repo.find({ where, relations: { client: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const project = await this.repo.findOne({ where: { id }, relations: { client: true } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  create(dto: CreateProjectDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
