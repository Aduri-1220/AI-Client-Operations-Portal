import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ClientsModule } from '../clients/clients.module';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [ClientsModule, ProjectsModule, TasksModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
