/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CloudAccount {
  id: string;
  name: string;
  provider: 'AWS' | 'GCP';
  status: 'connected' | 'error' | 'unverified';
  arnRole?: string;
  externalId?: string;
  serviceAccountEmail?: string;
  lastScanned?: string;
  region: string;
  resourcesCount: number;
}

export interface CloudResource {
  id: string;
  accountId: string;
  name: string;
  type: 'virtual_machine' | 'storage_bucket' | 'firewall_rule' | 'database_instance' | 'iam_role';
  provider: 'AWS' | 'GCP';
  region: string;
  status: 'active' | 'stopped' | 'warning' | 'critical';
  costMonthly: number;
  tags: Record<string, string>;
  details: {
    instanceType?: string;
    publicIp?: string;
    sizeGb?: number;
    encryptionEnabled?: boolean;
    authPolicy?: string;
    ports?: string;
    version?: string;
    isUnused?: boolean;
  };
}

export interface Finding {
  id: string;
  accountId: string;
  category: 'security' | 'cost' | 'drift' | 'health';
  severity: 'critical' | 'high' | 'medium' | 'low';
  resourceId?: string;
  resourceName?: string;
  provider: 'AWS' | 'GCP';
  title: string;
  description: string;
  remediation: string;
  detectedAt: string;
  status: 'active' | 'resolved' | 'muted';
}

export interface TerraformDrift {
  id: string;
  accountId: string;
  resourceName: string;
  resourceType: string;
  driftType: 'missing_in_cloud' | 'extra_in_cloud' | 'config_modified';
  stateValue: string;
  actualValue: string;
  suggestedFix: string;
  remediationCode?: string;
}

export interface DashboardMetric {
  healthScore: number;
  securityScore: number;
  costScore: number;
  totalResources: number;
  totalMonthlyCost: number;
  potentialSavings: number;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}
