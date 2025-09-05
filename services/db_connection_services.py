from pymongo import MongoClient, errors
from config.db import db
from bson import ObjectId
from schemas.db_schema import db_connection_helper
from fastapi import HTTPException

connections_col = db["db_credentials"]

def build_uri(host, port, username, password, database):
    if host.endswith(".mongodb.net"):
        return f"mongodb+srv://{username}:{password}@{host}/{database}?retryWrites=true&w=majority"
    else:
        return f"mongodb://{username}:{password}@{host}:{port}/{database}?authSource={database}"

def test_connection(uri: str):
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.server_info()  # Trigger a server selection
        return True
    except errors.PyMongoError:
        return False

def save_connection(data, user_id: str):
    uri = build_uri(data.host, data.port, data.username, data.password, data.database)
    if not test_connection(uri):
        raise HTTPException(status_code=400, detail="Connection failed. Please check your credentials and network settings.")
    
    doc = {
        "host": data.host,
        "port": data.port,
        "username": data.username,
        "password": data.password,
        "database": data.database,
        "created_by": ObjectId(user_id)
    }
    result = connections_col.insert_one(doc)
    return db_connection_helper({
        **doc,
        "_id": result.inserted_id
    })
