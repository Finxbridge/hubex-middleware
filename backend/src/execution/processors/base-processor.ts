import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';

export abstract class BaseProcessor {
  /**
   * Process a workflow node
   * @param node - The workflow node to process
   * @param context - The execution context
   * @returns The processed result
   */
  abstract process(node: WorkflowNode, context: ExecutionContext): Promise<any>;

  /**
   * Get variable from context
   */
  protected getVariable(context: ExecutionContext, key: string): any {
    return context.variables.get(key);
  }

  /**
   * Set variable in context
   */
  protected setVariable(context: ExecutionContext, key: string, value: any): void {
    context.variables.set(key, value);
  }

  /**
   * Resolve variables in a string (e.g., "${node1.result}")
   */
  protected resolveVariables(text: string, context: ExecutionContext): string {
    if (typeof text !== 'string') return text;

    return text.replace(/\$\{([^}]+)\}/g, (match, varPath) => {
      const value = this.getVariable(context, varPath);
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Resolve variables in an object recursively
   */
  protected resolveObjectVariables(obj: any, context: ExecutionContext): any {
    if (typeof obj === 'string') {
      return this.resolveVariables(obj, context);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveObjectVariables(item, context));
    }

    if (obj !== null && typeof obj === 'object') {
      const resolved: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = this.resolveObjectVariables(value, context);
      }
      return resolved;
    }

    return obj;
  }
}
