import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from vector_db import get_vector_db_client, load_vector_db
from routes.analyze import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading vector db...")
    load_vector_db(get_vector_db_client())
    yield
    logger.info("Closing server...")

app = FastAPI(lifespan=lifespan)
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        workers=1
    )
