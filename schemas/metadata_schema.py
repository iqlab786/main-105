def metadata_helper(entry):
    return {
        "id": str(entry["_id"]),
        "connection_id": str(entry["connection_id"]),
        "database": entry["database"],
        "collection": entry["collection"],
        "fields": entry["fields"],
        "created_by": str(entry["created_by"])
    }