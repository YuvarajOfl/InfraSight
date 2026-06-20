from pydantic import BaseModel, EmailStr
from backend.schemas.user import UserResponse

class GoogleLoginRequest(BaseModel):
    google_token: str

class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

