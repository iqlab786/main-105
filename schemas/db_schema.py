def db_connection_helper(doc):
    return{
        "id": str(doc["_id"]),
        "host": doc["host"],
        "post": doc["port"],
        "username": doc["username"],
        "databse": doc["database"],
        "created_by": str(doc["created_by"])
    }