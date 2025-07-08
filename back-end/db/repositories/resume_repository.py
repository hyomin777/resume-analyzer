from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from fastapi import Depends
from db import get_session
from db.repositories import Repository
from db.models import Resume

class ResumeRepository(Repository[Resume]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Resume)

    async def add_resume_with_relations(self, resume: Resume) -> Resume:
        self.session.add(resume)
        await self.session.commit()
        result = await self.session.execute(
            select(Resume)
            .where(Resume.id == resume.id)
            .options(
                selectinload(Resume.education),
                selectinload(Resume.career),
                selectinload(Resume.certificate),
                selectinload(Resume.activity),
                selectinload(Resume.skills),
            )
        )
        return result.scalars().first()

    async def get_resume_with_relations(self, resume_id: int, user_id: int):
        result = await self.session.execute(
            select(Resume)
            .where(Resume.id == resume_id, Resume.user_id == user_id)
            .options(
                selectinload(Resume.education),
                selectinload(Resume.career),
                selectinload(Resume.certificate),
                selectinload(Resume.activity),
                selectinload(Resume.skills),
            )
        )
        resume = result.scalars().first()
        return resume

def get_resume_repository(session: AsyncSession = Depends(get_session)) -> ResumeRepository:
    return ResumeRepository(session)