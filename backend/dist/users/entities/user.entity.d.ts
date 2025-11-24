import { Workflow } from '../../workflows/entities/workflow.entity';
import { AuthConfig } from '../../auth-configs/entities/auth-config.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    workflows: Workflow[];
    authConfigs: AuthConfig[];
}
