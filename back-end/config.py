import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # DataBase
    DATABASE_URL = os.getenv("DATABASE_URL")

    # AI server
    AI_SERVER_URL = os.getenv("AI_SERVER_URL")


