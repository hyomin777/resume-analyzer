from fastapi import APIRouter
from routes.analysis import analysis_router
from routes.feedback import feedback_router
from routes.resume import resume_router
from routes.user import user_router

router = APIRouter(prefix="/api")
router.include_router(analysis_router)
router.include_router(feedback_router)
router.include_router(resume_router)
router.include_router(user_router)

__all__ = [
    "router"
]