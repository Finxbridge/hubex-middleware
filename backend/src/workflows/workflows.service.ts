import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private workflowsRepository: Repository<Workflow>,
  ) {}

  async create(
    createWorkflowDto: CreateWorkflowDto,
    userId: string,
  ): Promise<Workflow> {
    const workflow = this.workflowsRepository.create({
      ...createWorkflowDto,
      userId,
      slug: this.generateSlug(createWorkflowDto.name),
    });

    return this.workflowsRepository.save(workflow);
  }

  async findAll(userId: string): Promise<Workflow[]> {
    return this.workflowsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    if (workflow.userId !== userId) {
      throw new ForbiddenException('You do not have access to this workflow');
    }

    return workflow;
  }

  async findBySlug(slug: string): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({
      where: { slug, isPublished: true },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with slug ${slug} not found`);
    }

    return workflow;
  }

  async update(
    id: string,
    updateWorkflowDto: UpdateWorkflowDto,
    userId: string,
  ): Promise<Workflow> {
    const workflow = await this.findOne(id, userId);

    if (updateWorkflowDto.name && updateWorkflowDto.name !== workflow.name) {
      workflow.slug = this.generateSlug(updateWorkflowDto.name);
    }

    Object.assign(workflow, updateWorkflowDto);
    return this.workflowsRepository.save(workflow);
  }

  async remove(id: string, userId: string): Promise<void> {
    const workflow = await this.findOne(id, userId);
    await this.workflowsRepository.remove(workflow);
  }

  async publish(id: string, userId: string): Promise<Workflow> {
    const workflow = await this.findOne(id, userId);
    workflow.isPublished = true;
    return this.workflowsRepository.save(workflow);
  }

  async unpublish(id: string, userId: string): Promise<Workflow> {
    const workflow = await this.findOne(id, userId);
    workflow.isPublished = false;
    return this.workflowsRepository.save(workflow);
  }

  private generateSlug(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${slug}-${Date.now()}`;
  }
}
