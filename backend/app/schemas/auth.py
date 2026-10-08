from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.core.constants import UserRole
class RegisterRequest(BaseModel): email:EmailStr; password: str=Field(min_length=8,max_length=128)
class LoginRequest(BaseModel): email:EmailStr; password:str=Field(min_length=1,max_length=128)
class UserResponse(BaseModel): model_config=ConfigDict(from_attributes=True); id:UUID; email:EmailStr; role:UserRole; is_active:bool
class TokenResponse(BaseModel): access_token:str; token_type:str='bearer'; user:UserResponse
