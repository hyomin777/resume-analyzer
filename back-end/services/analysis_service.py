from typing import Optional, Union, List
from fastapi import Depends
from db.repositories import AnalysisRepository, get_analysis_repository
from db.models import Analysis


class AnalysisService:
    def __init__(self, repo: AnalysisRepository):
        self.repo = repo

    
    async def create_analysis(self, user_id: int, analysis_data: dict):
        analysis = Analysis(
            user_id=user_id,
            content=analysis_data
        )
        result = await self.repo.add_item(analysis)
        return result


    async def get_analysis(
        self,
        user_id: int,
        analysis_id: Optional[int] = None,
        is_active: bool = True
    ) -> Union[Analysis, List[Analysis], None]:
        return await self.repo.get_analysis(user_id, analysis_id, is_active)
    

    async def deactivate_analysis(self, user_id: int, analysis_id: int):
        async with self.repo.session.begin():
            analysis = await self.repo.deactivate_analysis(user_id, analysis_id)
        return analysis


def get_analysis_service(
    repo: AnalysisRepository = Depends(get_analysis_repository)
) -> AnalysisService:
    service = AnalysisService(repo)
    return service