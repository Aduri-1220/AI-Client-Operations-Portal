import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  findAll(projectId?: string, status?: string, assigneeId?: string) {
    const where: Record<string, string> = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    return this.repo.find({ where, relations: { project: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const task = await this.repo.findOne({ where: { id }, relations: { project: true } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  getOverdue() {
    return this.repo.find({
      where: { dueDate: LessThan(new Date().toISOString().split('T')[0]) },
      order: { dueDate: 'ASC' },
    });
  }

  create(dto: CreateTaskDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: Task['status']) {
    await this.findOne(id);
    await this.repo.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
