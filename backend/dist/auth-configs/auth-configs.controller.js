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
exports.AuthConfigsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_configs_service_1 = require("./auth-configs.service");
const create_auth_config_dto_1 = require("./dto/create-auth-config.dto");
const update_auth_config_dto_1 = require("./dto/update-auth-config.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AuthConfigsController = class AuthConfigsController {
    constructor(authConfigsService) {
        this.authConfigsService = authConfigsService;
    }
    create(createAuthConfigDto, req) {
        return this.authConfigsService.create(createAuthConfigDto, req.user.userId);
    }
    findAll(req) {
        return this.authConfigsService.findAll(req.user.userId);
    }
    findOne(id, req) {
        return this.authConfigsService.findOne(id, req.user.userId);
    }
    update(id, updateAuthConfigDto, req) {
        return this.authConfigsService.update(id, updateAuthConfigDto, req.user.userId);
    }
    remove(id, req) {
        return this.authConfigsService.remove(id, req.user.userId);
    }
};
exports.AuthConfigsController = AuthConfigsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new authentication configuration',
        description: 'Store authentication credentials for external APIs (API Keys, OAuth2, Basic Auth).'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Auth config created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_config_dto_1.CreateAuthConfigDto, Object]),
    __metadata("design:returntype", void 0)
], AuthConfigsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all authentication configurations',
        description: 'Retrieve all authentication configurations for the current user.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of auth configs' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthConfigsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get authentication configuration by ID',
        description: 'Retrieve a specific authentication configuration.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auth config details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Auth config not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not the owner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthConfigsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update authentication configuration',
        description: 'Update credentials or settings for an authentication configuration.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auth config updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Auth config not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not the owner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_auth_config_dto_1.UpdateAuthConfigDto, Object]),
    __metadata("design:returntype", void 0)
], AuthConfigsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete authentication configuration',
        description: 'Permanently delete an authentication configuration.'
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Auth config deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Auth config not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - not the owner' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthConfigsController.prototype, "remove", null);
exports.AuthConfigsController = AuthConfigsController = __decorate([
    (0, swagger_1.ApiTags)('auth-configs'),
    (0, common_1.Controller)('auth-configs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [auth_configs_service_1.AuthConfigsService])
], AuthConfigsController);
//# sourceMappingURL=auth-configs.controller.js.map