from fastapi import APIRouter, Depends
from models.db_models import MongoConnectionRequest
from services import db_connection_services
from utils.deps import get_current_user
from config.db import db
router = APIRouter(prefix = "/db", tags=["Database"])
connections_col = db["db_credentials"]
from bson import ObjectId

@router.post("/connect")
def connect_to_mongo(
    data: MongoConnectionRequest,
    current_user: dict = Depends(get_current_user)
):
    return db_connection_services.save_connection(data, current_user["id"])

@router.get("/connections")
def list_user_connections(current_user: dict = Depends(get_current_user)):
    """List all database connections for the current user"""
    try:
        connections = connections_col.find({"created_by": ObjectId(current_user["id"])})
        
        return [
            {
                "id": str(conn["_id"]),
                "host": conn["host"],
                "port": conn.get("port"),
                "database": conn["database"],
                "username": conn["username"],
                "created_by": str(conn["created_by"])
            }
            for conn in connections
        
        ]
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))
