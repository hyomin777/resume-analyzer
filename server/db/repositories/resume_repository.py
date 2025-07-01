from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from db import Repository, get_session
from db.models import Resume

class ResumeRepository(Repository[Resume]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Resume)

def get_resume_repository(session: AsyncSession = Depends(get_session)) -> ResumeRepository:
    return ResumeRepository(session)