import { AuthType, AuthConfigData } from '../entities/auth-config.entity';
export declare class CreateAuthConfigDto {
    name: string;
    type: AuthType;
    data: AuthConfigData;
}
