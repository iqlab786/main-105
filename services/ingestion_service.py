from pymongo import MongoClient, errors
from bson import ObjectId
from config.db import db
from schemas.metadata_schema import metadata_helper
from fastapi import HTTPException

connections_col = db["db_credentials"]  # <- fixed typo
metadata_col = db["metadata"]

def build_uri(host, port, username, password, database):
    if host.endswith("mongodb.net"):
        return f"mongodb+srv://{username}:{password}@{host}/{database}?retryWrites=true&w=majority"
    else:
        return f"mongodb://{username}:{password}@{host}:{port}/{database}?authSource={database}"

def infer_fields(documents):
    fields = {}
    for doc in documents:
        for key, value in doc.items():
            if key not in fields:
                fields[key] = type(value).__name__
    return [{"name": k, "type": v} for k, v in fields.items()]

def ingest_metadata(connection_id: str, user_id: str):
    conn = connections_col.find_one({
        "_id": ObjectId(connection_id),
        "created_by": ObjectId(user_id)   # <- fixed typo
    })
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found or unauthorized.")

    uri = build_uri(conn["host"], conn["port"], conn["username"], conn["password"], conn["database"])

    try:
        client = MongoClient(uri)
        database = client[conn["database"]]
        collections = database.list_collection_names()
    except errors.PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

    results = []

    for coll_name in collections:
        collection = database[coll_name]
        sample_docs = list(collection.find().limit(20))
        field_info = infer_fields(sample_docs)
        doc = {
            "connection_id": ObjectId(connection_id),
            "database": conn["database"],
            "collection": coll_name,
            "fields": field_info,
            "created_by": ObjectId(user_id)
        }
        inserted = metadata_col.insert_one(doc)
        results.append(metadata_helper({
            **doc,
            "_id": inserted.inserted_id
        }))

    return results
