from fastapi import APIRouter
from routes.resume import resume_router
from routes.user import user_router

router = APIRouter(prefix="/api")
router.include_router(resume_router)
router.include_router(user_router)

__all__ = [
    'router'
]