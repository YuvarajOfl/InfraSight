/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CloudAccount, CloudResource, Finding, TerraformDrift } from '../types';

export const INITIAL_ACCOUNTS: CloudAccount[] = [
  {
    id: 'acc-aws-01',
    name: 'AWS DevStack (Core)',
    provider: 'AWS',
    status: 'connected',
    arnRole: 'arn:aws:iam::123456789012:role/CloudGuardianScan',
    externalId: 'cg-ext-3902dfa',
    lastScanned: '2026-06-11 06:12 UTC',
    region: 'us-east-1',
    resourcesCount: 8
  },
  {
    id: 'acc-gcp-01',
    name: 'GCP ProdScale (VPC)',
    provider: 'GCP',
    status: 'connected',
    serviceAccountEmail: 'guardian-scanner@prodscale-infra.iam.gserviceaccount.com',
    lastScanned: '2026-06-11 07:44 UTC',
    region: 'us-central1',
    resourcesCount: 6
  }
];

export const INITIAL_RESOURCES: CloudResource[] = [
  // AWS Resources
  {
    id: 'i-0ab123cd456ef789a',
    accountId: 'acc-aws-01',
    name: 'dev-api-gateway-node-01',
    type: 'virtual_machine',
    provider: 'AWS',
    region: 'us-east-1',
    status: 'warning',
    costMonthly: 120,
    tags: { Environment: 'dev', Tier: 'API', Owner: 'DevOps' },
    details: {
      instanceType: 't3.xlarge',
      publicIp: '54.210.13.190',
      isUnused: true // Idle VM
    }
  },
  {
    id: 'i-0ff884931dd20bbba',
    accountId: 'acc-aws-01',
    name: 'prod-internal-payments-validator',
    type: 'virtual_machine',
    provider: 'AWS',
    region: 'us-east-1',
    status: 'active',
    costMonthly: 380,
    tags: { Environment: 'prod', Compliance: 'PCI-DSS' },
    details: {
      instanceType: 'm5.xlarge',
      publicIp: '34.192.40.11',
      isUnused: false
    }
  },
  {
    id: 's3-assets-public-unencrypted',
    accountId: 'acc-aws-01',
    name: 'guardian-untrusted-static-assets',
    type: 'storage_bucket',
    provider: 'AWS',
    region: 'us-east-1',
    status: 'critical',
    costMonthly: 45,
    tags: { Tier: 'Storage', PublicAccess: 'True' },
    details: {
      sizeGb: 1200,
      encryptionEnabled: false // Insecure Public Buckets
    }
  },
  {
    id: 's3-backups-secure-cloud',
    accountId: 'acc-aws-01',
    name: 'cloudguardian-internal-database-backups',
    type: 'storage_bucket',
    provider: 'AWS',
    region: 'us-east-1',
    status: 'active',
    costMonthly: 320,
    tags: { Tier: 'Backups', BackupCycle: 'Daily' },
    details: {
      sizeGb: 8400,
      encryptionEnabled: true
    }
  },
  {
    id: 'sg-0219ad3a7ef0129a',
    accountId: 'acc-aws-01',
    name: 'kubernetes-worker-security-group',
    type: 'firewall_rule',
    provider: 'AWS',
    region: 'us-east-1',
    status: 'critical',
    costMonthly: 0,
    tags: { ManagedBy: 'EKS' },
    details: {
      ports: '22, 80, 443, 8080',
      authPolicy: 'Permit Globally' // Open Ports
    }
  },
  {
    id: 'db-rds-postgres-read-replica',
    accountId: 'acc-aws-01',
    name: 'guardian-rds-replica-01',
    type: 'database_instance',
    provider: 'AWS',
    region: 'us-east-1',
    status: 'warning',
    costMonthly: 150,
    tags: { Tier: 'Database', Environment: 'dev' },
    details: {
      instanceType: 'db.r6g.large',
      version: 'PostgreSQL 15',
      isUnused: true // Over-Provisioned OR Unused Database unit
    }
  },
  {
    id: 'iam-role-powerusers-all',
    accountId: 'acc-aws-01',
    name: 'SuperAdminPowerDevelopers',
    type: 'iam_role',
    provider: 'AWS',
    region: 'global',
    status: 'warning',
    costMonthly: 0,
    tags: { Owner: 'HR' },
    details: {
      authPolicy: 'AdministratorAccess with open asterisk scopes' // Over-Privileged IAM Roles
    }
  },

  // GCP Resources
  {
    id: 'gcp-vm-compute-prod-worker',
    accountId: 'acc-gcp-01',
    name: 'gcp-compute-worker-01',
    type: 'virtual_machine',
    provider: 'GCP',
    region: 'us-central1',
    status: 'active',
    costMonthly: 210,
    tags: { env: 'prod', app: 'runner' },
    details: {
      instanceType: 'n2-standard-4',
      publicIp: '35.200.12.87',
      isUnused: false
    }
  },
  {
    id: 'gcp-vm-compute-stage-demo',
    accountId: 'acc-gcp-01',
    name: 'gcp-stage-sandbox-host',
    type: 'virtual_machine',
    provider: 'GCP',
    region: 'us-central1',
    status: 'stopped',
    costMonthly: 18,
    tags: { env: 'stage' },
    details: {
      instanceType: 'e2-medium',
      publicIp: '34.80.99.141',
      isUnused: true // Stopped with Reserved IP
    }
  },
  {
    id: 'gcp-bucket-sensitive-customer-data',
    accountId: 'acc-gcp-01',
    name: 'gcp-sensitive-customer-receipts',
    type: 'storage_bucket',
    provider: 'GCP',
    region: 'us-central1',
    status: 'critical',
    costMonthly: 130,
    tags: { data: 'financial', env: 'prod' },
    details: {
      sizeGb: 450,
      encryptionEnabled: false // Unsecured GCP Bucket
    }
  },
  {
    id: 'gcp-gke-firewall-ssh-open',
    accountId: 'acc-gcp-01',
    name: 'default-allow-ssh',
    type: 'firewall_rule',
    provider: 'GCP',
    region: 'us-central1',
    status: 'warning',
    costMonthly: 0,
    tags: { network: 'default' },
    details: {
      ports: '22',
      authPolicy: 'Allow from 0.0.0.0/0' // Insecure globally open port
    }
  }
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'f-sec-01',
    accountId: 'acc-aws-01',
    category: 'security',
    severity: 'critical',
    resourceId: 'sg-0219ad3a7ef0129a',
    resourceName: 'kubernetes-worker-security-group',
    provider: 'AWS',
    title: 'Insecure Security Group Configuration: globally open port 22 (SSH)',
    description: 'Security group allows all incoming IPv4 connections on port 22. This permits brute-force credential stuffing and exploit scanning from any IP on the public internet.',
    remediation: 'Restrict port 22 access to recognized office bastion subnets or replace it completely with AWS Systems Manager (SSM) Session Manager for terminal setups.',
    detectedAt: '2026-06-11 06:12:15 UTC',
    status: 'active'
  },
  {
    id: 'f-sec-02',
    accountId: 'acc-aws-01',
    category: 'security',
    severity: 'high',
    resourceId: 's3-assets-public-unencrypted',
    resourceName: 'guardian-untrusted-static-assets',
    provider: 'AWS',
    title: 'Publicly Readable and Unencrypted S3 Storage Bucket',
    description: 'The S3 bucket does not force Default Encryption keys. Security checks indicate static web-hosting controls have granted anonymous READ access (AllUsers ACL permissions).',
    remediation: 'Enable default SSE-S3 AES-256 or SSE-KMS encryption and configure the bucket policy to enable block public access block options.',
    detectedAt: '2026-06-11 06:12:22 UTC',
    status: 'active'
  },
  {
    id: 'f-sec-03',
    accountId: 'acc-aws-01',
    category: 'security',
    severity: 'medium',
    resourceId: 'iam-role-powerusers-all',
    resourceName: 'SuperAdminPowerDevelopers',
    provider: 'AWS',
    title: 'Highly Privileged and Over-Scoped Development Role Permissions',
    description: 'The IAM role allows broad AdministratorAccess inside development environments. Several engineers have utilized asterisk scopes for local operations, bypassing IAM segregation boundaries.',
    remediation: 'Review IAM Access Analyzer timelines and restrict permissions to dedicated developer tasks following least privilege profiles.',
    detectedAt: '2026-06-11 06:12:45 UTC',
    status: 'active'
  },
  {
    id: 'f-sec-04',
    accountId: 'acc-gcp-01',
    category: 'security',
    severity: 'critical',
    resourceId: 'gcp-bucket-sensitive-customer-data',
    resourceName: 'gcp-sensitive-customer-receipts',
    provider: 'GCP',
    title: 'Publicly Readable Cloud Storage Bucket containing customer invoice records',
    description: 'IAM Policy on the bucket allows allUsers read permission. Sensitive receipts and customer balance histories are exposed anonymously.',
    remediation: 'Enforce GCP Uniform Bucket-Level Access, delete any allUsers roles inside IAM policies, and configure access via Signed URLs if files must be transiently exposed to customers.',
    detectedAt: '2026-06-11 07:44:11 UTC',
    status: 'active'
  },
  {
    id: 'f-cost-01',
    accountId: 'acc-aws-01',
    category: 'cost',
    severity: 'medium',
    resourceId: 'i-0ab123cd456ef789a',
    resourceName: 'dev-api-gateway-node-01',
    provider: 'AWS',
    title: 'Idle Virtual Machine Accounted For Over-Provisioning',
    description: 'The EC2 t3.xlarge instance has reported less than 2% average CPU utilization and less than 1% storage IO over the past fortnight. It is draining development financial pools actively.',
    remediation: 'Switch to automated stop triggers during weekends, downgrade to an t3.medium tier, or replace with ECS fargate tasks under demand spikes.',
    detectedAt: '2026-06-11 06:12:30 UTC',
    status: 'active'
  },
  {
    id: 'f-cost-02',
    accountId: 'acc-aws-01',
    category: 'cost',
    severity: 'low',
    resourceId: 'db-rds-postgres-read-replica',
    resourceName: 'guardian-rds-replica-01',
    provider: 'AWS',
    title: 'Orphaned Database Replica running without active connection handles',
    description: 'RDS read-replica is active and running, but no client or server connection handles have read from it for 30 consecutive days.',
    remediation: 'Create a final Snapshot manually, then terminate the RDS multi-AZ instance clone to yield $150 monthly runtime savings.',
    detectedAt: '2026-06-11 06:12:59 UTC',
    status: 'active'
  },
  {
    id: 'f-cost-03',
    accountId: 'acc-gcp-01',
    category: 'cost',
    severity: 'medium',
    resourceId: 'gcp-vm-compute-stage-demo',
    resourceName: 'gcp-stage-sandbox-host',
    provider: 'GCP',
    title: 'Stopped Virtual Machine continues holding expensive SSD boot disks and external IPs',
    description: 'Compute instances are offline, but they continue holding static external reserved IP addresses and SSD boot disk attachments which represent continuous pricing penalties.',
    remediation: 'Release the static external reserved IP if it is not explicitly required, or build snapshots and terminate orphaned host volumes.',
    detectedAt: '2026-06-11 07:44:03 UTC',
    status: 'active'
  },
  {
    id: 'f-drift-01',
    accountId: 'acc-aws-01',
    category: 'drift',
    severity: 'high',
    resourceId: 'sg-0219ad3a7ef0129a',
    resourceName: 'kubernetes-worker-security-group',
    provider: 'AWS',
    title: 'Terraform Configuration Drift: SSH (Port 22) allowed to global traffic',
    description: 'Terraform configuration file controls port 80 and 443 solely. However, an operator manually modified the security group in the AWS Console to allow global SSH traffic.',
    remediation: 'Update main.tf configuration blocks back to limited IPs and run `terraform apply` to overwrite manual drift overrides.',
    detectedAt: '2026-06-11 06:13:02 UTC',
    status: 'active'
  }
];

