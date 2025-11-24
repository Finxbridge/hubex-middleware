import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { workflowService } from '@/services/workflowService';
import { useWorkflowStore } from '@/store/workflowStore';
import Button from '@/components/common/Button';
import { ArrowLeft, Save, Play } from 'lucide-react';

export default function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadWorkflow(id);
    }
  }, [id]);

  const loadWorkflow = async (workflowId: string) => {
    setIsLoading(true);
    try {
      const workflow = await workflowService.getById(workflowId);
      setCurrentWorkflow(workflow);
    } catch (error) {
      toast.error('Failed to load workflow');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentWorkflow) return;

    setIsSaving(true);
    try {
      if (id === 'new') {
        await workflowService.create({
          name: currentWorkflow.name || 'Untitled Workflow',
          description: currentWorkflow.description,
          config: currentWorkflow.config,
        });
        toast.success('Workflow created');
      } else {
        await workflowService.update(currentWorkflow.id, {
          name: currentWorkflow.name,
          description: currentWorkflow.description,
          config: currentWorkflow.config,
        });
        toast.success('Workflow saved');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">
              {id === 'new' ? 'New Workflow' : currentWorkflow?.name || 'Workflow Editor'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast('Execute functionality coming soon')}
            >
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area - Placeholder */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Visual Canvas Coming Soon
          </h2>
          <p className="text-gray-600 mb-4">
            React Flow canvas integration is in progress
          </p>
          <p className="text-sm text-gray-500">
            For now, use the API to create and execute workflows
          </p>
        </div>
      </div>
    </div>
  );
}
