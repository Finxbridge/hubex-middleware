import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WorkflowsService } from '../workflows/workflows.service';
import { LogsService } from '../logs/logs.service';
import { WorkflowNode, WorkflowEdge } from '../workflows/entities/workflow.entity';
import { ExecutionContext, NodeExecutionResult } from './interfaces/execution-context.interface';
import { ExecutionStatus } from '../logs/entities/execution-log.entity';
import { AuthProcessor } from './processors/auth-processor';
import { ApiProcessor } from './processors/api-processor';
import { TransformProcessor } from './processors/transform-processor';
import { LogicProcessor } from './processors/logic-processor';
import { OutputProcessor } from './processors/output-processor';

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor(
    private workflowsService: WorkflowsService,
    private logsService: LogsService,
    private authProcessor: AuthProcessor,
    private apiProcessor: ApiProcessor,
    private transformProcessor: TransformProcessor,
    private logicProcessor: LogicProcessor,
    private outputProcessor: OutputProcessor,
  ) {}

  /**
   * Execute a workflow by ID
   */
  async executeWorkflow(
    workflowId: string,
    input?: Record<string, any>,
    userId?: string,
  ): Promise<any> {
    const startTime = Date.now();
    const nodeExecutions: NodeExecutionResult[] = [];

    try {
      // Load workflow
      this.logger.log(`Executing workflow: ${workflowId}`);
      const workflow = userId
        ? await this.workflowsService.findOne(workflowId, userId)
        : await this.workflowsService.findBySlug(workflowId);

      if (!workflow) {
        throw new NotFoundException(`Workflow ${workflowId} not found`);
      }

      // Create execution context
      const context: ExecutionContext = {
        workflow,
        variables: new Map(),
        authConfigs: new Map(),
        input,
      };

      // Store input in context
      if (input) {
        context.variables.set('input', input);
      }

      // Build execution order
      const executionOrder = this.buildExecutionOrder(
        workflow.config.nodes,
        workflow.config.edges,
      );

      this.logger.debug(`Execution order: ${executionOrder.map(n => n.id).join(' -> ')}`);

      // Execute nodes in order
      let finalOutput;
      for (const node of executionOrder) {
        const nodeResult = await this.executeNode(node, context);
        nodeExecutions.push(nodeResult);

        if (nodeResult.status === 'failed') {
          throw new Error(`Node ${node.id} failed: ${nodeResult.error?.message}`);
        }

        // If this is an output node, capture its result as final output
        if (node.type === 'output') {
          finalOutput = nodeResult.output;
        }
      }

      const duration = Date.now() - startTime;

      // Log successful execution
      await this.logsService.create({
        workflowId: workflow.id,
        status: ExecutionStatus.SUCCESS,
        input,
        output: finalOutput,
        nodeExecutions,
        duration,
      });

      this.logger.log(`Workflow ${workflowId} executed successfully in ${duration}ms`);

      return finalOutput;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(`Workflow execution failed: ${error.message}`);

      // Log failed execution
      await this.logsService.create({
        workflowId,
        status: ExecutionStatus.FAILED,
        input,
        nodeExecutions,
        duration,
        error: {
          message: error.message,
          stack: error.stack,
        },
      });

      throw error;
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    node: WorkflowNode,
    context: ExecutionContext,
  ): Promise<NodeExecutionResult> {
    const startTime = Date.now();

    try {
      this.logger.debug(`Executing node: ${node.id} (${node.type})`);

      let output;

      switch (node.type) {
        case 'auth':
          output = await this.authProcessor.process(node, context);
          break;

        case 'api':
          output = await this.apiProcessor.process(node, context);
          break;

        case 'transform':
          output = await this.transformProcessor.process(node, context);
          break;

        case 'logic':
          output = await this.logicProcessor.process(node, context);
          break;

        case 'output':
          output = await this.outputProcessor.process(node, context);
          break;

        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }

      const duration = Date.now() - startTime;

      return {
        nodeId: node.id,
        nodeType: node.type,
        duration,
        status: ExecutionStatus.SUCCESS,
        output,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        nodeId: node.id,
        nodeType: node.type,
        duration,
        status: ExecutionStatus.FAILED,
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
    }
  }

  /**
   * Build execution order using topological sort
   */
  private buildExecutionOrder(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
  ): WorkflowNode[] {
    // Build adjacency list
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    // Build graph
    edges.forEach(edge => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Topological sort (Kahn's algorithm)
    const queue: string[] = [];
    const result: string[] = [];

    // Find nodes with no dependencies
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);

      const neighbors = graph.get(nodeId) || [];
      neighbors.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);

        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    // Check for cycles
    if (result.length !== nodes.length) {
      throw new Error('Workflow contains cycles');
    }

    // Return nodes in execution order
    return result.map(id => nodes.find(n => n.id === id)!);
  }
}
