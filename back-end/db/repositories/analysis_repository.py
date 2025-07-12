from typing import Optional, List, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, Depends
from db import get_session
from db.repositories import Repository
from db.models import Analysis


class AnalysisRepository(Repository[Analysis]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Analysis)


    async def get_analysis(
        self,
        user_id: int,
        analysis_id: Optional[int] = None,
        is_active: bool = True
    ) -> Union[Analysis, List[Analysis], None]:
        if analysis_id is not None:
            stmt = select(Analysis).where(
                Analysis.id == analysis_id,
                Analysis.user_id == user_id,
                Analysis.is_active == is_active
            )
        else:
            stmt = select(Analysis).where(
                Analysis.user_id == user_id,
                Analysis.is_active == is_active
            )
        
        result = await self.session.execute(stmt)
        if analysis_id is not None:
            return result.scalars().first()
        else:
            return result.scalars().all()
        
    async def deactivate_analysis(self, user_id: int, analysis_id: int):
        stmt = select(Analysis).where(
            Analysis.id == analysis_id,
            Analysis.user_id == user_id,
            Analysis.is_active == True
        )
        result = await self.session.execute(stmt)
        analysis = result.scalars().first()
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found or already inactive")
        analysis.is_active = False
        return analysis 
    

def get_analysis_repository(session: AsyncSession = Depends(get_session)) -> AnalysisRepository:
    return AnalysisRepository(session)