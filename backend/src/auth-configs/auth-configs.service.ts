import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthConfig, AuthConfigData } from './entities/auth-config.entity';
import { CreateAuthConfigDto } from './dto/create-auth-config.dto';
import { UpdateAuthConfigDto } from './dto/update-auth-config.dto';
import { EncryptionService } from '../common/services/encryption.service';

@Injectable()
export class AuthConfigsService {
  constructor(
    @InjectRepository(AuthConfig)
    private authConfigsRepository: Repository<AuthConfig>,
    private encryptionService: EncryptionService,
  ) {}

  /**
   * Create a new auth configuration with encryption
   */
  async create(
    createAuthConfigDto: CreateAuthConfigDto,
    userId: string,
  ): Promise<AuthConfig> {
    // Encrypt the sensitive auth data
    const encryptedData = this.encryptionService.encryptObject(
      createAuthConfigDto.data,
    );

    const authConfig = this.authConfigsRepository.create({
      name: createAuthConfigDto.name,
      type: createAuthConfigDto.type,
      data: encryptedData as any, // Store as encrypted string
      encrypted: true,
      userId,
    });

    return this.authConfigsRepository.save(authConfig);
  }

  /**
   * Find all auth configs for a user (with decrypted data)
   */
  async findAll(userId: string): Promise<AuthConfig[]> {
    const configs = await this.authConfigsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Decrypt data for each config
    return configs.map((config) => this.decryptAuthConfig(config));
  }

  /**
   * Find one auth config by ID (with decrypted data)
   */
  async findOne(id: string, userId: string): Promise<AuthConfig> {
    const config = await this.authConfigsRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`Auth config with ID ${id} not found`);
    }

    if (config.userId !== userId) {
      throw new ForbiddenException('You do not have access to this auth config');
    }

    return this.decryptAuthConfig(config);
  }

  /**
   * Find one auth config without user check (for execution engine)
   */
  async findOneForExecution(id: string): Promise<AuthConfig> {
    const config = await this.authConfigsRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`Auth config with ID ${id} not found`);
    }

    return this.decryptAuthConfig(config);
  }

  /**
   * Update auth config
   */
  async update(
    id: string,
    updateAuthConfigDto: UpdateAuthConfigDto,
    userId: string,
  ): Promise<AuthConfig> {
    const config = await this.findOne(id, userId);

    // If updating data, encrypt it
    if (updateAuthConfigDto.data) {
      const encryptedData = this.encryptionService.encryptObject(
        updateAuthConfigDto.data,
      );
      config.data = encryptedData as any;
    }

    if (updateAuthConfigDto.name) {
      config.name = updateAuthConfigDto.name;
    }

    if (updateAuthConfigDto.type) {
      config.type = updateAuthConfigDto.type;
    }

    const saved = await this.authConfigsRepository.save(config);
    return this.decryptAuthConfig(saved);
  }

  /**
   * Delete auth config
   */
  async remove(id: string, userId: string): Promise<void> {
    const config = await this.findOne(id, userId);
    await this.authConfigsRepository.remove(config);
  }

  /**
   * Decrypt auth config data
   */
  private decryptAuthConfig(config: AuthConfig): AuthConfig {
    if (config.encrypted && typeof config.data === 'string') {
      try {
        const decryptedData = this.encryptionService.decryptObject<AuthConfigData>(
          config.data as any,
        );
        return {
          ...config,
          data: decryptedData,
        };
      } catch (error) {
        throw new Error(`Failed to decrypt auth config: ${error.message}`);
      }
    }
    return config;
  }
}
