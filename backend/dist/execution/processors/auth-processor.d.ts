import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { AuthConfigsService } from '../../auth-configs/auth-configs.service';
export declare class AuthProcessor extends BaseProcessor {
    private authConfigsService;
    constructor(authConfigsService: AuthConfigsService);
    process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
}
