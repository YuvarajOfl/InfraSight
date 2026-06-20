from pydantic import BaseModel, field_serializer
from datetime import datetime, timezone
from typing import List, Any, Optional

class TerraformResourceResponse(BaseModel):
    id: int
    file_id: int
    resource_type: str
    resource_name: str
    provider: str
    region: str
    resource_metadata: Optional[Any] = None
    status: str

    class Config:
        from_attributes = True


class SecurityFindingResponse(BaseModel):
    id: int
    user_id: int
    file_id: int
    resource_name: str
    resource_type: str
    severity: str
    title: str
    description: str
    recommendation: str
    created_at: datetime

    class Config:
        from_attributes = True

    @field_serializer('created_at')
    def serialize_created_at(self, created_at: datetime, _info):
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        return created_at.astimezone(timezone.utc).isoformat()


class CostFindingResponse(BaseModel):
    id: int
    user_id: int
    file_id: int
    resource_name: str
    resource_type: str
    estimated_monthly_cost: float
    title: str
    description: str
    recommendation: str
    created_at: datetime

    class Config:
        from_attributes = True

    @field_serializer('created_at')
    def serialize_created_at(self, created_at: datetime, _info):
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        return created_at.astimezone(timezone.utc).isoformat()


class TerraformFileResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    file_type: str
    upload_time: datetime
    status: str
    resources: List[TerraformResourceResponse] = []
    findings: List[SecurityFindingResponse] = []
    cost_findings: List[CostFindingResponse] = []

    class Config:
        from_attributes = True

    @field_serializer('upload_time')
    def serialize_upload_time(self, upload_time: datetime, _info):
        if upload_time.tzinfo is None:
            upload_time = upload_time.replace(tzinfo=timezone.utc)
        return upload_time.astimezone(timezone.utc).isoformat()


