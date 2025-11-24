import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsBoolean, MaxLength } from 'class-validator';
import { WorkflowConfig } from '../entities/workflow.entity';

export class CreateWorkflowDto {
  @ApiProperty({ example: 'My API Workflow' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'A workflow that fetches data from multiple APIs', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: {
      nodes: [
        {
          id: '1',
          type: 'api',
          position: { x: 100, y: 100 },
          data: { label: 'Get Users', url: 'https://api.example.com/users', method: 'GET' }
        }
      ],
      edges: []
    }
  })
  @IsObject()
  config: WorkflowConfig;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
