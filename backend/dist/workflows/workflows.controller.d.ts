import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowsController {
    private readonly workflowsService;
    constructor(workflowsService: WorkflowsService);
    create(createWorkflowDto: CreateWorkflowDto, req: any): Promise<import("./entities/workflow.entity").Workflow>;
    findAll(req: any): Promise<import("./entities/workflow.entity").Workflow[]>;
    findOne(id: string, req: any): Promise<import("./entities/workflow.entity").Workflow>;
    update(id: string, updateWorkflowDto: UpdateWorkflowDto, req: any): Promise<import("./entities/workflow.entity").Workflow>;
    remove(id: string, req: any): Promise<void>;
    publish(id: string, req: any): Promise<import("./entities/workflow.entity").Workflow>;
    unpublish(id: string, req: any): Promise<import("./entities/workflow.entity").Workflow>;
}
