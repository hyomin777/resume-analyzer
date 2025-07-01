from fastapi import Depends
from databases import Database
from db.models import TEST_TABLE
from db.database import get_database

class TestRepository:
    def __init__(self, database: Database):
        self.database = database
        self.table = TEST_TABLE

    async def add_test(self, user_id: int, content: str):
        query = self.table.insert().values(
            user_id=user_id,
            content=content
        )
        return await self.database.execute(query)

    async def get_tests(self):
        query = self.table.select()
        return await self.database.fetch_all(query)


def get_test_repository(database=Depends(get_database)) -> TestRepository:
    return TestRepository(database)