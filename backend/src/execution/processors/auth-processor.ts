import { Injectable } from '@nestjs/common';
import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { AuthConfigsService } from '../../auth-configs/auth-configs.service';

@Injectable()
export class AuthProcessor extends BaseProcessor {
  constructor(private authConfigsService: AuthConfigsService) {
    super();
  }

  async process(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { authConfigId } = node.data;

    if (!authConfigId) {
      throw new Error('Auth node requires authConfigId');
    }

    // Load auth config (already decrypted by service)
    const authConfig = await this.authConfigsService.findOneForExecution(
      authConfigId,
    );

    // Store in context for use by API nodes
    context.authConfigs.set(node.id, authConfig);

    // Also store by authConfigId for easy lookup
    context.authConfigs.set(authConfigId, authConfig);

    return {
      type: authConfig.type,
      configId: authConfig.id,
      name: authConfig.name,
    };
  }
}
