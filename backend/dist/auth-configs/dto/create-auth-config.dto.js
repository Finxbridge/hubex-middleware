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
exports.CreateAuthConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_config_entity_1 = require("../entities/auth-config.entity");
class CreateAuthConfigDto {
}
exports.CreateAuthConfigDto = CreateAuthConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OpenAI API Key' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateAuthConfigDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: auth_config_entity_1.AuthType, example: auth_config_entity_1.AuthType.API_KEY }),
    (0, class_validator_1.IsEnum)(auth_config_entity_1.AuthType),
    __metadata("design:type", String)
], CreateAuthConfigDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            keyName: 'Authorization',
            keyValue: 'Bearer sk-abc123...',
            placement: 'header'
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAuthConfigDto.prototype, "data", void 0);
//# sourceMappingURL=create-auth-config.dto.js.map