export const INITIAL_DRIFTS: TerraformDrift[] = [
  {
    id: 'd-01',
    accountId: 'acc-aws-01',
    resourceName: 'kubernetes-worker-security-group',
    resourceType: 'aws_security_group',
    driftType: 'config_modified',
    stateValue: 'ingress { from_port = 80, 443; cidr_blocks = ["10.0.0.0/16"] }',
    actualValue: 'ingress { from_port = 22, 80, 443; cidr_blocks = ["0.0.0.0/0"] }',
    suggestedFix: 'Remove the ingress SSH rules matching global cidr blocks from the Security group configs directly.',
    remediationCode: `ingress {
  description = "Allow HTTP and HTTPS only"
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/16"]
}`
  },
  {
    id: 'd-02',
    accountId: 'acc-aws-01',
    resourceName: 'guardian-untrusted-static-assets',
    resourceType: 'aws_s3_bucket',
    driftType: 'config_modified',
    stateValue: 'acl = "private"\nserver_side_encryption_configuration { rule { apply_server_side_encryption_by_default { sse_algorithm = "AES256" } } }',
    actualValue: 'acl = "public-read"\nserver_side_encryption_configuration = null',
    suggestedFix: 'Re-apply AWS server-side bucket protection and secure the ACL profile back to private setting.',
    remediationCode: `resource "aws_s3_bucket_server_side_encryption_configuration" "assets_sec" {
  bucket = aws_s3_bucket.static_assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`
  },
  {
    id: 'd-03',
    accountId: 'acc-gcp-01',
    resourceName: 'default-allow-ssh',
    resourceType: 'google_compute_firewall',
    driftType: 'config_modified',
    stateValue: 'source_ranges = ["192.168.1.0/24"]',
    actualValue: 'source_ranges = ["0.0.0.0/0"]',
    suggestedFix: 'Re-apply source ranges restriction targeting specified internal dev vpc blocks in google_compute_firewall block.',
    remediationCode: `resource "google_compute_firewall" "allow_ssh" {
  name    = "default-allow-ssh"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["192.168.1.0/24"]
}`
  },
  {
    id: 'd-04',
    accountId: 'acc-gcp-01',
    resourceName: 'gcp-temporary-debug-bucket',
    resourceType: 'google_storage_bucket',
    driftType: 'extra_in_cloud',
    stateValue: '(Not declared in current local state configuration)',
    actualValue: 'resource "google_storage_bucket" "debug_bucket" { name = "gcp-temporary-debug-bucket" }',
    suggestedFix: 'Either import this resource into your Terraform registry using `terraform import` or delete this resource via GCP dashboard if it was only temporary.',
    remediationCode: `terraform import google_storage_bucket.debug_bucket gcp-temporary-debug-bucket`
  }
];
