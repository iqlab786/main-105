from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"