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
exports.WorkflowListResponseDto = exports.WorkflowResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class WorkflowResponseDto {
}
exports.WorkflowResponseDto = WorkflowResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My API Workflow' }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A workflow that fetches data from multiple APIs', required: false }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            nodes: [
                {
                    id: '1',
                    type: 'api',
                    position: { x: 100, y: 100 },
                    data: { label: 'Get Users', url: 'https://api.example.com/users', method: 'GET' }
                }
            ],
            edges: []
        }
    }),
    __metadata("design:type", Object)
], WorkflowResponseDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], WorkflowResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], WorkflowResponseDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'my-api-workflow', required: false }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], WorkflowResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00Z' }),
    __metadata("design:type", Date)
], WorkflowResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-20T14:45:00Z' }),
    __metadata("design:type", Date)
], WorkflowResponseDto.prototype, "updatedAt", void 0);
class WorkflowListResponseDto {
}
exports.WorkflowListResponseDto = WorkflowListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [WorkflowResponseDto] }),
    __metadata("design:type", Array)
], WorkflowListResponseDto.prototype, "workflows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], WorkflowListResponseDto.prototype, "total", void 0);
//# sourceMappingURL=workflow-response.dto.js.map