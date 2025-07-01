import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Qdrant
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

    # DataBase
    DATABASE_URL = os.getenv("DATABASE_URL")


