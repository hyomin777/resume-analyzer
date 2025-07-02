import httpx
from fastapi import APIRouter, Depends, UploadFile, File, Form
from db import Repository, get_resume_repository
from db.models import Resume
from utils import extract_text_from_pdf
from config import Config

router = APIRouter()

@router.post("/api/upload-resume")
async def upload_resume(
    file: UploadFile = File(...), 
    text: str = Form(...),
    repository: Repository = Depends(get_resume_repository),
):
    content = await file.read()
    resume_content = extract_text_from_pdf(content)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=Config.AI_SERVER_URL + "/api/analyze-resume",
            json={"resume_content": resume_content, "text": text},
            timeout=120
        )
        result = response.json()

    resume = Resume(
        resume_content=resume_content,
        text=text
    )
    await repository.add_item(resume)
    return {"result": result}