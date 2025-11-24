import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AuthType {
  API_KEY = 'api_key',
  BASIC_AUTH = 'basic_auth',
  BEARER_TOKEN = 'bearer_token',
  OAUTH2 = 'oauth2',
  JWT = 'jwt',
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

export type AuthConfigData =
  | ApiKeyConfig
  | BasicAuthConfig
  | BearerTokenConfig
  | OAuth2Config
  | JWTConfig;

@Entity('auth_configs')
export class AuthConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AuthType })
  type: AuthType;

  @Column({ type: 'jsonb' })
  data: AuthConfigData;

  @Column({ default: true })
  encrypted: boolean;

  @ManyToOne(() => User, (user) => user.authConfigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
