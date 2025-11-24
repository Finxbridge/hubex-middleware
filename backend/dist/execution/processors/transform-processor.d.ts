import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
export declare class TransformProcessor extends BaseProcessor {
    private readonly logger;
    process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
    private mapTransform;
    private mapObject;
    private getNestedValue;
    private filterTransform;
    private reduceTransform;
    private customTransform;
}
