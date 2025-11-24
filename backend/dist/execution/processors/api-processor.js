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
var ApiProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiProcessor = void 0;
const common_1 = require("@nestjs/common");
const base_processor_1 = require("./base-processor");
const http_client_service_1 = require("../../common/services/http-client.service");
let ApiProcessor = ApiProcessor_1 = class ApiProcessor extends base_processor_1.BaseProcessor {
    constructor(httpClient) {
        super();
        this.httpClient = httpClient;
        this.logger = new common_1.Logger(ApiProcessor_1.name);
    }
    async process(node, context) {
        const { url, method, headers, body, authId } = node.data;
        if (!url || !method) {
            throw new Error('API node requires url and method');
        }
        const resolvedUrl = this.resolveVariables(url, context);
        const resolvedHeaders = this.resolveObjectVariables(headers || {}, context);
        const resolvedBody = this.resolveObjectVariables(body, context);
        this.logger.debug(`Executing API call: ${method} ${resolvedUrl}`);
        let authType, authData;
        if (authId) {
            const authConfig = context.authConfigs.get(authId);
            if (authConfig) {
                authType = authConfig.type;
                authData = authConfig.data;
            }
            else {
                this.logger.warn(`Auth config ${authId} not found in context`);
            }
        }
        try {
            const response = await this.httpClient.request({
                url: resolvedUrl,
                method: method.toUpperCase(),
                headers: resolvedHeaders,
                data: resolvedBody,
                authType,
                authData,
            });
            this.logger.debug(`API call successful: ${response.status}`);
            this.setVariable(context, `${node.id}.response`, response.data);
            this.setVariable(context, `${node.id}.status`, response.status);
            this.setVariable(context, `${node.id}.headers`, response.headers);
            return response.data;
        }
        catch (error) {
            this.logger.error(`API call failed: ${error.message}`);
            throw new Error(`API call failed: ${error.message}`);
        }
    }
};
exports.ApiProcessor = ApiProcessor;
exports.ApiProcessor = ApiProcessor = ApiProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [http_client_service_1.HttpClientService])
], ApiProcessor);
//# sourceMappingURL=api-processor.js.map