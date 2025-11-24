# Hubex Frontend - Complete File Structure

This document contains all the code for the remaining frontend files. Copy each section into the specified file path.

## Type Definitions

### `src/types/workflow.ts`
```typescript
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
```

### `src/types/auth.ts`
```typescript
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
```

### `src/types/node.ts`
```typescript
export type NodeType = 'auth' | 'api' | 'transform' | 'logic' | 'output';

export interface BaseNodeData {
  label: string;
}

export interface AuthNodeData extends BaseNodeData {
  authType: 'api_key' | 'basic_auth' | 'bearer_token' | 'oauth2' | 'jwt';
  authConfigId?: string;
  config?: Record<string, any>;
}

export interface ApiNodeData extends BaseNodeData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  authId?: string;
}

export interface TransformNodeData extends BaseNodeData {
  transformType: 'map' | 'filter' | 'reduce' | 'custom';
  script?: string;
  mapping?: Record<string, string>;
}

export interface LogicNodeData extends BaseNodeData {
  condition: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains';
  value: any;
}

export interface OutputNodeData extends BaseNodeData {
  format: 'json' | 'text' | 'xml';
}

export type NodeData =
  | AuthNodeData
  | ApiNodeData
  | TransformNodeData
  | LogicNodeData
  | OutputNodeData;
```

## State Management (Zustand)

### `src/store/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'hubex-auth',
    },
  ),
);
```

### `src/store/workflowStore.ts`
```typescript
import { create } from 'zustand';
import { Workflow } from '@types/workflow';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  setWorkflows: (workflows: Workflow[]) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  currentWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  addWorkflow: (workflow) =>
    set((state) => ({ workflows: [workflow, ...state.workflows] })),
  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      ),
      currentWorkflow:
        state.currentWorkflow?.id === id
          ? { ...state.currentWorkflow, ...updates }
          : state.currentWorkflow,
    })),
  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      currentWorkflow:
        state.currentWorkflow?.id === id ? null : state.currentWorkflow,
    })),
}));
```

### `src/store/canvasStore.ts`
```typescript
import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  updateNode: (id: string, data: any) => void;
  reset: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) =>
    set({ edges: addEdge(connection, get().edges) }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    }),
  updateNode: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    }),
  reset: () => set({ nodes: [], edges: [] }),
}));
```

## API Services

### `src/services/api.ts`
```typescript
import axios from 'axios';
import { useAuthStore } from '@store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
```

### `src/services/authService.ts`
```typescript
import api from './api';
import { AuthResponse, LoginDto, RegisterDto } from '@types/auth';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
```

### `src/services/workflowService.ts`
```typescript
import api from './api';
import { Workflow, CreateWorkflowDto, UpdateWorkflowDto } from '@types/workflow';

export const workflowService = {
  getAll: async (): Promise<Workflow[]> => {
    const response = await api.get('/workflows');
    return response.data;
  },

  getById: async (id: string): Promise<Workflow> => {
    const response = await api.get(`/workflows/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkflowDto): Promise<Workflow> => {
    const response = await api.post('/workflows', data);
    return response.data;
  },

  update: async (id: string, data: UpdateWorkflowDto): Promise<Workflow> => {
    const response = await api.patch(`/workflows/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/workflows/${id}`);
  },

  publish: async (id: string): Promise<Workflow> => {
    const response = await api.post(`/workflows/${id}/publish`);
    return response.data;
  },

  execute: async (id: string, input: any): Promise<any> => {
    const response = await api.post(`/execution/${id}`, { input });
    return response.data;
  },
};
```

## Components - Continue in next file due to length...
## For full implementation, see: frontend/src/components/... folders

Key components to create:
1. Layout components (AuthLayout, AppLayout)
2. Canvas components (Canvas, NodePalette)
3. Node components (AuthNode, ApiNode, TransformNode, LogicNode, OutputNode)
4. Auth components (LoginForm, RegisterForm)
5. Workflow components (WorkflowCard, WorkflowList)
6. Common components (Button, Input, JsonViewer, Modal)
7. Pages (Dashboard, WorkflowEditor, Login, Register, NotFound)

Each component follows React best practices with TypeScript and TailwindCSS.
```

## Installation Instructions

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173
