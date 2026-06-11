import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Cpu, 
  HelpCircle, 
  Briefcase, 
  ChevronDown, 
  Layers, 
  Code,
  GitPullRequest
} from 'lucide-react';

export function ArchitectureViewer() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'schemas' | 'code' | 'career'>('diagram');
  const [openIQAIdx, setOpenIQAIdx] = useState<number | null>(null);

  const interviewQAs = [
    {
      q: "How does CloudGuardian AI protect user secrets, like AWS access keys or GCP service account credentials?",
      a: "Cloud credentials must never touch client codebases or be printed in logs. They are handled solely over HTTPS REST channels to the secure backend, where they are encrypted with AES-256 before storage in a PostgreSQL instance (or decrypted on-the-fly inside serverless functions). Additionally, we enforce minimum privilege policies by warning users to only supply read-only credentials."
    },
    {
      q: "How does the Terraform drift detection parser identify gaps between code declarations and cloud reality?",
      a: "The engine compares the resources block listed in the Terraform State JSON (which stores the baseline snapshot of the configuration) with the active cloud metadata cache pulled via APIs. Gaps have three vectors: Modified configuration (different values for properties like ports or machine types), Decommissioned resources (present in state but missing in cloud), and Orphaned resources (added to cloud directly without code declarations)."
    },
    {
      q: "Why was the Gemini API integrated server-side rather than standard client-side SDK loading?",
      a: "In high-security SaaS platforms, protecting API secrets is paramount. Invoking Gemini on the client would expose the API Key to the browser's developer console. Server-side loading acts as an isolated gatekeeper, allowing us to perform validation, audit interactions, apply rate limits, and construct RAG context securely on the server."
    },
    {
      q: "How do you handle cloud provider API rate limiting (throttling) when performing full inventory scans?",
      a: "Cloud APIs have strict quotas. In a production pipeline, CloudGuardian AI handles this by implementing: (1) Exponential backoff retry strategies (using libraries like Tenacity in python or p-retry in JS). (2) Local caching of resource states so scans only query cloud providers at set intervals. (3) Using localized inventory sync logs like AWS Config or GCP Cloud Asset Inventory instead of polling individual service endpoints."
    },
    {
      q: "How does the AI Advisor ensure that user context fits inside the Gemini model context window without degrading response quality?",
      a: "Instead of raw, unformatted logs, we serialize scanned resources into highly dense, standardized representations (YAML or structured compressed JSON). We prune nested properties that do not relate to security, cost, or drift. This optimizes token usage, keeps questions context-relevant, and ensures extremely fast, highly targeted feedback from 'gemini-3.5-flash'."
    }
  ];

  return (
    <div id="architecture-viewer-panel" className="space-y-6 text-slate-100 font-sans">
      
      {/* Banner Tab bar headers */}
      <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-left">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Layers className="h-5.5 w-5.5 text-blue-400" />
            Operational Architectural Blueprint
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit our relational database schemas, IaC modules, Docker layers, and career diagnostics records.
          </p>
        </div>
        
        {/* Navigation Section Drawer Tabs */}
        <div className="flex bg-[#07080a] p-1 rounded-lg border border-[#1f212f] font-mono text-[11px] self-start xl:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'diagram', label: 'Topology', icon: <Layers className="h-3.5 w-3.5" /> },
            { id: 'schemas', label: 'DB Schemas', icon: <Database className="h-3.5 w-3.5" /> },
            { id: 'code', label: 'Deployment', icon: <Code className="h-3.5 w-3.5" /> },
            { id: 'career', label: 'Technical Q&A', icon: <Briefcase className="h-3.5 w-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Diagram Topology */}
      {activeTab === 'diagram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          {/* Diagrams blocks (Col Span 8) */}
          <div className="lg:col-span-8 bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-450 text-slate-400">
              SaaS Multi-Tier Service Boundaries
            </h3>

            <div className="space-y-4">
              {/* Card 1 */}
              <div className="p-4 bg-[#07080a] rounded-lg border border-[#1f212f] flex items-start gap-4">
                <div className="p-2.5 bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-lg shrink-0">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Client Interaction Ring (React, TypeScript, Tailwind CSS)</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                    Serves as the administrative control station. Manages multi-cloud credential validation, triggers diagnostics checks, and renders GitHub-style Terraform PR visual differences directly in the browser.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 bg-[#07080a] rounded-lg border border-[#1f212f] flex items-start gap-4">
                <div className="p-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-lg shrink-0">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Secure Server Isolation Gateway (Express, TSX, Python APIs)</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                    Acts as the secure proxy barrier. Protects secrets like private keys and cloud credentials from ever reaching client browsers, performs validation handshakes, and manages contextual multi-cloud RAG lookups.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 bg-[#07080a] rounded-lg border border-[#1f212f] flex items-start gap-4">
                <div className="p-2.5 bg-purple-500/15 text-purple-400 border border-purple-500/25 rounded-lg shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Encryption Persistence Tier (Relational PostgreSQL Engine)</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                    Manages relational schema mapping, securely storing encrypted cloud credentials, active discovered inventory nodes, and historic scan metrics for multi-cloud trends dashboard calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Spliced progress timeline sidebar (Col Span 4) */}
          <div className="lg:col-span-4 bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-4 text-left">
            <h3 className="font-bold text-xs tracking-widest uppercase text-slate-300 border-b border-[#1f212f] pb-2.5 font-mono">Release Timeline</h3>
            
            <div className="space-y-4 text-xs">
              <div className="border-l-2 border-[#1f212f] pl-4 py-0.5 relative">
                <div className="absolute top-0.5 left-[-5px] h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Phase 1: Security Handshake</span>
                <span className="font-bold text-white mt-1.5 block">API Gateway Integration</span>
                <p className="text-slate-300 mt-1 leading-normal font-normal">Binds Express routers, secures sensitive environments, and installs strict Google OAuth controls.</p>
              </div>

              <div className="border-l-2 border-[#1f212f] pl-4 py-0.5 relative">
                <div className="absolute top-0.5 left-[-5px] h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Phase 2: Scanning Audit</span>
                <span className="font-bold text-white mt-1.5 block">Cross-Account Subnet Scanner</span>
                <p className="text-slate-300 mt-1 leading-normal font-normal">Invokes AWS IAM Roles policies and GCP Viewer Service Keys. Collects active inventory metadata instantly.</p>
              </div>

              <div className="border-l-2 border-[#1f212f] pl-4 py-0.5 relative">
                <div className="absolute top-0.5 left-[-5px] h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Phase 3: Contextual RAG</span>
                <span className="font-bold text-white mt-1.5 block">Gemini Advisor Sandbox</span>
                <p className="text-slate-300 mt-1 leading-normal font-normal">Injects live cloud resource lists directly into query payloads. Provides real remediation HCL code blocks.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Schemas */}
      {activeTab === 'schemas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch text-left">
          {/* Relational Schema setup SQL */}
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                SQL Database DDL setup
              </h3>
              <p className="text-xs text-slate-400 mt-1">Structural definition mapping cloud resources catalog tables.</p>
            </div>

            <div className="bg-[#07080a] border border-[#1f212f] rounded-lg p-4 font-mono text-[10.5px] leading-relaxed select-all overflow-y-auto max-h-[440px] shadow-inner text-left">
              <pre className="text-cyan-400 font-mono">
{`-- Relational Postgres Schema
CREATE TABLE cloud_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    provider VARCHAR(50) NOT NULL, -- AWS / GCP
    name VARCHAR(100) NOT NULL,
    credentials JSONB NOT NULL,    -- AES-256 encrypted role metadata
    last_scanned_at TIMESTAMP
);

CREATE TABLE cloud_resources (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES cloud_accounts(id),
    resource_id VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- VM / S3 / DB
    region VARCHAR(100) NOT NULL,
    metadata JSONB NOT NULL             -- Specifications map
);

CREATE TABLE findings (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES cloud_accounts(id),
    category VARCHAR(50) NOT NULL,      -- security / cost / drift
    severity VARCHAR(50) NOT NULL,      -- critical / active
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    remediation TEXT,
    status VARCHAR(50) DEFAULT 'unresolved'
);`}
              </pre>
            </div>
          </div>

          {/* APIs Map specification */}
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                SaaS REST Endpoint Map
              </h3>
              <p className="text-xs text-slate-400 mt-1">Routes exposed over isolated HTTPS gatekeepers for client actions.</p>
            </div>

            <div className="bg-[#07080a] border border-[#1f212f] rounded-lg p-4 font-mono text-[11px] leading-relaxed select-all overflow-y-auto max-h-[440px] space-y-4 shadow-inner text-left">
              <div>
                <span className="text-blue-400 font-extrabold block uppercase tracking-wider text-[9px] font-mono">1. Integration handles</span>
                <span className="text-slate-300 block pt-1 font-mono">&bull; GET  /api/accounts - Fetch connected roles settings</span>
                <span className="text-slate-300 block font-mono">&bull; POST /api/accounts/connect - Set credentials and region details</span>
              </div>
              
              <div className="pt-3 border-t border-[#1f212f]">
                <span className="text-blue-400 font-extrabold block uppercase tracking-wider text-[9px] font-mono">2. Scanners & Inventory</span>
                <span className="text-slate-300 block pt-1 font-mono">&bull; POST /api/accounts/scan/:id - Pull cloud metadata cache</span>
                <span className="text-slate-300 block font-mono">&bull; GET  /api/resources - List discovered environment resources</span>
              </div>

              <div className="pt-3 border-t border-[#1f212f]">
                <span className="text-blue-400 font-extrabold block uppercase tracking-wider text-[9px] font-mono">3. Advisory Interactive Queries</span>
                <span className="text-slate-300 block pt-1 font-mono">&bull; GET  /api/findings - Pull active security/cost defects list</span>
                <span className="text-slate-300 block font-mono">&bull; GET  /api/drift - Track expected drift deviation hashes</span>
                <span className="text-slate-300 block font-mono">&bull; POST /api/advisor/chat - Gemini RAG isolated chat advisor</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Code */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
          {/* Column 1: Terraform */}
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-5 space-y-3">
            <span className="font-mono text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">IaC Definitions</span>
            <h4 className="font-bold text-white text-xs font-mono">Terraform main.tf Config</h4>
            
            <div className="bg-[#07080a] p-3.5 border border-[#1f212f] rounded-lg font-mono text-[10px] select-all overflow-y-auto h-72 shadow-inner text-left">
              <pre className="text-emerald-400 font-mono">
{`# Multi-Cloud baseline declarations
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "secured_vpc" {
  source = "./modules/network"
  env    = "prod"
}

module "worker_nodes" {
  source    = "./modules/compute"
  subnet_id = module.secured_vpc.subnets[0]
}`}
              </pre>
            </div>
          </div>

          {/* Column 2: Docker Container */}
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-5 space-y-3">
            <span className="font-mono text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Container definitions</span>
            <h4 className="font-bold text-white text-xs font-mono">Production Dockerfile</h4>
            
            <div className="bg-[#07080a] p-3.5 border border-[#1f212f] rounded-lg font-mono text-[10px] select-all overflow-y-auto h-72 shadow-inner text-left">
              <pre className="text-emerald-400 font-mono">
{`# Stage 1: Build resources
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimize execution footprint
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]`}
              </pre>
            </div>
          </div>

          {/* Column 3: CI/CD */}
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-5 space-y-3">
            <span className="font-mono text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Deployment Automations</span>
            <h4 className="font-bold text-white text-xs font-mono">CI/CD Security Workflow</h4>
            
            <div className="bg-[#07080a] p-3.5 border border-[#1f212f] rounded-lg font-mono text-[10px] select-all overflow-y-auto h-72 shadow-inner text-left">
              <pre className="text-emerald-400 font-mono">
{`name: CI Scanner and Deployer
on:
  push:
    branches: [main]

jobs:
  audit-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
         uses: actions/checkout@v3

      - name: Setup Node environment
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install & Compile
        run: |
          npm ci
          npm run lint

      - name: Trigger Terraform Scanners
        uses: aquasecurity/tfsec-action@v1.0`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Technical Q&A */}
      {activeTab === 'career' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          {/* Career description block */}
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 lg:col-span-4 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-[#1f212f] pb-3">
              <Briefcase className="h-4.5 w-4.5 text-blue-400" />
              SaaS Engineer Profile
            </h3>
            
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <span className="font-bold text-white uppercase tracking-wider text-[10px] block font-mono">Architect credentials profile:</span>
              <p className="font-normal">
                - Engineered isolated multi-cloud scanners safely extracting configurations for active AWS IAM Roles audit tracks and GCP Viewer setups.
              </p>
              <p className="font-normal">
                - Integrated Gemini-backed RAGAdvisor parsing open findings tables on the server-side to prevent credentials leakage.
              </p>
              <p className="font-normal">
                - Custom-built visual differential comparison tables comparing Terraform state baseline metrics against live cloud variables.
              </p>
            </div>
          </div>

          {/* Toughest Q&As */}
          <div className="lg:col-span-8 bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-4">
            <h3 className="font-[#1f212f] text-white text-sm flex items-center gap-2 border-b border-[#1f212f] pb-3 font-mono">
              <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
              Senior DevOps Technical Q&A Cards
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[440px] pr-1">
              {interviewQAs.map((qa, idx) => (
                <div 
                  key={idx}
                  className="bg-[#07080a] border border-[#1f212f] rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIQAIdx(openIQAIdx === idx ? null : idx)}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between text-xs font-bold text-slate-350 hover:text-white transition-colors gap-3 cursor-pointer"
                  >
                    <span>{qa.q}</span>
                    <ChevronDown className={`h-4.5 w-4.5 shrink-0 transition-transform text-slate-450 ${
                      openIQAIdx === idx ? 'rotate-180 text-blue-400' : ''
                    }`} />
                  </button>
                  
                  {openIQAIdx === idx && (
                    <div className="px-5 pb-5 pt-3 text-xs text-slate-300 leading-relaxed border-t border-[#1f212f] bg-[#0d0e12]">
                      {qa.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
