import httpx
from typing import Optional
from fastapi import APIRouter, Depends, Header, Body
from fastapi.exceptions import HTTPException
from db.models import Feedback
from db.repositories import Repository, get_feedback_repository
from utils import get_current_user_id
from config import Config

feedback_router = APIRouter()

@feedback_router.post("/feedback")
async def upload_feedback(
    authorization: str = Header(...), 
    resume_content: str = Body(...),
    jd_description: Optional[str] = Body(default=None),
    feedback: Optional[str] = Body(default=None), 
    label: Optional[str] = Body(default=None),
    repository: Repository = Depends(get_feedback_repository),
):
    user_id = get_current_user_id(authorization)
    feedback = Feedback(
        user_id=int(user_id),
        resume_content=resume_content,
        jd_description=jd_description,
        feedback=feedback,
        label=label
    )
    feedback = await repository.add_item(feedback)
    feedback_text = f"[Resume] {resume_content} [JD]:{jd_description} [Feedback]:{feedback}"

    payload = {
        "user_id": user_id,
        "label": label,
        "created_at": feedback.created_at.isoformat()
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=Config.AI_SERVER_URL + "/api/feedback",
            json={"id": feedback.id, "feedback": feedback_text, "payload": payload},
            timeout=120
        )
        if response.status_code != 200:
            return {"error": "Uploading feedback to AI server failed",}    

    return {"result": feedback}