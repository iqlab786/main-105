from fastapi import APIRouter, Depends, Path
from models.enrichment_models import CollectionEnrichmentRequest, FieldEnrichmentRequest
from services import metadata_service
from utils.deps import get_current_user
from fastapi import HTTPException

router = APIRouter(prefix="/metadata", tags=["Metadata Enrichment"])

@router.patch("/{metadata_id}/collection")
def enrich_collection(
    metadata_id: str,
    data: CollectionEnrichmentRequest,
    current_user: dict = Depends(get_current_user)
):
    return metadata_service.enrich_collection(metadata_id, current_user["id"], data.dict(exclude_none=True))

@router.patch("/{metadata_id}/field/{field_name}")
def enrich_field(
    metadata_id: str,
    field_name: str,
    data: FieldEnrichmentRequest,
    current_user: dict = Depends(get_current_user)
):
    return metadata_service.enrich_field(metadata_id, field_name, current_user["id"], data.dict(exclude_none=True))

@router.post("/{metadata_id}/auto-pii")
def auto_pii_tag(
    metadata_id: str,
    current_user: dict = Depends(get_current_user)
):
    return metadata_service.auto_tag_pii(metadata_id, current_user["id"])

#for view enrich data 

@router.get("/{metadata_id}")
def get_metadata(
    metadata_id: str,
    current_user: dict = Depends(get_current_user)
):
    metadata = metadata_service.get_metadata(metadata_id, current_user["id"])
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found")
    return metadata

@router.get("/collection/{collection_name}")
def get_metadata_by_collection(
    collection_name: str,
    current_user: dict = Depends(get_current_user)
):
    metadata = metadata_service.get_metadata_by_collection(collection_namse, current_user["id"])
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found")
    return metadata
