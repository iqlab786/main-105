import jwt
from config.settings import settings

def create_token(data: dict):
    token = jwt.encode(data, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token

def decode_token(token: str):
    try:
        decoded_data = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return decoded_data
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
