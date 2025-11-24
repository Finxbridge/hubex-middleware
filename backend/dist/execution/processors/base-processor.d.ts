import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
export declare abstract class BaseProcessor {
    abstract process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
    protected getVariable(context: ExecutionContext, key: string): any;
    protected setVariable(context: ExecutionContext, key: string, value: any): void;
    protected resolveVariables(text: string, context: ExecutionContext): string;
    protected resolveObjectVariables(obj: any, context: ExecutionContext): any;
}
