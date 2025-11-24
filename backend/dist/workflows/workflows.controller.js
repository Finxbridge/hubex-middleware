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
exports.WorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflows_service_1 = require("./workflows.service");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
const update_workflow_dto_1 = require("./dto/update-workflow.dto");
const workflow_response_dto_1 = require("./dto/workflow-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WorkflowsController = class WorkflowsController {
    constructor(workflowsService) {
        this.workflowsService = workflowsService;
    }
    create(createWorkflowDto, req) {
        return this.workflowsService.create(createWorkflowDto, req.user.userId);
    }
    findAll(req) {
        return this.workflowsService.findAll(req.user.userId);
    }
    findOne(id, req) {
        return this.workflowsService.findOne(id, req.user.userId);
    }
    update(id, updateWorkflowDto, req) {
        return this.workflowsService.update(id, updateWorkflowDto, req.user.userId);
    }
    remove(id, req) {
        return this.workflowsService.remove(id, req.user.userId);
    }
    publish(id, req) {
        return this.workflowsService.publish(id, req.user.userId);
    }
    unpublish(id, req) {
        return this.workflowsService.unpublish(id, req.user.userId);
    }
};
exports.WorkflowsController = WorkflowsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new workflow',
        description: 'Create a new workflow with node-based configuration for API integrations.'
    }),
    (0, swagger_1.ApiBody)({ type: create_workflow_dto_1.CreateWorkflowDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Workflow created successfully',
        type: workflow_response_dto_1.WorkflowResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.CreateWorkflowDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all workflows for current user',
        description: 'Retrieve all workflows belonging to the authenticated user.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of workflows',
        type: [workflow_response_dto_1.WorkflowResponseDto]
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get workflow by ID',
        description: 'Retrieve a specific workflow by its ID. User must own the workflow.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow details',
        type: workflow_response_dto_1.WorkflowResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not the workflow owner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update workflow',
        description: 'Update an existing workflow configuration. Only the owner can update.'
    }),
    (0, swagger_1.ApiBody)({ type: update_workflow_dto_1.UpdateWorkflowDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow updated successfully',
        type: workflow_response_dto_1.WorkflowResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not the workflow owner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_workflow_dto_1.UpdateWorkflowDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete workflow',
        description: 'Permanently delete a workflow. Only the owner can delete.'
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Workflow deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not the workflow owner' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, swagger_1.ApiOperation)({
        summary: 'Publish workflow',
        description: 'Make the workflow publicly accessible via a slug URL. Anyone can execute published workflows.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow published successfully',
        type: workflow_response_dto_1.WorkflowResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/unpublish'),
    (0, swagger_1.ApiOperation)({
        summary: 'Unpublish workflow',
        description: 'Remove public access to the workflow. Only authenticated owner can execute.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow unpublished successfully',
        type: workflow_response_dto_1.WorkflowResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "unpublish", null);
exports.WorkflowsController = WorkflowsController = __decorate([
    (0, swagger_1.ApiTags)('workflows'),
    (0, common_1.Controller)('workflows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService])
], WorkflowsController);
//# sourceMappingURL=workflows.controller.js.map