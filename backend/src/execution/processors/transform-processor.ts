import { Injectable, Logger } from '@nestjs/common';
import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';

@Injectable()
export class TransformProcessor extends BaseProcessor {
  private readonly logger = new Logger(TransformProcessor.name);

  async process(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { transformType, mapping, script, sourceNodeId } = node.data;

    // Get source data
    let sourceData = sourceNodeId
      ? this.getVariable(context, `${sourceNodeId}.response`)
      : this.getVariable(context, 'input');

    if (!sourceData) {
      this.logger.warn('No source data available for transformation');
      return null;
    }

    let result;

    switch (transformType) {
      case 'map':
        result = this.mapTransform(sourceData, mapping);
        break;

      case 'filter':
        result = this.filterTransform(sourceData, script);
        break;

      case 'reduce':
        result = this.reduceTransform(sourceData, script);
        break;

      case 'custom':
        result = this.customTransform(sourceData, script);
        break;

      default:
        throw new Error(`Unknown transform type: ${transformType}`);
    }

    // Store result
    this.setVariable(context, `${node.id}.result`, result);

    return result;
  }

  /**
   * Map transformation - extract/rename fields
   */
  private mapTransform(data: any, mapping: Record<string, string>): any {
    if (!mapping) return data;

    if (Array.isArray(data)) {
      return data.map(item => this.mapObject(item, mapping));
    }

    return this.mapObject(data, mapping);
  }

  private mapObject(obj: any, mapping: Record<string, string>): any {
    const result: any = {};

    for (const [newKey, oldKey] of Object.entries(mapping)) {
      const value = this.getNestedValue(obj, oldKey);
      if (value !== undefined) {
        result[newKey] = value;
      }
    }

    return result;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Filter transformation - filter arrays
   */
  private filterTransform(data: any, filterExpression: string): any {
    if (!Array.isArray(data)) {
      throw new Error('Filter transform requires array input');
    }

    // Simple filter implementation
    // In production, use a safer evaluation method
    try {
      const filterFn = new Function('item', `return ${filterExpression}`) as (item: any) => boolean;
      return data.filter(filterFn);
    } catch (error) {
      this.logger.error(`Filter evaluation failed: ${error.message}`);
      return data;
    }
  }

  /**
   * Reduce transformation - aggregate data
   */
  private reduceTransform(data: any, reduceExpression: string): any {
    if (!Array.isArray(data)) {
      throw new Error('Reduce transform requires array input');
    }

    // Simple reduce - could be extended
    return {
      count: data.length,
      items: data,
    };
  }

  /**
   * Custom transformation - execute custom JavaScript
   */
  private customTransform(data: any, script: string): any {
    if (!script) return data;

    // WARNING: In production, use a sandbox like vm2 or isolated-vm
    try {
      const transformFn = new Function('data', script);
      return transformFn(data);
    } catch (error) {
      this.logger.error(`Custom transform failed: ${error.message}`);
      throw new Error(`Transform execution failed: ${error.message}`);
    }
  }
}
