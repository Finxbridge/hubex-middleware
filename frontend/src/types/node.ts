export type NodeType = 'auth' | 'api' | 'transform' | 'logic' | 'output';

export interface BaseNodeData {
  label: string;
}

export interface AuthNodeData extends BaseNodeData {
  authType: 'api_key' | 'basic_auth' | 'bearer_token' | 'oauth2' | 'jwt';
  authConfigId?: string;
  config?: Record<string, any>;
}

export interface ApiNodeData extends BaseNodeData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  authId?: string;
}

export interface TransformNodeData extends BaseNodeData {
  transformType: 'map' | 'filter' | 'reduce' | 'custom';
  script?: string;
  mapping?: Record<string, string>;
  sourceNodeId?: string;
}

export interface LogicNodeData extends BaseNodeData {
  condition: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains';
  value: any;
  sourceNodeId?: string;
}

export interface OutputNodeData extends BaseNodeData {
  format: 'json' | 'text' | 'xml';
  sourceNodeId?: string;
  template?: string;
}

export type NodeData =
  | AuthNodeData
  | ApiNodeData
  | TransformNodeData
  | LogicNodeData
  | OutputNodeData;
