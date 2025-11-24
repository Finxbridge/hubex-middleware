import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { WorkflowsModule } from '../workflows/workflows.module';
import { AuthConfigsModule } from '../auth-configs/auth-configs.module';
import { LogsModule } from '../logs/logs.module';
import { AuthProcessor } from './processors/auth-processor';
import { ApiProcessor } from './processors/api-processor';
import { TransformProcessor } from './processors/transform-processor';
import { LogicProcessor } from './processors/logic-processor';
import { OutputProcessor } from './processors/output-processor';

@Module({
  imports: [
    WorkflowsModule,
    AuthConfigsModule,
    LogsModule,
  ],
  controllers: [ExecutionController],
  providers: [
    ExecutionService,
    AuthProcessor,
    ApiProcessor,
    TransformProcessor,
    LogicProcessor,
    OutputProcessor,
  ],
  exports: [ExecutionService],
})
export class ExecutionModule {}
