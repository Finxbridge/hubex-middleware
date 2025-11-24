import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowsService {
    private workflowsRepository;
    constructor(workflowsRepository: Repository<Workflow>);
    create(createWorkflowDto: CreateWorkflowDto, userId: string): Promise<Workflow>;
    findAll(userId: string): Promise<Workflow[]>;
    findOne(id: string, userId: string): Promise<Workflow>;
    findBySlug(slug: string): Promise<Workflow>;
    update(id: string, updateWorkflowDto: UpdateWorkflowDto, userId: string): Promise<Workflow>;
    remove(id: string, userId: string): Promise<void>;
    publish(id: string, userId: string): Promise<Workflow>;
    unpublish(id: string, userId: string): Promise<Workflow>;
    private generateSlug;
}
