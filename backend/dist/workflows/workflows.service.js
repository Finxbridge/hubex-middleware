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
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workflow_entity_1 = require("./entities/workflow.entity");
let WorkflowsService = class WorkflowsService {
    constructor(workflowsRepository) {
        this.workflowsRepository = workflowsRepository;
    }
    async create(createWorkflowDto, userId) {
        const workflow = this.workflowsRepository.create({
            ...createWorkflowDto,
            userId,
            slug: this.generateSlug(createWorkflowDto.name),
        });
        return this.workflowsRepository.save(workflow);
    }
    async findAll(userId) {
        return this.workflowsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const workflow = await this.workflowsRepository.findOne({
            where: { id },
        });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${id} not found`);
        }
        if (workflow.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this workflow');
        }
        return workflow;
    }
    async findBySlug(slug) {
        const workflow = await this.workflowsRepository.findOne({
            where: { slug, isPublished: true },
        });
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with slug ${slug} not found`);
        }
        return workflow;
    }
    async update(id, updateWorkflowDto, userId) {
        const workflow = await this.findOne(id, userId);
        if (updateWorkflowDto.name && updateWorkflowDto.name !== workflow.name) {
            workflow.slug = this.generateSlug(updateWorkflowDto.name);
        }
        Object.assign(workflow, updateWorkflowDto);
        return this.workflowsRepository.save(workflow);
    }
    async remove(id, userId) {
        const workflow = await this.findOne(id, userId);
        await this.workflowsRepository.remove(workflow);
    }
    async publish(id, userId) {
        const workflow = await this.findOne(id, userId);
        workflow.isPublished = true;
        return this.workflowsRepository.save(workflow);
    }
    async unpublish(id, userId) {
        const workflow = await this.findOne(id, userId);
        workflow.isPublished = false;
        return this.workflowsRepository.save(workflow);
    }
    generateSlug(name) {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `${slug}-${Date.now()}`;
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map