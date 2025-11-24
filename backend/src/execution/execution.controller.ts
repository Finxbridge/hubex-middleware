import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ExecutionService } from './execution.service';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';
import { ExecutionResponseDto } from './dto/execution-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('execution')
@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post(':workflowId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Execute a workflow',
    description: 'Execute a private workflow. Requires authentication and workflow ownership or access.'
  })
  @ApiBody({ type: ExecuteWorkflowDto })
  @ApiResponse({
    status: 200,
    description: 'Workflow executed successfully',
    type: ExecutionResponseDto
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not authorized to execute this workflow' })
  @ApiResponse({ status: 500, description: 'Workflow execution failed' })
  @HttpCode(HttpStatus.OK)
  execute(
    @Param('workflowId') workflowId: string,
    @Body() executeWorkflowDto: ExecuteWorkflowDto,
    @Request() req,
  ) {
    return this.executionService.executeWorkflow(
      workflowId,
      executeWorkflowDto.input,
      req.user.userId,
    );
  }

  @Post('public/:slug')
  @ApiOperation({
    summary: 'Execute a published workflow (public endpoint)',
    description: 'Execute a published workflow using its slug. No authentication required. Use this for public API endpoints.'
  })
  @ApiBody({ type: ExecuteWorkflowDto })
  @ApiResponse({
    status: 200,
    description: 'Workflow executed successfully',
    type: ExecutionResponseDto
  })
  @ApiResponse({ status: 404, description: 'Workflow not found or not published' })
  @ApiResponse({ status: 500, description: 'Workflow execution failed' })
  @HttpCode(HttpStatus.OK)
  executePublic(
    @Param('slug') slug: string,
    @Body() executeWorkflowDto: ExecuteWorkflowDto,
  ) {
    return this.executionService.executeWorkflow(
      slug,
      executeWorkflowDto.input,
    );
  }
}
