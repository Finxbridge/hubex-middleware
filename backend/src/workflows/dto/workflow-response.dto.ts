import { ApiProperty } from '@nestjs/swagger';

export class WorkflowResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'My API Workflow' })
  name: string;

  @ApiProperty({ example: 'A workflow that fetches data from multiple APIs', required: false })
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
  config: object;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty({ example: 'my-api-workflow', required: false })
  slug?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class WorkflowListResponseDto {
  @ApiProperty({ type: [WorkflowResponseDto] })
  workflows: WorkflowResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;
}
