from fastapi import Header, HTTPException
from services.auth_service import get_user_by_token

def get_current_user(Authorization: str = Header(...)):
    if not Authorization.startswith("Bearer "):
        raise HTTPEXception(status_code=401, detail="Invalid authorization header format.")
    token = Authorization.split(" ")[1]
    return get_user_by_token(token)