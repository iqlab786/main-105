from pydantic import BaseModel
from typing import Optional, List

class CollectionEnrichmentRequest(BaseModel):
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    owner: Optional[str] = None

class FieldEnrichmentRequest(BaseModel):
    description: Optional[str] = None
    tags: Optional[List[str]] = None
