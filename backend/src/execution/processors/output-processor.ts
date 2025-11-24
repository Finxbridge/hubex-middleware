import { Injectable, Logger } from '@nestjs/common';
import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';

@Injectable()
export class OutputProcessor extends BaseProcessor {
  private readonly logger = new Logger(OutputProcessor.name);

  async process(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { format, sourceNodeId, template } = node.data;

    // Get the data to output
    let outputData = sourceNodeId
      ? this.getVariable(context, `${sourceNodeId}.response`)
      : this.getAllVariables(context);

    // Format the output
    let formattedOutput;

    switch (format) {
      case 'json':
        formattedOutput = this.formatJson(outputData);
        break;

      case 'text':
        formattedOutput = this.formatText(outputData, template);
        break;

      case 'xml':
        formattedOutput = this.formatXml(outputData);
        break;

      default:
        formattedOutput = outputData;
    }

    this.logger.debug(`Output formatted as ${format}`);

    return formattedOutput;
  }

  private formatJson(data: any): any {
    // Already in JSON format, just ensure it's serializable
    try {
      JSON.stringify(data);
      return data;
    } catch (error) {
      this.logger.error(`JSON serialization failed: ${error.message}`);
      return { error: 'Failed to serialize output' };
    }
  }

  private formatText(data: any, template?: string): string {
    if (template) {
      // Use template with variable substitution
      return template.replace(/\$\{([^}]+)\}/g, (match, path) => {
        const value = this.getNestedValue(data, path);
        return value !== undefined ? String(value) : match;
      });
    }

    // Simple string conversion
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }

    return String(data);
  }

  private formatXml(data: any): string {
    // Simple XML conversion
    // In production, use a proper XML library
    return this.objectToXml('root', data);
  }

  private objectToXml(tagName: string, obj: any): string {
    if (obj === null || obj === undefined) {
      return `<${tagName}/>`;
    }

    if (typeof obj !== 'object') {
      return `<${tagName}>${this.escapeXml(String(obj))}</${tagName}>`;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.objectToXml('item', item)).join('');
    }

    const children = Object.entries(obj)
      .map(([key, value]) => this.objectToXml(key, value))
      .join('');

    return `<${tagName}>${children}</${tagName}>`;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private getNestedValue(obj: any, path: string): any {
    if (!path) return obj;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private getAllVariables(context: ExecutionContext): any {
    const result: any = {};
    context.variables.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}
