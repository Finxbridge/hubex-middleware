import { PartialType } from '@nestjs/swagger';
import { CreateAuthConfigDto } from './create-auth-config.dto';

export class UpdateAuthConfigDto extends PartialType(CreateAuthConfigDto) {}
