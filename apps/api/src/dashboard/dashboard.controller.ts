import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Client) private clients: Repository<Client>,
    @InjectRepository(Project) private projects: Repository<Project>,
    @InjectRepository(Task) private tasks: Repository<Task>,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    const [totalClients, activeProjects, overdueTasks] = await Promise.all([
      this.clients.count(),
      this.projects.count({ where: { status: 'IN_PROGRESS' } }),
      this.tasks.count({ where: { dueDate: LessThan(new Date().toISOString().split('T')[0]) } }),
    ]);
    return { totalClients, activeProjects, overdueTasks, pendingApprovals: 3, sprintVelocity: 42, openRisks: 2 };
  }

  @Get('tasks-by-status')
  @ApiOperation({ summary: 'Get task counts grouped by status' })
  async tasksByStatus() {
    const result = await this.tasks.createQueryBuilder('task').select('task.status', 'status').addSelect('COUNT(*)', 'count').groupBy('task.status').getRawMany();
    return Object.fromEntries(result.map(r => [r.status, parseInt(r.count)]));
  }
}
