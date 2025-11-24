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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProcessor = void 0;
const common_1 = require("@nestjs/common");
const base_processor_1 = require("./base-processor");
const auth_configs_service_1 = require("../../auth-configs/auth-configs.service");
let AuthProcessor = class AuthProcessor extends base_processor_1.BaseProcessor {
    constructor(authConfigsService) {
        super();
        this.authConfigsService = authConfigsService;
    }
    async process(node, context) {
        const { authConfigId } = node.data;
        if (!authConfigId) {
            throw new Error('Auth node requires authConfigId');
        }
        const authConfig = await this.authConfigsService.findOneForExecution(authConfigId);
        context.authConfigs.set(node.id, authConfig);
        context.authConfigs.set(authConfigId, authConfig);
        return {
            type: authConfig.type,
            configId: authConfig.id,
            name: authConfig.name,
        };
    }
};
exports.AuthProcessor = AuthProcessor;
exports.AuthProcessor = AuthProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_configs_service_1.AuthConfigsService])
], AuthProcessor);
//# sourceMappingURL=auth-processor.js.map