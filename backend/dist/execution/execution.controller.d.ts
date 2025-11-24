import { ExecutionService } from './execution.service';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';
export declare class ExecutionController {
    private readonly executionService;
    constructor(executionService: ExecutionService);
    execute(workflowId: string, executeWorkflowDto: ExecuteWorkflowDto, req: any): Promise<any>;
    executePublic(slug: string, executeWorkflowDto: ExecuteWorkflowDto): Promise<any>;
}
