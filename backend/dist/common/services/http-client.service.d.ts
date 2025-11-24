import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthType, AuthConfigData } from '../../auth-configs/entities/auth-config.entity';
export interface HttpRequestOptions extends AxiosRequestConfig {
    authType?: AuthType;
    authData?: AuthConfigData;
}
export declare class HttpClientService {
    private readonly logger;
    private readonly axiosInstance;
    constructor();
    request<T = any>(options: HttpRequestOptions): Promise<AxiosResponse<T>>;
    private applyAuthentication;
    private applyApiKey;
    private applyBasicAuth;
    private applyBearerToken;
    private applyOAuth2;
    private handleAxiosError;
    get<T = any>(url: string, options?: HttpRequestOptions): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, options?: HttpRequestOptions): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, options?: HttpRequestOptions): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, options?: HttpRequestOptions): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, options?: HttpRequestOptions): Promise<AxiosResponse<T>>;
}
