from fastapi import APIRouter
from pydantic import BaseModel
from llm.client import get_llm_response
from llm.prompt import create_prompt

router = APIRouter()

class ResumeInput(BaseModel):
    resume_content: str
    text: str

@router.post("/analyze-resume")
async def upload_resume(payload: ResumeInput):
    prompt = create_prompt(payload.resume_content, payload.text)
    result = await get_llm_response(prompt)
    return {"result": result}