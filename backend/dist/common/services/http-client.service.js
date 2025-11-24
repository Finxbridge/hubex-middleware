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
var HttpClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const auth_config_entity_1 = require("../../auth-configs/entities/auth-config.entity");
let HttpClientService = HttpClientService_1 = class HttpClientService {
    constructor() {
        this.logger = new common_1.Logger(HttpClientService_1.name);
        this.axiosInstance = axios_1.default.create({
            timeout: 30000,
            validateStatus: () => true,
        });
        this.axiosInstance.interceptors.request.use((config) => {
            this.logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            this.logger.error('Request error:', error);
            return Promise.reject(error);
        });
        this.axiosInstance.interceptors.response.use((response) => {
            this.logger.debug(`Response: ${response.status} ${response.config.url}`);
            return response;
        }, (error) => {
            this.logger.error('Response error:', error);
            return Promise.reject(error);
        });
    }
    async request(options) {
        const config = { ...options };
        if (options.authType && options.authData) {
            this.applyAuthentication(config, options.authType, options.authData);
        }
        try {
            const response = await this.axiosInstance.request(config);
            return response;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw this.handleAxiosError(error);
            }
            throw error;
        }
    }
    applyAuthentication(config, authType, authData) {
        switch (authType) {
            case auth_config_entity_1.AuthType.API_KEY:
                this.applyApiKey(config, authData);
                break;
            case auth_config_entity_1.AuthType.BASIC_AUTH:
                this.applyBasicAuth(config, authData);
                break;
            case auth_config_entity_1.AuthType.BEARER_TOKEN:
                this.applyBearerToken(config, authData);
                break;
            case auth_config_entity_1.AuthType.OAUTH2:
                this.applyOAuth2(config, authData);
                break;
            default:
                this.logger.warn(`Unsupported auth type: ${authType}`);
        }
    }
    applyApiKey(config, authData) {
        if (authData.placement === 'header') {
            config.headers = {
                ...config.headers,
                [authData.keyName]: authData.keyValue,
            };
        }
        else if (authData.placement === 'query') {
            config.params = {
                ...config.params,
                [authData.keyName]: authData.keyValue,
            };
        }
    }
    applyBasicAuth(config, authData) {
        config.auth = {
            username: authData.username,
            password: authData.password,
        };
    }
    applyBearerToken(config, authData) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authData.token}`,
        };
    }
    applyOAuth2(config, authData) {
        if (authData.accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${authData.accessToken}`,
            };
        }
    }
    handleAxiosError(error) {
        if (error.response) {
            return new Error(`HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
        else if (error.request) {
            return new Error('No response received from server');
        }
        else {
            return new Error(`Request error: ${error.message}`);
        }
    }
    async get(url, options) {
        return this.request({ ...options, method: 'GET', url });
    }
    async post(url, data, options) {
        return this.request({ ...options, method: 'POST', url, data });
    }
    async put(url, data, options) {
        return this.request({ ...options, method: 'PUT', url, data });
    }
    async patch(url, data, options) {
        return this.request({ ...options, method: 'PATCH', url, data });
    }
    async delete(url, options) {
        return this.request({ ...options, method: 'DELETE', url });
    }
};
exports.HttpClientService = HttpClientService;
exports.HttpClientService = HttpClientService = HttpClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HttpClientService);
//# sourceMappingURL=http-client.service.js.map