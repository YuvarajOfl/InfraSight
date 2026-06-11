# CloudGuardian AI - System Architecture Blueprint
**AI-Powered Multi-Cloud Infrastructure Health, Security, Cost Optimization, and Drift Detection Platform**

---

## 1. System Architecture Diagram

This high-level architecture is designed as a secure, scalable, and free-tier-friendly cloud-native deployment. 

```
                                  +-------------------+
                                  |   Web Browser     |
                                  | (React Client)    |
                                  +---------+---------+
                                            | HTTPS / WSS
                                            v
                                 +----------+----------+
                                 |  Nginx Ingress/Proxy|
                                 +----------+----------+
                                            |
                         +------------------+------------------+
                         |                                     |
                         v /api/*                              v (Dev Static Assets)
              +----------+----------+               +----------+----------+
              |   Express Server    |               |  Vite Dev Server    |
              | (FastAPI-ready Node)|               +---------------------+
              +----+-----------+----+
                   |           |
        Database   |           | AI Prompts & context
        Operations |           | (Server-to-Server HTTPS)
                   v           v
              +----+----+  +---+----------------+
              | SQLite /|  | Google Gemini API  |
              | Postgres|  | (gemini-3.5-flash) |
              +---------+  +--------------------+
                   ^
                   | Metadata Fetching (HTTPS / SDKs)
                   |
         +---------+---------+
         | Multi-Cloud Engine|
         +----+-----------+--+
              |           |
              | AWS APIs  | GCP APIs
              v           v
          +---+---+   +---+---+
          |  AWS  |   |  GCP  |
          | Cloud |   | Cloud |
          +-------+   +-------+
```

---

## 2. Frontend Architecture
The client side is engineered as a Single Page Application (SPA) using React 19, Vite, and Tailwind CSS.

- **UI System**: Clean custom design built using standard Tailwind CSS classes. We pair elegant fonts ("Inter" for general UI, "JetBrains Mono" for terminal logs, configuration scripts, and drift details).
- **Core Components**:
  - `App.tsx`: Main router and layout coordinator. Defers view logic to segmented dashboard, inventory, security, costs, or settings panels.
  - `CloudConnectionCenter`: Validates account setup, credential forms, and triggers live cloud scanning.
  - `DriftDetector`: Visualizes differences between state files and cloud inventory.
  - `SecurityCommand`: Renders severe findings with recommendations.
  - `CostOptimizer`: Grouped card listings showing unused/idle assets and potential savings.
  - `AIAdvisor`: Chat panel powered by Gemini API, passing local inventory details as local retrieval-augmented generation (RAG) context.
- **State Management**: Simple, robust centralized React `useState` and `useContext` representing global state objects synchronized via REST queries back to the Express/FastAPI API wrapper.

---

## 3. Backend Architecture
The final target production backend is written in **FastAPI (Python)**, while this MVP utilizes a compliant **Express (TypeScript/Node.js)** backend designed with exactly parallel endpoints of API contracts. This keeps Node runtime fully-functional with zero third-party database startup crashes, ensuring immediate execution.

- **Modular Components**:
  - **Authenticator**: Handles token generation, security rules, and user profiles.
  - **AccountManager**: Registers AWS IAM keys and GCP Service Account JSON structures safely, evaluating permissions via test calls.
  - **ScannerEngine**: Simulates & runs cloud metadata audits for AWS (EC2, S3, IAM, Security Groups) and GCP (Compute, Storage, IAM, Firewall).
  - **DriftEngine**: Compares the simulated JSON-defined Terraform State against actual scanned resources, identifying missing or extra items.
  - **GeminiAIProxy**: Integrates the `@google/genai` TypeScript SDK on the server, safely constructing system prompts that inject scan state as RAG context before querying `gemini-3.5-flash`.

---

## 4. Database Schema
Whether using PostgreSQL (for production/Cloud SQL deployment) or SQLite/In-Memory structures (for zero-cost sandboxes), we adhere to a relational schema designed around solid normal forms:

