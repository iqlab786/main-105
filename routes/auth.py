from fastapi import APIRouter, HTTPException, Depends, Header
from models.user_models import RegisterRequest, LoginRequest, TokenOut, UserOut
from services import auth_service


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut)
def register(data: RegisterRequest):
    return auth_service.register_user(data.username, data.email, data.password)

@router.post("/login", response_model=TokenOut)
def login(data: LoginRequest):
    token = auth_service.login_user(data.username, data.password)
    return TokenOut(access_token=token)

@router.get("/me", response_model=UserOut)
def get_me(Authorization: str = Header(...)):
    if not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = Authorization.split(" ")[1]
    return auth_service.get_user_by_token(token)
