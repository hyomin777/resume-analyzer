import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.database import engine
from db.models import Base
from routes.resume import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    logger.info("Dropping tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

app = FastAPI(lifespan=lifespan)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        workers=1
    )
