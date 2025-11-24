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
exports.ExecutionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ExecutionResponseDto {
}
exports.ExecutionResponseDto = ExecutionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], ExecutionResponseDto.prototype, "executionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'success', enum: ['success', 'error', 'running'] }),
    __metadata("design:type", String)
], ExecutionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            users: [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' }
            ]
        }
    }),
    __metadata("design:type", Object)
], ExecutionResponseDto.prototype, "output", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250, description: 'Execution time in milliseconds' }),
    __metadata("design:type", Number)
], ExecutionResponseDto.prototype, "executionTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00Z' }),
    __metadata("design:type", Date)
], ExecutionResponseDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:01Z' }),
    __metadata("design:type", Date)
], ExecutionResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, required: false }),
    __metadata("design:type", String)
], ExecutionResponseDto.prototype, "error", void 0);
//# sourceMappingURL=execution-response.dto.js.map