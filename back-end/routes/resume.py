import httpx
from fastapi import APIRouter, UploadFile, Depends, Header, File, Form, Body
from fastapi.exceptions import HTTPException
from db import Repository, get_resume_repository, get_result_repository
from db.models import Resume, Result
from utils import extract_text_from_pdf, get_current_user_id
from config import Config

resume_router = APIRouter()

@resume_router.post("/upload-resume")
async def upload_resume(
    authorization: str = Header(...),
    file: UploadFile = File(...), 
    text: str = Form(...),
    repository: Repository = Depends(get_resume_repository),
):
    user_id = get_current_user_id(authorization)

    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF files are supported."}
    
    content = await file.read()
    resume_content = extract_text_from_pdf(content)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=Config.AI_SERVER_URL + "/api/analyze-resume",
            json={"resume_content": resume_content, "text": text},
            timeout=120
        )
        if response.status_code != 200:
            return {"error": "AI server analyze resume failed",}

        result = response.json()

    resume = Resume(
        user_id=int(user_id),
        resume_content=resume_content,
        text=text
    )
    await repository.add_item(resume)
    return {"result": result}

@resume_router.post("/save-result")
async def save_result(
    authorization: str = Header(...),
    body: dict = Body(...),
    repository: Repository = Depends(get_result_repository),
):
    result = Result(
        user_id=int(get_current_user_id(authorization)),
        result=body
    )
    result = await repository.add_item(result)
    return {"result": result}