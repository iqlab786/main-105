from config.db import db
from utils.password import hashed_password, verify_password
from utils.jwt_handler import create_token, decode_token
from schemas.user_schema import user_helper
from fastapi import HTTPException
from bson import ObjectId


users_col = db["users"]

def register_user(username: str, email: str, password: str):
    # Check if email or username already exists
    if users_col.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered.")
    if users_col.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already taken.")
        
    hashed_pw = hashed_password(password)
    user = {
        "username": username,
        "email": email,
        "password": hashed_pw
    }    
    result = users_col.insert_one(user)
    return user_helper({
        **user,
        "_id": result.inserted_id
    })

def login_user(username: str, password: str):
    user = users_col.find_one({"username": username})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials.")
    token = create_token({
        "user_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    })
    return token

def get_user_by_token(token: str):
    payload = decode_token(token)
    user = users_col.find_one({"_id": ObjectId(payload["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_helper(user)