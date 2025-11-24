import { Injectable, Logger } from '@nestjs/common';
import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';

@Injectable()
export class LogicProcessor extends BaseProcessor {
  private readonly logger = new Logger(LogicProcessor.name);

  async process(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { condition, operator, value, sourceNodeId } = node.data;

    // Get the value to evaluate
    let evalValue = sourceNodeId
      ? this.getVariable(context, `${sourceNodeId}.response`)
      : this.getVariable(context, 'input');

    // If condition is a path, resolve it
    if (condition && typeof condition === 'string') {
      evalValue = this.getNestedValue(evalValue, condition);
    }

    // Resolve the comparison value
    const resolvedValue = this.resolveVariables(value, context);

    // Evaluate the condition
    const result = this.evaluateCondition(evalValue, operator, resolvedValue);

    this.logger.debug(
      `Logic evaluation: ${evalValue} ${operator} ${resolvedValue} = ${result}`,
    );

    // Store result
    this.setVariable(context, `${node.id}.result`, result);

    return {
      conditionMet: result,
      evaluatedValue: evalValue,
      operator,
      comparisonValue: resolvedValue,
    };
  }

  private evaluateCondition(
    left: any,
    operator: string,
    right: any,
  ): boolean {
    switch (operator) {
      case '==':
      case 'equals':
        return left == right;

      case '!=':
      case 'not_equals':
        return left != right;

      case '>':
      case 'greater_than':
        return left > right;

      case '<':
      case 'less_than':
        return left < right;

      case '>=':
      case 'greater_than_or_equal':
        return left >= right;

      case '<=':
      case 'less_than_or_equal':
        return left <= right;

      case 'contains':
        if (typeof left === 'string' && typeof right === 'string') {
          return left.includes(right);
        }
        if (Array.isArray(left)) {
          return left.includes(right);
        }
        return false;

      case 'not_contains':
        if (typeof left === 'string' && typeof right === 'string') {
          return !left.includes(right);
        }
        if (Array.isArray(left)) {
          return !left.includes(right);
        }
        return true;

      case 'starts_with':
        if (typeof left === 'string' && typeof right === 'string') {
          return left.startsWith(right);
        }
        return false;

      case 'ends_with':
        if (typeof left === 'string' && typeof right === 'string') {
          return left.endsWith(right);
        }
        return false;

      case 'is_empty':
        return !left || left.length === 0;

      case 'is_not_empty':
        return !!left && left.length > 0;

      default:
        this.logger.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    if (!path) return obj;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