```sql
-- Users and authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active Cloud Providers connections
CREATE TABLE cloud_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'AWS' or 'GCP'
    account_name VARCHAR(100) NOT NULL,
    credentials JSONB NOT NULL, -- Encrypted AWS Access Keys or GCP Service Account JSON
    status VARCHAR(50) DEFAULT 'unverified',
    last_scanned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scanned Cloud Resources (Inventory Cache)
CREATE TABLE cloud_resources (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    resource_id VARCHAR(255) NOT NULL, -- e.g., 'i-0ab12' or 'bucket-xyz'
    resource_name VARCHAR(255),
    resource_type VARCHAR(100) NOT NULL, -- 'virtual_machine', 'storage_bucket', 'firewall_rule'
    region VARCHAR(100),
    metadata JSONB NOT NULL, -- Deep specifications of security, cost tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Findings (Security risks, cost improvements)
CREATE TABLE findings (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'security', 'cost', 'drift'
    severity VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low'
    resource_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    remediation TEXT,
    is_silenced BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Terraform States representing configuration baselines
CREATE TABLE terraform_states (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    state_name VARCHAR(100) NOT NULL,
    state_content JSONB NOT NULL, -- Terraform state contents
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. API Design
Here are the essential REST contracts:

- `POST /api/auth/login` - Authenticates credentials, returns session context and JWT.
- `GET /api/accounts` - Retrieves all connected cloud accounts.
- `POST /api/accounts/connect` - Connects a new AWS IAM or GCP account.
- `POST /api/accounts/scan/:id` - Triggers an instant cloud resources discovery scan.
- `GET /api/inventory` - Queries scanned multi-cloud virtual assets, supporting search, providers, and region filters.
- `GET /api/security` - Retrieves security command center alerts with severity rankings.
- `GET /api/costs` - Returns potential optimization details and unused resources.
- `GET /api/drift` - Triggers baseline comparison between uploaded Terraform settings and active state.
- `POST /api/advisor/chat` - Submits a prompt to Gemini (`gemini-3.5-flash`), enriching the workspace with active discovery scan reports (RAG).

---

## 6. Folder Structure

A standardized, scalable directory structure separating backend scripts from client logic:

```
cloudguardian-ai/
├── .env.example              # Key configurations and templates
├── .gitignore                # Exclude runtime dependencies and build artifacts
├── ARCHITECTURE.md           # This comprehensive document
├── package.json              # Full-stack dependencies and scripts
├── server.ts                 # Full-stack entry point managing API proxying & scans
├── vite.config.ts            # Frontend builder
├── src/
│   ├── main.tsx              # React bootstrap
│   ├── App.tsx               # Client router & primary interface
│   ├── index.css             # tailwind and global CSS
│   ├── types.ts              # Strongly typed unified data interfaces
│   ├── db/
│   │   └── schema.ts         # SQL DDL mapping
│   ├── components/           # Reusable UI widgets
│   │   ├── CloudConnector.tsx # Credentials validation modal/pane
│   │   ├── DashboardHome.tsx  # KPI indicators and overall charts
│   │   ├── InventoryList.tsx  # Live cloud inventory table with filters
│   │   ├── SecurityAlerts.tsx # Security warnings and remediations
│   │   ├── CostCards.tsx      # Cost improvements
│   │   ├── DriftPanel.tsx     # State file compiler / drift visualizer
│   │   └── ChatAgent.tsx      # RAG-backed Gemini chat sidebar
│   └── data/
│       └── mockCloudData.ts   # Secure baseline simulation assets
```

---

## 7. Terraform Structure

A modular setup supporting multi-stack or multi-environment architectures:

```terraform
# main.tf
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

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

module "network" {
  source = "./modules/network"
  environment = var.environment
}

module "compute" {
  source     = "./modules/compute"
  vpc_id     = module.network.vpc_id
  subnet_id  = module.network.subnet_ids[0]
  instance_type = var.instance_type
}
```

---

## 8. Docker Setup
Multi-stage build Dockerfile for optimal production builds:

```dockerfile
# Dockerfile
# --- Stage 1: Build the asset bundles ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Production Execution ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

And simple docker-compose configuration for local service orchestration:

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DATABASE_URL=postgresql://guardian:guardian@db:5432/cloudguardian
    depends_on:
      - db
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=guardian
      - POSTGRES_PASSWORD=guardian
      - POSTGRES_DB=cloudguardian
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 9. GitHub Actions Workflow

