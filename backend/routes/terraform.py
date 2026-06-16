from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.session import get_db
from backend.models.user import User
from backend.routes.auth import get_current_user
from backend.schemas.terraform import TerraformFileResponse, TerraformResourceResponse
from backend.services import terraform_service

router = APIRouter(prefix="/api", tags=["Terraform Analyzer"])

@router.post("/upload", response_model=TerraformFileResponse, status_code=status.HTTP_201_CREATED)
async def upload_terraform_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts, validates, and parses a terraform.tfstate, .tfstate, or .json file.
    Saves parsed cloud resources in MySQL.
    """
    try:
        contents = await file.read()
        db_file = terraform_service.validate_and_parse_terraform(
            db=db,
            user_id=current_user.id,
            file_name=file.filename,
            file_contents=contents
        )
        return db_file
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file upload: {str(exc)}"
        )

@router.get("/files", response_model=List[TerraformFileResponse])
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns metadata and status of all uploaded Terraform files belonging to the logged-in user.
    """
    return terraform_service.get_user_files(db, current_user.id)

@router.delete("/files/{id}", status_code=status.HTTP_200_OK)
async def delete_file(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes the file record from the database and cleans up resources via cascading.
    """
    deleted = terraform_service.delete_user_file(db, id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found or access denied."
        )
    return {"success": True, "message": "File and discovered resources deleted successfully."}

@router.get("/resources", response_model=List[TerraformResourceResponse])
async def get_all_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns all parsed cloud resources for all files uploaded by the logged-in user.
    """
    return terraform_service.get_user_resources(db, current_user.id)

@router.get("/resources/{file_id}", response_model=List[TerraformResourceResponse])
async def get_resources_by_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns all parsed cloud resources discovered in a specific Terraform file.
    """
    # Verify file ownership first
    file_record = terraform_service.get_file_by_id(db, file_id, current_user.id)
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found or access denied."
        )
    return terraform_service.get_file_resources(db, file_id, current_user.id)
