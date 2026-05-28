export type AgentStatus = 'idle' | 'processing' | 'recovering' | 'failed' | 'active';

export interface AgentNode {
  id: string;
  label: string;
  type: 'supervisor' | 'routing' | 'worker' | 'monitoring' | 'security' | 'memory';
  status: AgentStatus;
  x: number;
  y: number;
  load: number;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'RECOVERY';
  source: string;
  message: string;
}

export interface ProviderHealth {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number; // ms
  successRate: number; // %
  active: boolean;
}
