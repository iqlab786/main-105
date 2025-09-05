from pydantic import BaseModel, Field
from typing import Optional

class MongoConnectionRequest(BaseModel):
    host: str 
    port: Optional[int] = None
    username: str
    password: str
    database: str
