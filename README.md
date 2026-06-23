# 🛡️ InfraSight

### A Cloud Security & Cost Governance Platform for Terraform Infrastructure

InfraSight is a secure, production-grade cloud security and cost governance platform designed to analyze Terraform configurations. Built for Cloud Architects, DevOps Engineers, and Security Teams, the platform provides automated security misconfiguration scanning, estimated monthly cost projections, and Gemini-powered AI remediation guidance. InfraSight enables organizations to identify architectural risks and cost wastes early in the development lifecycle before resources are provisioned in public cloud providers.

---

## 🔍 Key Features

### 🔍 Terraform Infrastructure Analysis
* **HCL Parsing Engine:** Parses uploaded Terraform (`.tf`) files using a robust Python HCL2 parser.
* **Resource Discovery:** Automatically extracts and catalogs cloud resource definitions, variables, and metadata properties.
* **Configuration Analysis:** Resolves relationships and cross-resource configurations in the HCL source directory.

### 🛡️ Security Assessment
* **Misconfiguration Detection:** Checks for security violations (e.g. wildcard IAM policies, exposed databases, open ingress rules).
* **Severity-Based Classification:** Classes findings into Critical, High, Medium, and Low risk severity levels.
* **Risk Severity Analysis:** Displays actionable descriptions and remediation instructions for every discovered vulnerability.

### 💰 Cost Optimization
* **Resource Cost Analysis:** Projects monthly operational costs for compute instances and EBS volumes prior to provisioning.
* **Savings Recommendations:** Identifies unattached EBS storage volumes and over-provisioned instance sizes.
* **Cost Visibility:** Delivers real-time cost visibility and optimization recommendations within the platform dashboard.

### 🤖 AI Security Advisor
* **Gemini-Powered Recommendations:** Integrates with the Google Gemini API to analyze findings and suggest remediation strategies.
* **Security Guidance:** Provides detailed explanations of why specific configurations are vulnerable.
* **Remediation Suggestions:** Generates secure Terraform HCL snippets that can be directly pasted to resolve issues.

### 📄 PDF Report Generation
* **Compliance PDF Reports:** Compiles findings into beautifully formatted PDF reports using a multi-pass ReportLab engine.
* **Security & Cost Reports:** Generates modular reports detailing security status, cost waste, or full-scope assessments.
* **Dynamic Table Layouts:** Formats pages, total counts, dates, and tables cleanly for printable distributions.

### 👤 Authentication & Session Management
* **Google OAuth 2.0:** Enables secure enterprise SSO login flows.
* **Email & Password Login:** Implements password credentials protected by bcrypt hashing.
* **JWT & Sessions:** Authorizes API requests using stateless JSON Web Tokens (JWT) with secure expiration policies.

### 🏢 Admin Control Center
* **User & Role Management:** Controls user activation, deletion, and role elevation (Admin vs. Standard User).
* **Security Telemetry:** Tracks usage stats, uploaded configuration records, and system analytics.
* **Audit & Login Logs:** Audits detailed user access events, tracking timestamps, IP addresses, and user-agent strings.
* **Failed Login Monitoring:** Logs and tracks failed attempts to identify brute-force attacks.

---

## 🏗️ System Architecture

The following diagram outlines the system architecture of the InfraSight platform:

```
      User Browser (React UI)
                 │
                 │ (HTTP / JWT Auth)
                 ▼
          FastAPI Backend
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
HCL Parser Engine     AI Advisor Module
 (python-hcl2)         (Gemini API)
      │
      ├─────────────────────┐
      ▼                     ▼
Security Scanner      Cost Analyzer
      │                     │
      └──────────┬──────────┘
                 ▼
         Database Connection
      (MySQL 8.0 / SQLite 3)
```

---

## 🛠️ Technology Stack

| Category | Technology | Usage Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Asynchronous single-page UI architecture |
| **Styling** | Tailwind CSS v4, Motion | Clean grid layouts, responsive forms, and micro-animations |
| **Backend** | FastAPI (Python 3.11), Uvicorn | Asynchronous REST API framework |
| **Database** | MySQL 8.0 | Primary relational database for production deployments |
| **Fallback DB** | SQLite | Automatic local development fallback |
| **Authentication** | JWT, Google OAuth 2.0, bcrypt | Secure sessions, SSO authentication, and password security |
| **AI** | Gemini API (`google-generativeai`) | Generates secure IaC remediation configurations |
| **PDF Generation** | ReportLab | Compiles customized audit assessment PDF reports |
| **DevOps** | Docker, Docker Compose | Containerized application builds and multi-container runtime |
| **IaC** | Terraform (v1.5.0) | Automated AWS infrastructure definition and creation |
| **CI/CD** | GitHub Actions | Workflows for testing, image builds, and EC2 deployment |

---

## 🚀 CI/CD & Deployment