This workflow automates testing, triggers code audits, executes security checks (using `tfsec`), and automates deployments.

```yaml
# .github/workflows/deploy.yml
name: CloudGuardian CI/CD and Deployment Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  audit-and-test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v3

    - name: Setup Node env
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Compile and Lint Application
      run: npm run lint

    - name: Security scan Terraform code
      uses: aquasecurity/tfsec-pr-commenter-action@v1.2.0
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}

  deploy-to-gcp:
    needs: audit-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v3

    - name: Authenticate to GCP
      uses: google-github-actions/auth@v1
      with:
        credentials_json: ${{ secrets.GCP_SA_KEY }}

    - name: Configure Cloud Run Deployment
      run: |
        gcloud run deploy cloudguardian-ai \
          --image gcr.io/${{ secrets.GCP_PROJECT }}/cloudguardian-image:latest \
          --platform managed \
          --region us-east1 \
          --allow-unauthenticated
```

---

## 10. Gemini Integration Strategy

To provide precise, context-aware advice, CloudGuardian AI uses local **Retrieval-Augmented Generation (RAG)** context. 

When a user asks a question or accesses the AI Advisor, the platform:
1. Obtains all currently active findings (drift events, open ports, security leaks, over-provisioned VMs).
2. Filters out sensitive credential variables or raw secret profiles.
3. Constructs a structured context payload summarizing the findings.
4. Supplies this payload to `gemini-3.5-flash` with a system prompt.

### System Prompt Example:
```text
You are CloudGuardian AI Professional. You are analyzing infrastructure metrics for multi-cloud environments.
Active Inventory Scan:
- Current Accounts: AWS (DevStack), GCP (ProdScale)
- Cloud Health Score: 84%, Security Score: 78%, Cost Score: 62%
Unsecured open ports: TCP 22 (SSH) open globally to 0.0.0.0/0 on SG 'sg-0219a'.
Unused assets: 3 idle EC2 vms (estimated loss: $148/month).
Terraform Drift: 'google_compute_firewall.default' was modified outside Terraform.

Provide clear steps to remediate, prioritize risks, specify required AWS CLI or gcloud command line args, and provide the updated Terraform blocks to secure the drifting configurations.
```

---

## 11. Security Best Practices
- **Credential Storage**: Cloud credentials are treated as high-security secrets. NEVER log keys or write them to persistent files in plain text.
- **Minimum Privilege**: Only request `ReadOnlyAccess` (AWS) and `Viewer` (GCP) roles for scans.
- **API Boundary Protection**: Express backend shields the Gemini API Key from the public client, routing all user queries securely via `/api/advisor/chat`.
- **Injection Mitigation**: Sanitize state files and credentials uploaded via Cloud Connection Center.

---

## 12. Development Roadmap
- **Phase 1: Foundation (Weeks 1-2)**: Scaffold Vite + Express full-stack architecture, implement Cloud Connection and basic local state.
- **Phase 2: Analytics & Scanning (Weeks 3-4)**: Build S3 bucketing, IAM, Compute, and Database scanner scripts. Hook up Terraform drift compiler.
- **Phase 3: RAG Core & AI Advisor (Week 5)**: Store findings. Implement Gemini API proxying with retrieval context injection.
- **Phase 4: Optimization, Reports & Launch (Week 6)**: Build PDF/CSV exporter. Harden security layout. Deploy to GCP Cloud Run.

---

## 13. MVP Features
- [x] Multi-cloud Single Pane interface tracking Health, Cost, Security, and Drift.
- [x] AWS IAM validation form and GCP Service Account Upload.
- [x] Cloud Resource list mapping VMs, storage bucket visibility, subnet routing, and firewall constraints.
- [x] Instant scanning engine detecting idle VMs, orphaned disks, and insecure globally open ports.
- [x] Terraform Drift module analyzing differences between State configurations and actual resources.
- [ ] Retrieval-Augmented Gemini AI conversational assistant.

---

