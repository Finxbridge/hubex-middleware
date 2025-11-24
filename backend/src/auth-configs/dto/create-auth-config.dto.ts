import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject, MaxLength } from 'class-validator';
import { AuthType, AuthConfigData } from '../entities/auth-config.entity';

export class CreateAuthConfigDto {
  @ApiProperty({ example: 'OpenAI API Key' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ enum: AuthType, example: AuthType.API_KEY })
  @IsEnum(AuthType)
  type: AuthType;

  @ApiProperty({
    example: {
      keyName: 'Authorization',
      keyValue: 'Bearer sk-abc123...',
      placement: 'header'
    }
  })
  @IsObject()
  data: AuthConfigData;
}
