from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from db import Repository, get_session
from db.models import Resume

class ResultRepository(Repository[Resume]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Resume)

def get_result_repository(session: AsyncSession = Depends(get_session)) -> ResultRepository:
    return ResultRepository(session)