import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class ExecuteWorkflowDto {
  @ApiProperty({
    example: { query: 'hello world', limit: 10 },
    required: false,
    description: 'Input data for the workflow'
  })
  @IsOptional()
  @IsObject()
  input?: Record<string, any>;
}
