import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { workflowService } from '@/services/workflowService';
import { useWorkflowStore } from '@/store/workflowStore';
import { Workflow } from '@/types/workflow';
import Button from '@/components/common/Button';
import { Plus, Play, Trash2, Edit } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { workflows, setWorkflows, deleteWorkflow } = useWorkflowStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (error: any) {
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await workflowService.delete(id);
      deleteWorkflow(id);
      toast.success('Workflow deleted');
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  const handleExecute = async (workflow: Workflow) => {
    try {
      const result = await workflowService.execute(workflow.id, {});
      toast.success('Workflow executed successfully');
      console.log('Result:', result);
    } catch (error: any) {
      toast.error('Workflow execution failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and execute your API workflows
          </p>
        </div>
        <Button
          onClick={() => navigate('/workflow/new')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workflows yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first workflow
          </p>
          <Button onClick={() => navigate('/workflow/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-header">
                <h3 className="card-title">{workflow.name}</h3>
                {workflow.description && (
                  <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
                )}
              </div>
              <div className="card-content">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>{workflow.config.nodes.length} nodes</span>
                  <span>•</span>
                  <span className={workflow.isPublished ? 'text-green-600' : 'text-gray-400'}>
                    {workflow.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/workflow/${workflow.id}`)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleExecute(workflow)}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(workflow.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
