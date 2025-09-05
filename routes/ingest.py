from fastapi import APIRouter, Depends
from services import ingestion_service
from utils.deps import get_current_user

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

@router.post("/mongodb/{connection_id}")
def ingest_mongo_metadata(connection_id: str, current_user: dict = Depends(get_current_user)):
    return ingestion_service.ingest_metadata(connection_id, current_user["id"])


