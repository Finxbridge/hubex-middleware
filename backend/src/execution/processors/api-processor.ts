import { Injectable, Logger } from '@nestjs/common';
import { BaseProcessor } from './base-processor';
import { WorkflowNode } from '../../workflows/entities/workflow.entity';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { HttpClientService } from '../../common/services/http-client.service';

@Injectable()
export class ApiProcessor extends BaseProcessor {
  private readonly logger = new Logger(ApiProcessor.name);

  constructor(private httpClient: HttpClientService) {
    super();
  }

  async process(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { url, method, headers, body, authId } = node.data;

    if (!url || !method) {
      throw new Error('API node requires url and method');
    }

    // Resolve variables in URL, headers, and body
    const resolvedUrl = this.resolveVariables(url, context);
    const resolvedHeaders = this.resolveObjectVariables(headers || {}, context);
    const resolvedBody = this.resolveObjectVariables(body, context);

    this.logger.debug(`Executing API call: ${method} ${resolvedUrl}`);

    // Get auth config if specified
    let authType, authData;
    if (authId) {
      const authConfig = context.authConfigs.get(authId);
      if (authConfig) {
        authType = authConfig.type;
        authData = authConfig.data;
      } else {
        this.logger.warn(`Auth config ${authId} not found in context`);
      }
    }

    try {
      const response = await this.httpClient.request({
        url: resolvedUrl,
        method: method.toUpperCase(),
        headers: resolvedHeaders,
        data: resolvedBody,
        authType,
        authData,
      });

      this.logger.debug(`API call successful: ${response.status}`);

      // Store the response for use by subsequent nodes
      this.setVariable(context, `${node.id}.response`, response.data);
      this.setVariable(context, `${node.id}.status`, response.status);
      this.setVariable(context, `${node.id}.headers`, response.headers);

      return response.data;
    } catch (error) {
      this.logger.error(`API call failed: ${error.message}`);
      throw new Error(`API call failed: ${error.message}`);
    }
  }
}
