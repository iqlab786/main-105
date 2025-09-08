from bson import ObjectId
from fastapi import HTTPException
from config.db import db
from utils.pii_tagger import is_pii_field

metadata_col = db["metadata"]

def convert_objectid_to_str(doc):
    from bson import ObjectId
    if isinstance(doc, dict):
        return {k: convert_objectid_to_str(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [convert_objectid_to_str(i) for i in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc


def enrich_collection(metadata_id: str, user_id: str, update_data: dict):
    entry = metadata_col.find_one({"_id": ObjectId(metadata_id), "created_by": ObjectId(user_id)})
    if not entry:
        raise HTTPException(status_code=404, detail="Metadata not found or unauthorized.")

    update_fields = {}
    if "description" in update_data:
        update_fields["description"] = update_data["description"]
    if "tags" in update_data:
        update_fields["tags"] = update_data["tags"]
    if "owner" in update_data:
        update_fields["owner"] = update_data["owner"]

    metadata_col.update_one({"_id": ObjectId(metadata_id)}, {"$set": update_fields})
    return {"msg": "Collection enriched successfully."}

def enrich_field(metadata_id: str, field_name: str, user_id: str, update_data: dict):
    entry = metadata_col.find_one({"_id": ObjectId(metadata_id), "created_by": ObjectId(user_id)})
    if not entry:
        raise HTTPException(status_code=404, detail="Metadata not found or unauthorized.")

    updated_fields = []
    found = False
    for field in entry["fields"]:
        if field["name"] == field_name:
            if "description" in update_data:
                field["description"] = update_data["description"]
            if "tags" in update_data:
                field["tags"] = update_data["tags"]
            found = True
        updated_fields.append(field)

    if not found:
        raise HTTPException(status_code=404, detail=f"Field '{field_name}' not found in metadata.")

    metadata_col.update_one({"_id": ObjectId(metadata_id)}, {"$set": {"fields": updated_fields}})
    return {"msg": f"Field '{field_name}' enriched successfully."}

def auto_tag_pii(metadata_id: str, user_id: str):
    entry = metadata_col.find_one({"_id": ObjectId(metadata_id), "created_by": ObjectId(user_id)})
    if not entry:
        raise HTTPException(status_code=404, detail="Metadata not found or unauthorized.")

    updated_fields = []
    for field in entry["fields"]:
        tags = field.get("tags", [])
        if is_pii_field(field["name"], field.get("type", "")) and "PII" not in tags:
            tags.append("PII")
        field["tags"] = tags
        updated_fields.append(field)

    metadata_col.update_one({"_id": ObjectId(metadata_id)}, {"$set": {"fields": updated_fields}})
    return {"msg": "PII tags added where applicable."}

#for view enrich data
def get_metadata(metadata_id: str, user_id: str):
    entry = metadata_col.find_one(
        {"_id": ObjectId(metadata_id), "created_by": ObjectId(user_id)}
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Metadata not found or unauthorized.")

    # Convert ObjectId → str so frontend JSON is clean
    entry = convert_objectid_to_str(entry)  # ✅ fix
    return entry


def get_metadata_by_collection(collection_name: str, user_id: str):
    entry = metadata_col.find_one(
        {"collection_name": collection_name, "created_by": ObjectId(user_id)}
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Metadata not found or unauthorized.")

    entry = convert_objectid_to_str(entry)  # ✅ fix
    return entry