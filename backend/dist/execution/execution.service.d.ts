import { WorkflowsService } from '../workflows/workflows.service';
import { LogsService } from '../logs/logs.service';
import { AuthProcessor } from './processors/auth-processor';
import { ApiProcessor } from './processors/api-processor';
import { TransformProcessor } from './processors/transform-processor';
import { LogicProcessor } from './processors/logic-processor';
import { OutputProcessor } from './processors/output-processor';
export declare class ExecutionService {
    private workflowsService;
    private logsService;
    private authProcessor;
    private apiProcessor;
    private transformProcessor;
    private logicProcessor;
    private outputProcessor;
    private readonly logger;
    constructor(workflowsService: WorkflowsService, logsService: LogsService, authProcessor: AuthProcessor, apiProcessor: ApiProcessor, transformProcessor: TransformProcessor, logicProcessor: LogicProcessor, outputProcessor: OutputProcessor);
    executeWorkflow(workflowId: string, input?: Record<string, any>, userId?: string): Promise<any>;
    private executeNode;
    private buildExecutionOrder;
}
