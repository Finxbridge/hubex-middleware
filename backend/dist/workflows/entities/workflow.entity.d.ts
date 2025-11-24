import { User } from '../../users/entities/user.entity';
import { ExecutionLog } from '../../logs/entities/execution-log.entity';
export interface WorkflowNode {
    id: string;
    type: 'auth' | 'api' | 'transform' | 'logic' | 'output';
    position: {
        x: number;
        y: number;
    };
    data: Record<string, any>;
}
export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}
export interface WorkflowConfig {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    viewport?: {
        x: number;
        y: number;
        zoom: number;
    };
}
export declare class Workflow {
    id: string;
    name: string;
    description: string;
    config: WorkflowConfig;
    isPublished: boolean;
    slug: string;
    isActive: boolean;
    user: User;
    userId: string;
    logs: ExecutionLog[];
    createdAt: Date;
    updatedAt: Date;
}
