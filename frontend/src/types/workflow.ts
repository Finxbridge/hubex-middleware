export interface WorkflowNode {
  id: string;
  type: 'auth' | 'api' | 'transform' | 'logic' | 'output';
  position: { x: number; y: number };
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

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  config: WorkflowConfig;
  isPublished: boolean;
  slug?: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  config: WorkflowConfig;
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  config?: WorkflowConfig;
  isActive?: boolean;
}
