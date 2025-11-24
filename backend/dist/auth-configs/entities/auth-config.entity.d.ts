import { User } from '../../users/entities/user.entity';
export declare enum AuthType {
    API_KEY = "api_key",
    BASIC_AUTH = "basic_auth",
    BEARER_TOKEN = "bearer_token",
    OAUTH2 = "oauth2",
    JWT = "jwt"
}
export interface ApiKeyConfig {
    keyName: string;
    keyValue: string;
    placement: 'header' | 'query';
}
export interface BasicAuthConfig {
    username: string;
    password: string;
}
export interface BearerTokenConfig {
    token: string;
}
export interface OAuth2Config {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    redirectUri?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
}
export interface JWTConfig {
    secret: string;
    algorithm: string;
    payload: Record<string, any>;
}
export type AuthConfigData = ApiKeyConfig | BasicAuthConfig | BearerTokenConfig | OAuth2Config | JWTConfig;
export declare class AuthConfig {
    id: string;
    name: string;
    type: AuthType;
    data: AuthConfigData;
    encrypted: boolean;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
