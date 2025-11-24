import { Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import {
  AuthType,
  AuthConfigData,
  ApiKeyConfig,
  BasicAuthConfig,
  BearerTokenConfig,
  OAuth2Config,
} from '../../auth-configs/entities/auth-config.entity';

export interface HttpRequestOptions extends AxiosRequestConfig {
  authType?: AuthType;
  authData?: AuthConfigData;
}

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `Response: ${response.status} ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        this.logger.error('Response error:', error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Makes an HTTP request with optional authentication
   */
  async request<T = any>(options: HttpRequestOptions): Promise<AxiosResponse<T>> {
    const config = { ...options };

    // Apply authentication if provided
    if (options.authType && options.authData) {
      this.applyAuthentication(config, options.authType, options.authData);
    }

    try {
      const response = await this.axiosInstance.request<T>(config);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleAxiosError(error);
      }
      throw error;
    }
  }

  /**
   * Applies authentication to request config
   */
  private applyAuthentication(
    config: AxiosRequestConfig,
    authType: AuthType,
    authData: AuthConfigData,
  ): void {
    switch (authType) {
      case AuthType.API_KEY:
        this.applyApiKey(config, authData as ApiKeyConfig);
        break;
      case AuthType.BASIC_AUTH:
        this.applyBasicAuth(config, authData as BasicAuthConfig);
        break;
      case AuthType.BEARER_TOKEN:
        this.applyBearerToken(config, authData as BearerTokenConfig);
        break;
      case AuthType.OAUTH2:
        this.applyOAuth2(config, authData as OAuth2Config);
        break;
      default:
        this.logger.warn(`Unsupported auth type: ${authType}`);
    }
  }

  /**
   * Apply API Key authentication
   */
  private applyApiKey(config: AxiosRequestConfig, authData: ApiKeyConfig): void {
    if (authData.placement === 'header') {
      config.headers = {
        ...config.headers,
        [authData.keyName]: authData.keyValue,
      };
    } else if (authData.placement === 'query') {
      config.params = {
        ...config.params,
        [authData.keyName]: authData.keyValue,
      };
    }
  }

  /**
   * Apply Basic Authentication
   */
  private applyBasicAuth(
    config: AxiosRequestConfig,
    authData: BasicAuthConfig,
  ): void {
    config.auth = {
      username: authData.username,
      password: authData.password,
    };
  }

  /**
   * Apply Bearer Token authentication
   */
  private applyBearerToken(
    config: AxiosRequestConfig,
    authData: BearerTokenConfig,
  ): void {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authData.token}`,
    };
  }

  /**
   * Apply OAuth2 authentication
   */
  private applyOAuth2(
    config: AxiosRequestConfig,
    authData: OAuth2Config,
  ): void {
    if (authData.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authData.accessToken}`,
      };
    }
  }

  /**
   * Handles Axios errors
   */
  private handleAxiosError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      return new Error(
        `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`,
      );
    } else if (error.request) {
      // Request was made but no response
      return new Error('No response received from server');
    } else {
      // Error in request setup
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options?: HttpRequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...options, method: 'GET', url });
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...options, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...options, method: 'PUT', url, data });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...options, method: 'PATCH', url, data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: HttpRequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...options, method: 'DELETE', url });
  }
}
