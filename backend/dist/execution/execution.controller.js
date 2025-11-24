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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const execution_service_1 = require("./execution.service");
const execute_workflow_dto_1 = require("./dto/execute-workflow.dto");
const execution_response_dto_1 = require("./dto/execution-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ExecutionController = class ExecutionController {
    constructor(executionService) {
        this.executionService = executionService;
    }
    execute(workflowId, executeWorkflowDto, req) {
        return this.executionService.executeWorkflow(workflowId, executeWorkflowDto.input, req.user.userId);
    }
    executePublic(slug, executeWorkflowDto) {
        return this.executionService.executeWorkflow(slug, executeWorkflowDto.input);
    }
};
exports.ExecutionController = ExecutionController;
__decorate([
    (0, common_1.Post)(':workflowId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Execute a workflow',
        description: 'Execute a private workflow. Requires authentication and workflow ownership or access.'
    }),
    (0, swagger_1.ApiBody)({ type: execute_workflow_dto_1.ExecuteWorkflowDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow executed successfully',
        type: execution_response_dto_1.ExecutionResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not authorized to execute this workflow' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Workflow execution failed' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('workflowId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_workflow_dto_1.ExecuteWorkflowDto, Object]),
    __metadata("design:returntype", void 0)
], ExecutionController.prototype, "execute", null);
__decorate([
    (0, common_1.Post)('public/:slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Execute a published workflow (public endpoint)',
        description: 'Execute a published workflow using its slug. No authentication required. Use this for public API endpoints.'
    }),
    (0, swagger_1.ApiBody)({ type: execute_workflow_dto_1.ExecuteWorkflowDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow executed successfully',
        type: execution_response_dto_1.ExecutionResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found or not published' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Workflow execution failed' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_workflow_dto_1.ExecuteWorkflowDto]),
    __metadata("design:returntype", void 0)
], ExecutionController.prototype, "executePublic", null);
exports.ExecutionController = ExecutionController = __decorate([
    (0, swagger_1.ApiTags)('execution'),
    (0, common_1.Controller)('execution'),
    __metadata("design:paramtypes", [execution_service_1.ExecutionService])
], ExecutionController);
//# sourceMappingURL=execution.controller.js.map