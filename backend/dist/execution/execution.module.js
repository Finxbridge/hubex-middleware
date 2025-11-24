"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionModule = void 0;
const common_1 = require("@nestjs/common");
const execution_service_1 = require("./execution.service");
const execution_controller_1 = require("./execution.controller");
const workflows_module_1 = require("../workflows/workflows.module");
const auth_configs_module_1 = require("../auth-configs/auth-configs.module");
const logs_module_1 = require("../logs/logs.module");
const auth_processor_1 = require("./processors/auth-processor");
const api_processor_1 = require("./processors/api-processor");
const transform_processor_1 = require("./processors/transform-processor");
const logic_processor_1 = require("./processors/logic-processor");
const output_processor_1 = require("./processors/output-processor");
let ExecutionModule = class ExecutionModule {
};
exports.ExecutionModule = ExecutionModule;
exports.ExecutionModule = ExecutionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            workflows_module_1.WorkflowsModule,
            auth_configs_module_1.AuthConfigsModule,
            logs_module_1.LogsModule,
        ],
        controllers: [execution_controller_1.ExecutionController],
        providers: [
            execution_service_1.ExecutionService,
            auth_processor_1.AuthProcessor,
            api_processor_1.ApiProcessor,
            transform_processor_1.TransformProcessor,
            logic_processor_1.LogicProcessor,
            output_processor_1.OutputProcessor,
        ],
        exports: [execution_service_1.ExecutionService],
    })
], ExecutionModule);
//# sourceMappingURL=execution.module.js.map