## 14. Advanced Features (Future Enhancements)
- **Auto-remediation Actions**: Let the user resolve security issues or delete idle VMs instantly from the UI (requires Read/Write credentials).
- **Scheduled Scans**: Chronos crons triggering nightly discoveries with email notifications.
- **Organizational Hierarchies**: Multi-tenant workspace partitions.

---

## 15. Deployment Guide
1. **Local Setup**:
   ```bash
   npm install
   npm run dev
   ```
2. **Environment Configuration**: Set `GEMINI_API_KEY` in your environment.
3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 16. Future Scaling Plan
- **Caching Layer**: Place Redis cache in front of cloud scanning APIs to avoid provider-side rate limits.
- **Serverless Scanners**: Spin off scans as serverless worker tasks (e.g., AWS Lambda or GCP Cloud Run jobs) configured on event-driven queues (RabbitMQ/PubSub).
- **DB Sharding**: Partition resource catalogs sorted alphabetically by Cloud Account ID.

---

## 17. Resume Description
> **CloudGuardian AI | Full-Stack DevOps & AI Engineering Lead**  
> *Developed a production-grade multi-cloud security, cost auditing, and infrastructure drift discovery platform using React, Node.js/Express, Tailwind CSS, and Google Gemini Pro AI.*
> - Engineered an extensible cloud scanning simulation parsing live metadata structures for AWS (EC2, S3, IAM) and GCP (Compute, Storage, IAM), achieving multi-cloud oversight inside a single-page cockpit.
> - Formulated a stateful Terraform Drift Compiler scanning state declarations side-by-side with active configurations, auto-generating compliant remediation blocks and execution scripts.
> - Synthesized a Gemini-powered local RAG (Retrieval-Augmented Generation) advisor injecting real-time risk inventory maps to deliver instantly actionable mitigation CLI commands.
> - Adhered to modern architectural patterns separating client controls from secure backend API endpoints keeping sensitive API keys hidden from client-side bundles.

---

## 18. Technical Interview Q&A

**Q1: How does CloudGuardian AI protect user secrets, like AWS access keys or GCP service account credentials?**  
*Answer:* Cloud credentials must never touch client codebases or be printed in logs. They are handled solely over HTTPS REST channels to the secure backend, where they are encrypted with AES-256 before storage in a PostgreSQL instance (or decrypted on-the-fly inside serverless functions). Additionally, we enforce minimum privilege policies by warning users to only supply read-only credentials.

**Q2: How does the Terraform drift detection parser identify gaps between code declarations and cloud reality?**  
*Answer:* The engine compares the `resources` block listed in the Terraform State JSON (which stores the baseline snapshot of the configuration) with the active cloud metadata cache pulled via APIs. Gaps have three vectors: *Modified configuration* (different values for properties like ports or machine types), *Decommissioned resources* (present in state but missing in cloud), and *Orphaned resources* (added to cloud directly without code declarations).

**Q3: Why was the Gemini API integrated server-side rather than standard client-side SDK loading?**  
*Answer:* In high-security SaaS platforms, protecting API secrets is paramount. Invoking Gemini on the client would expose the API Key to the browser's developer console. Server-side loading acts as an isolated gatekeeper, allowing us to perform validation, audit interactions, apply rate limits, and construct RAG context securely on the server.

**Q4: How do you handle cloud provider API rate limiting (throttling) when performing full inventory scans?**  
*Answer:* Cloud APIs have strict quotas. In a production pipeline, CloudGuardian AI handles this by implementing:
1. Exponential backoff retry strategies (using libraries like Tenacity in python or p-retry in JS).
2. Local caching of resource states so scans only query cloud providers at set intervals (e.g., hourly or daily).
3. Using localized inventory sync logs like AWS Config or Cloud Asset Inventory instead of polling individual service endpoints.

**Q5: How does the AI Advisor ensure that user context fits inside the Gemini model context window without degrading response quality?**  
*Answer:* Instead of raw, unformatted logs, we serialize scanned resources into highly dense, standardized representations (YAML or structured compressed JSON). We prune nested properties that do not relate to security, cost, or drift. This optimizes token usage, keeps questions context-relevant, and ensures extremely fast, highly targeted feedback from `gemini-3.5-flash`.
