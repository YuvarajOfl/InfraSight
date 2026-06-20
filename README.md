# InfraSight

InfraSight is a secure, production-grade security and cost analysis platform for Terraform configurations.

## Repository Structure

- `backend/`: FastAPI backend implementation containing controllers, routes, schemas, models, and scanner/cost service layers.
- `frontend/`: React + Vite application, including components and CSS styling.
- `database/`: Database storage directory, housing database models and migrations.
- `docs/`: Future documentation and architecture logs.
- `terraform/`: Workspace containing sample Terraform configurations, HCL files, and examples.
- `uploads/`: Temporary files, scanned resources, and uploaded configurations storage.

## Getting Started

### Local Development

1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn backend.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Compose

Build and launch the complete stack with:
```bash
docker-compose up --build
```
