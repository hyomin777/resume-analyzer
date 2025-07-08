from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from db import get_session
from db.repositories import Repository
from db.models import Feedback

class FeedbackRepository(Repository[Feedback]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Feedback)

def get_feedback_repository(session: AsyncSession = Depends(get_session)) -> FeedbackRepository:
    return FeedbackRepository(session)