import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # DataBase
    DATABASE_URL = os.getenv("DATABASE_URL")

    # AI server
    AI_SERVER_URL = os.getenv("AI_SERVER_URL")

    # Access token
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRE_MINUTES = 60

