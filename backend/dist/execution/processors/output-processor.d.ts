import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
export declare class OutputProcessor extends BaseProcessor {
    private readonly logger;
    process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
    private formatJson;
    private formatText;
    private formatXml;
    private objectToXml;
    private escapeXml;
    private getNestedValue;
    private getAllVariables;
}
