from typing import List
from pydantic import BaseModel, Field

class QuestionItem(BaseModel):
    category: str
    question: str
    preparation: List[str] = Field(default_factory=list)
    checkpoints: List[str] = Field(default_factory=list)


class Questions(BaseModel):
    questions: List[QuestionItem] = Field(default_factory=list)