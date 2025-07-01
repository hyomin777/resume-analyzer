import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine

from db.models import metadata
from db.database import get_database
from config import Config

@asynccontextmanager
async def lifespan(app):
    logger.info("Creating tables...")
    engine = create_async_engine(Config.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)

    logger.info("Connecting DB...")
    db = get_database()
    await db.connect()

    yield

    logger.info("Dropping tables...")
    async with engine.begin() as conn:
            await conn.run_sync(metadata.drop_all)

    logger.info("Disconnecting DB...")
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        workers=1
    )
