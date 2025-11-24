import { Workflow } from '../../workflows/entities/workflow.entity';
import { AuthConfig } from '../../auth-configs/entities/auth-config.entity';
import { ExecutionStatus } from '../../logs/entities/execution-log.entity';

export interface ExecutionContext {
  workflow: Workflow;
  variables: Map<string, any>;
  authConfigs: Map<string, AuthConfig>;
  input?: Record<string, any>;
}

export interface NodeExecutionResult {
  nodeId: string;
  nodeType: string;
  duration: number;
  status: ExecutionStatus;
  input?: any;
  output?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}
