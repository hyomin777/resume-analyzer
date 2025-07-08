from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
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

    async def get_item(self, id: int) -> T | None:
        stmt = select(self.model).where(self.model.id == id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_by_user_id(self, user_id: int) -> list[T]:
        stmt = select(self.model).where(self.model.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()
    
    async def count_by_user_id(self, user_id: int) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(self.model).where(self.model.user_id == user_id)
        )
        return result.scalar()
