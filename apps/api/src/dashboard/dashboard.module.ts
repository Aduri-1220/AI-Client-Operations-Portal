import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/client.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Project, Task])],
  controllers: [DashboardController],
})
export class DashboardModule {}
