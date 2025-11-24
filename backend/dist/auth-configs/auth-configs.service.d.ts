import { Repository } from 'typeorm';
import { AuthConfig } from './entities/auth-config.entity';
import { CreateAuthConfigDto } from './dto/create-auth-config.dto';
import { UpdateAuthConfigDto } from './dto/update-auth-config.dto';
import { EncryptionService } from '../common/services/encryption.service';
export declare class AuthConfigsService {
    private authConfigsRepository;
    private encryptionService;
    constructor(authConfigsRepository: Repository<AuthConfig>, encryptionService: EncryptionService);
    create(createAuthConfigDto: CreateAuthConfigDto, userId: string): Promise<AuthConfig>;
    findAll(userId: string): Promise<AuthConfig[]>;
    findOne(id: string, userId: string): Promise<AuthConfig>;
    findOneForExecution(id: string): Promise<AuthConfig>;
    update(id: string, updateAuthConfigDto: UpdateAuthConfigDto, userId: string): Promise<AuthConfig>;
    remove(id: string, userId: string): Promise<void>;
    private decryptAuthConfig;
}
