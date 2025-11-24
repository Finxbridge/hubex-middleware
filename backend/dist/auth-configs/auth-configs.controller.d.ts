import { AuthConfigsService } from './auth-configs.service';
import { CreateAuthConfigDto } from './dto/create-auth-config.dto';
import { UpdateAuthConfigDto } from './dto/update-auth-config.dto';
export declare class AuthConfigsController {
    private readonly authConfigsService;
    constructor(authConfigsService: AuthConfigsService);
    create(createAuthConfigDto: CreateAuthConfigDto, req: any): Promise<import("./entities/auth-config.entity").AuthConfig>;
    findAll(req: any): Promise<import("./entities/auth-config.entity").AuthConfig[]>;
    findOne(id: string, req: any): Promise<import("./entities/auth-config.entity").AuthConfig>;
    update(id: string, updateAuthConfigDto: UpdateAuthConfigDto, req: any): Promise<import("./entities/auth-config.entity").AuthConfig>;
    remove(id: string, req: any): Promise<void>;
}
