from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import TypeVar, Generic, Type

T = TypeVar("T")

class Repository(Generic[T]):
    def __init__(self, session: AsyncSession, model: Type[T]):
        self.session = session
        self.model = model

    async def add_item(self, item: T) -> T:
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def get_all(self) -> list[T]:
        result = await self.session.execute(select(self.model))
        return result.scalars().all()
