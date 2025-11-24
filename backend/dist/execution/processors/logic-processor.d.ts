import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
export declare class LogicProcessor extends BaseProcessor {
    private readonly logger;
    process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
    private evaluateCondition;
    private getNestedValue;
}
