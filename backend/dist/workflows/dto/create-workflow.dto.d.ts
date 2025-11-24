import { WorkflowConfig } from '../entities/workflow.entity';
export declare class CreateWorkflowDto {
    name: string;
    description?: string;
    config: WorkflowConfig;
    isActive?: boolean;
}
