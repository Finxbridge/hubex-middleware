"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_auth_config_dto_1 = require("./create-auth-config.dto");
class UpdateAuthConfigDto extends (0, swagger_1.PartialType)(create_auth_config_dto_1.CreateAuthConfigDto) {
}
exports.UpdateAuthConfigDto = UpdateAuthConfigDto;
//# sourceMappingURL=update-auth-config.dto.js.map