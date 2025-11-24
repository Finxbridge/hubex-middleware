import { ApiProperty } from '@nestjs/swagger';

export class ExecutionResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  executionId: string;

  @ApiProperty({ example: 'success', enum: ['success', 'error', 'running'] })
  status: string;

  @ApiProperty({
    example: {
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ]
    }
  })
  output: any;

  @ApiProperty({ example: 1250, description: 'Execution time in milliseconds' })
  executionTime: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  startedAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:01Z' })
  completedAt: Date;

  @ApiProperty({ example: null, required: false })
  error?: string;
}
