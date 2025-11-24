import api from './api';
import { Workflow, CreateWorkflowDto, UpdateWorkflowDto } from '@/types/workflow';

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

  unpublish: async (id: string): Promise<Workflow> => {
    const response = await api.post(`/workflows/${id}/unpublish`);
    return response.data;
  },

  execute: async (id: string, input: any): Promise<any> => {
    const response = await api.post(`/execution/${id}`, { input });
    return response.data;
  },
};
