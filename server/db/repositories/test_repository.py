from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from db import Repository, get_session
from db.models import Test

class TestRepository(Repository[Test]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Test)

def get_test_repository(session: AsyncSession = Depends(get_session)) -> TestRepository:
    return TestRepository(session)