import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { WorkflowResponseDto } from './dto/workflow-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new workflow',
    description: 'Create a new workflow with node-based configuration for API integrations.'
  })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiResponse({
    status: 201,
    description: 'Workflow created successfully',
    type: WorkflowResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWorkflowDto: CreateWorkflowDto, @Request() req) {
    return this.workflowsService.create(createWorkflowDto, req.user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workflows for current user',
    description: 'Retrieve all workflows belonging to the authenticated user.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of workflows',
    type: [WorkflowResponseDto]
  })
  findAll(@Request() req) {
    return this.workflowsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workflow by ID',
    description: 'Retrieve a specific workflow by its ID. User must own the workflow.'
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow details',
    type: WorkflowResponseDto
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not the workflow owner' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.workflowsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update workflow',
    description: 'Update an existing workflow configuration. Only the owner can update.'
  })
  @ApiBody({ type: UpdateWorkflowDto })
  @ApiResponse({
    status: 200,
    description: 'Workflow updated successfully',
    type: WorkflowResponseDto
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not the workflow owner' })
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
    @Request() req,
  ) {
    return this.workflowsService.update(id, updateWorkflowDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete workflow',
    description: 'Permanently delete a workflow. Only the owner can delete.'
  })
  @ApiResponse({ status: 204, description: 'Workflow deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not the workflow owner' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.workflowsService.remove(id, req.user.userId);
  }

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish workflow',
    description: 'Make the workflow publicly accessible via a slug URL. Anyone can execute published workflows.'
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow published successfully',
    type: WorkflowResponseDto
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  publish(@Param('id') id: string, @Request() req) {
    return this.workflowsService.publish(id, req.user.userId);
  }

  @Post(':id/unpublish')
  @ApiOperation({
    summary: 'Unpublish workflow',
    description: 'Remove public access to the workflow. Only authenticated owner can execute.'
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow unpublished successfully',
    type: WorkflowResponseDto
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  unpublish(@Param('id') id: string, @Request() req) {
    return this.workflowsService.unpublish(id, req.user.userId);
  }
}
