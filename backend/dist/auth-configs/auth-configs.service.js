"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthConfigsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_config_entity_1 = require("./entities/auth-config.entity");
const encryption_service_1 = require("../common/services/encryption.service");
let AuthConfigsService = class AuthConfigsService {
    constructor(authConfigsRepository, encryptionService) {
        this.authConfigsRepository = authConfigsRepository;
        this.encryptionService = encryptionService;
    }
    async create(createAuthConfigDto, userId) {
        const encryptedData = this.encryptionService.encryptObject(createAuthConfigDto.data);
        const authConfig = this.authConfigsRepository.create({
            name: createAuthConfigDto.name,
            type: createAuthConfigDto.type,
            data: encryptedData,
            encrypted: true,
            userId,
        });
        return this.authConfigsRepository.save(authConfig);
    }
    async findAll(userId) {
        const configs = await this.authConfigsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return configs.map((config) => this.decryptAuthConfig(config));
    }
    async findOne(id, userId) {
        const config = await this.authConfigsRepository.findOne({
            where: { id },
        });
        if (!config) {
            throw new common_1.NotFoundException(`Auth config with ID ${id} not found`);
        }
        if (config.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this auth config');
        }
        return this.decryptAuthConfig(config);
    }
    async findOneForExecution(id) {
        const config = await this.authConfigsRepository.findOne({
            where: { id },
        });
        if (!config) {
            throw new common_1.NotFoundException(`Auth config with ID ${id} not found`);
        }
        return this.decryptAuthConfig(config);
    }
    async update(id, updateAuthConfigDto, userId) {
        const config = await this.findOne(id, userId);
        if (updateAuthConfigDto.data) {
            const encryptedData = this.encryptionService.encryptObject(updateAuthConfigDto.data);
            config.data = encryptedData;
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
    async remove(id, userId) {
        const config = await this.findOne(id, userId);
        await this.authConfigsRepository.remove(config);
    }
    decryptAuthConfig(config) {
        if (config.encrypted && typeof config.data === 'string') {
            try {
                const decryptedData = this.encryptionService.decryptObject(config.data);
                return {
                    ...config,
                    data: decryptedData,
                };
            }
            catch (error) {
                throw new Error(`Failed to decrypt auth config: ${error.message}`);
            }
        }
        return config;
    }
};
exports.AuthConfigsService = AuthConfigsService;
exports.AuthConfigsService = AuthConfigsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_config_entity_1.AuthConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        encryption_service_1.EncryptionService])
], AuthConfigsService);
//# sourceMappingURL=auth-configs.service.js.map