from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel
from llm.client import get_llm_response
from llm.prompt import create_user_prompt
from vector_db import get_vector_db_client, get_embedding, add_embedding

router = APIRouter()

class ResumeInput(BaseModel):
    resume_content: str
    text: str

@router.post("/api/resume")
async def analyze_resume(
    content: str = Body(...),
    jd_description: str = Body(default=None)
):
    prompt = create_user_prompt(content, jd_description)
    result = await get_llm_response(prompt)
    return {"result": result}


@router.post("/api/feedback")
async def upload_feedback(
    id: int = Body(...),
    feedback: str = Body(...),
    payload: dict = Body(...),
    vector_db_client = Depends(get_vector_db_client)
):
    embedding = get_embedding(feedback)
    add_embedding(vector_db_client, id, embedding, payload)