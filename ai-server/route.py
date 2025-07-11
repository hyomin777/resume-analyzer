from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel
from llm.client import get_llm_response, get_llm_client
from llm.prompt import ResumeAnalysisPrompt, QuestionPrompt
from vector_db import get_vector_db_client, get_embedding, add_embedding
from schemas import ResumeAnalysis, Questions
from utils import is_valid_jd

router = APIRouter()

class ResumeInput(BaseModel):
    resume_content: str
    text: str

@router.post("/api/resume", response_model=ResumeAnalysis)
async def analyze_resume(
    content: str = Body(...),
    jd_description: str = Body(default=None)
):
    if not is_valid_jd(jd_description):
        jd_description = None
    system_prompt = ResumeAnalysisPrompt.system_prompt()
    user_prompt = ResumeAnalysisPrompt.user_prompt(content, jd_description)
    result = await get_llm_response(system_prompt, user_prompt, ResumeAnalysis)
    return result


@router.post("/api/question", response_model=Questions)
async def generate_interview_questions(
    content: str = Body(...),
    jd_description: str = Body(default=None)
):
    if not is_valid_jd(jd_description):
        return {"result": []}
    system_prompt = QuestionPrompt.system_prompt()
    user_prompt = QuestionPrompt.user_prompt(content, jd_description)
    result = await get_llm_response(system_prompt, user_prompt, Questions)
    return result


@router.post("/api/feedback")
async def upload_feedback(
    id: int = Body(...),
    feedback: str = Body(...),
    payload: dict = Body(...),
    llm_client = Depends(get_llm_client),
    vector_db_client = Depends(get_vector_db_client)
):
    embedding = get_embedding(llm_client, feedback)
    add_embedding(vector_db_client, id, embedding, payload)