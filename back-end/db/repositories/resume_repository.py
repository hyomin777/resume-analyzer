from typing import Optional, List, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from fastapi import HTTPException, Depends
from db import get_session
from db.repositories import Repository
from db.models import Resume


class ResumeRepository(Repository[Resume]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Resume)


    async def add_resume_with_relations(self, resume: Resume) -> Resume:
        self.session.add(resume)
        await self.session.flush()
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


    async def get_resume(
            self,
            user_id: int,
            resume_id: Optional[int] = None,
            is_active: bool = True
    ) -> Union[Resume, List[Resume], None]:
        if resume_id is not None:
            stmt = select(Resume).where(
                Resume.id == resume_id,
                Resume.user_id == user_id,
                Resume.is_active == is_active
            )
        else:
            stmt = select(Resume).where(
                Resume.user_id == user_id,
                Resume.is_active == is_active
            )

        result = await self.session.execute(stmt)
        if resume_id is not None:
            return result.scalars().first()
        else:
            return result.scalars().all()


    async def get_resume_with_relations(
        self,
        user_id: int,
        resume_id: Optional[int] = None,
        is_active: bool = True
    ) -> Union[Resume, List[Resume], None]:
        if resume_id is not None:
            stmt = select(Resume).where(
                Resume.id == resume_id,
                Resume.user_id == user_id,
                Resume.is_active == is_active
            )
        else:
            stmt = select(Resume).where(
                Resume.user_id == user_id,
                Resume.is_active == is_active
            )

        result = await self.session.execute(stmt.options(
            selectinload(Resume.education),
            selectinload(Resume.career),
            selectinload(Resume.certificate),
            selectinload(Resume.activity),
            selectinload(Resume.skills),
        ))
        if resume_id is not None:
            return result.scalars().first()
        else:
            return result.scalars().all()


    async def deactivate_resume(self, user_id: int, resume_id: int):
        stmt = (
            select(Resume)
            .where(
                Resume.id == resume_id,
                Resume.user_id == user_id,
                Resume.is_active == True
            )
        )
        result = await self.session.execute(stmt)
        resume = result.scalars().first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found or already inactive")
        resume.is_active = False
        return resume


def get_resume_repository(session: AsyncSession = Depends(get_session)) -> ResumeRepository:
    return ResumeRepository(session)
