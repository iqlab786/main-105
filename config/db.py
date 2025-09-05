# app/config/db.py
from pymongo import MongoClient
from config.settings import settings

client = MongoClient(settings.mongo_uri)
db = client["metadata_catalog"]