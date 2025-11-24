"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExecutionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
const common_1 = require("@nestjs/common");
const workflows_service_1 = require("../workflows/workflows.service");
const logs_service_1 = require("../logs/logs.service");
const execution_log_entity_1 = require("../logs/entities/execution-log.entity");
const auth_processor_1 = require("./processors/auth-processor");
const api_processor_1 = require("./processors/api-processor");
const transform_processor_1 = require("./processors/transform-processor");
const logic_processor_1 = require("./processors/logic-processor");
const output_processor_1 = require("./processors/output-processor");
let ExecutionService = ExecutionService_1 = class ExecutionService {
    constructor(workflowsService, logsService, authProcessor, apiProcessor, transformProcessor, logicProcessor, outputProcessor) {
        this.workflowsService = workflowsService;
        this.logsService = logsService;
        this.authProcessor = authProcessor;
        this.apiProcessor = apiProcessor;
        this.transformProcessor = transformProcessor;
        this.logicProcessor = logicProcessor;
        this.outputProcessor = outputProcessor;
        this.logger = new common_1.Logger(ExecutionService_1.name);
    }
    async executeWorkflow(workflowId, input, userId) {
        const startTime = Date.now();
        const nodeExecutions = [];
        try {
            this.logger.log(`Executing workflow: ${workflowId}`);
            const workflow = userId
                ? await this.workflowsService.findOne(workflowId, userId)
                : await this.workflowsService.findBySlug(workflowId);
            if (!workflow) {
                throw new common_1.NotFoundException(`Workflow ${workflowId} not found`);
            }
            const context = {
                workflow,
                variables: new Map(),
                authConfigs: new Map(),
                input,
            };
            if (input) {
                context.variables.set('input', input);
            }
            const executionOrder = this.buildExecutionOrder(workflow.config.nodes, workflow.config.edges);
            this.logger.debug(`Execution order: ${executionOrder.map(n => n.id).join(' -> ')}`);
            let finalOutput;
            for (const node of executionOrder) {
                const nodeResult = await this.executeNode(node, context);
                nodeExecutions.push(nodeResult);
                if (nodeResult.status === 'failed') {
                    throw new Error(`Node ${node.id} failed: ${nodeResult.error?.message}`);
                }
                if (node.type === 'output') {
                    finalOutput = nodeResult.output;
                }
            }
            const duration = Date.now() - startTime;
            await this.logsService.create({
                workflowId: workflow.id,
                status: execution_log_entity_1.ExecutionStatus.SUCCESS,
                input,
                output: finalOutput,
                nodeExecutions,
                duration,
            });
            this.logger.log(`Workflow ${workflowId} executed successfully in ${duration}ms`);
            return finalOutput;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Workflow execution failed: ${error.message}`);
            await this.logsService.create({
                workflowId,
                status: execution_log_entity_1.ExecutionStatus.FAILED,
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
    async executeNode(node, context) {
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
                status: execution_log_entity_1.ExecutionStatus.SUCCESS,
                output,
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            return {
                nodeId: node.id,
                nodeType: node.type,
                duration,
                status: execution_log_entity_1.ExecutionStatus.FAILED,
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            };
        }
    }
    buildExecutionOrder(nodes, edges) {
        const graph = new Map();
        const inDegree = new Map();
        nodes.forEach(node => {
            graph.set(node.id, []);
            inDegree.set(node.id, 0);
        });
        edges.forEach(edge => {
            graph.get(edge.source)?.push(edge.target);
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        });
        const queue = [];
        const result = [];
        inDegree.forEach((degree, nodeId) => {
            if (degree === 0) {
                queue.push(nodeId);
            }
        });
        while (queue.length > 0) {
            const nodeId = queue.shift();
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
        if (result.length !== nodes.length) {
            throw new Error('Workflow contains cycles');
        }
        return result.map(id => nodes.find(n => n.id === id));
    }
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = ExecutionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService,
        logs_service_1.LogsService,
        auth_processor_1.AuthProcessor,
        api_processor_1.ApiProcessor,
        transform_processor_1.TransformProcessor,
        logic_processor_1.LogicProcessor,
        output_processor_1.OutputProcessor])
], ExecutionService);
//# sourceMappingURL=execution.service.js.map