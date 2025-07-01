from databases import Database
from config import Config

DATABASE = Database(Config.DATABASE_URL)

def get_database():
    return DATABASE