InfraSight utilizes structured GitHub Actions workflows for validation and automated deployment:

### 🧪 CI Validation (`ci-validation.yml`)
* Runs code linting (ESLint for the frontend; Ruff for backend Python code).
* Executes backend unit tests using `pytest` (excluding long integration tests).
* Verifies production build assets (React compile and Docker backend build check).

### 🚀 Application Deployment (`application-deploy.yml`)
* Automatically builds production Docker images for the frontend and backend.
* Pushes the built container images to Docker Hub under the tags `latest` and `SHA`.
* Connects to the AWS EC2 instance via SSH, updates the environment variables, pulls the latest Docker images, restarts services, and verifies service health via HTTP status codes.

### 🏗️ Infrastructure Provisioning (`infrastructure-provision.yml`)
* Provisions cloud resources on AWS using HashiCorp Terraform.
* Sets up a secure VPC, Security Groups (ports 22, 80, 443, 8000), EC2 Host, and associates an Elastic IP.

---

## 💾 Database Architecture

* **Primary Database (MySQL 8):** In production and Docker Compose environments, the application uses MySQL to store user data, telemetry, and scan findings.
* **Fallback Database (SQLite):** To simplify local onboarding during development, the application attempts to connect to MySQL first and automatically falls back to a local SQLite database (`infrasight.db`) if MySQL is unavailable.

---

## 🔒 Security Features

* **JWT Sessions:** Authenticates API requests using signed, expiring JSON Web Tokens.
* **Google OAuth:** Protects user authentication against brute-force vectoring using standard Google identity providers.
* **RBAC Enforcement:** Safeguards backend endpoints, requiring Administrator privileges for logs, user tables, and security logs.
* **Failed Login Monitoring:** Records IP addresses and timestamps of failed authentication requests to intercept anomalies.
* **Audit Logs:** Logs system usage events (e.g. running scans, deleting documents, downloading reports) for security auditing.

---

## 💻 Local Setup

### Clone Repository
```bash
git clone https://github.com/YuvarajOfl/Cloud-Guardian.git
cd Cloud-Guardian
```

### Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and supply your JWT_SECRET and GEMINI_API_KEY
uvicorn backend.main:app --reload
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### Docker Setup
To spin up the entire application stack including the MySQL database:
```bash
docker compose up --build
```

---

## 🖼️ Project Screenshots

### Dashboard
![Dashboard Placeholder](https://raw.githubusercontent.com/YuvarajOfl/Cloud-Guardian/main/docs/screenshots/dashboard.png)

### Infrastructure Analysis
![Infrastructure Analysis Placeholder](https://raw.githubusercontent.com/YuvarajOfl/Cloud-Guardian/main/docs/screenshots/analysis.png)

### AI Advisor
![AI Advisor Placeholder](https://raw.githubusercontent.com/YuvarajOfl/Cloud-Guardian/main/docs/screenshots/ai_advisor.png)

### Reports
![Reports Placeholder](https://raw.githubusercontent.com/YuvarajOfl/Cloud-Guardian/main/docs/screenshots/reports.png)

### Admin Control Center
![Admin Control Center Placeholder](https://raw.githubusercontent.com/YuvarajOfl/Cloud-Guardian/main/docs/screenshots/admin.png)

---

## 🎓 Learning Outcomes

* **Cloud Security Analysis:** Applied automated security scanning against Terraform configurations to detect risk vectors.
* **FastAPI Microservices:** Built robust APIs using ASGI servers, SQLAlchemy ORM, and dependency injection.
* **React 19 & TypeScript:** Engineered modular, type-safe components using Tailwind CSS and Framer Motion.
* **Docker Container Orchestration:** Managed multi-container Docker applications and image builds.
* **Continuous Integration/Deployment:** Built complete validation and SSH-based AWS deployment pipelines.
* **Authentication & RBAC:** Implemented JWT security, Google OAuth, and granular role-based authorization rules.

---

## 🔮 Future Enhancements

* **PostgreSQL Support:** Introduce PostgreSQL connection support as an alternative relational database.
* **AWS RDS Integration:** Transition container databases to a fully managed Amazon RDS cluster.
* **S3 Report Storage:** Upload generated PDF compliance reports to a secure AWS S3 bucket.
* **Multi-Tenant Organizations:** Support organization scopes, user groups, and workspace sharing.
* **Advanced Security Rules:** Implement static compliance scanning matching CIS and SOC2 benchmarks.
* **Real-Time Monitoring:** Add real-time event updates and notifications for configuration scans.

---

## 👥 Author

* **Name:** Yuvaraj T
* **GitHub:** [https://github.com/YuvarajOfl](https://github.com/YuvarajOfl)
* **LinkedIn:** [www.linkedin.com/in/yuvaraj8](https://www.linkedin.com/in/yuvaraj8)
