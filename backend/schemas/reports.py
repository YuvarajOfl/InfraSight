from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReportGenerateRequest(BaseModel):
    file_id: int
    report_type: str  # "Executive Summary" | "Security Audit" | "Cost Optimization Report" | "Complete Assessment"

class ReportResponse(BaseModel):
    id: int
    user_id: int
    file_id: Optional[int] = None
    file_name: Optional[str] = None
    report_name: str
    report_type: str
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True
