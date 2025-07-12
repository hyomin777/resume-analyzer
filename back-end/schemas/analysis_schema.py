from datetime import datetime
from pydantic import BaseModel

class AnalysisOut(BaseModel):
    id: int
    user_id: int
    content: dict
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True