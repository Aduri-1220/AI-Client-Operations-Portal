import { Global, Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';

/**
 * @Global: WorkflowsService is cross-cutting infrastructure (like logging),
 * so making it global avoids importing WorkflowsModule into every feature
 * module. Interview note: use @Global sparingly — only for true
 * infrastructure concerns, never for domain modules.
 */
@Global()
@Module({
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
