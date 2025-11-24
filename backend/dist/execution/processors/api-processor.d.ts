import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { HttpClientService } from '../../common/services/http-client.service';
export declare class ApiProcessor extends BaseProcessor {
    private httpClient;
    private readonly logger;
    constructor(httpClient: HttpClientService);
    process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
}
