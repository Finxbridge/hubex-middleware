"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthConfigsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_configs_service_1 = require("./auth-configs.service");
const auth_configs_controller_1 = require("./auth-configs.controller");
const auth_config_entity_1 = require("./entities/auth-config.entity");
let AuthConfigsModule = class AuthConfigsModule {
};
exports.AuthConfigsModule = AuthConfigsModule;
exports.AuthConfigsModule = AuthConfigsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([auth_config_entity_1.AuthConfig])],
        controllers: [auth_configs_controller_1.AuthConfigsController],
        providers: [auth_configs_service_1.AuthConfigsService],
        exports: [auth_configs_service_1.AuthConfigsService],
    })
], AuthConfigsModule);
//# sourceMappingURL=auth-configs.module.js.map