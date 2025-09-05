def user_helper(user) -> dict:
    return {
        "id" : str(user["_id"]),
        "username": user.get("username", ""),
        "email" : user["email"],
    }