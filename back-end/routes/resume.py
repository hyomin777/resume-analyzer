import httpx
from fastapi import APIRouter, Depends, UploadFile
from db import Repository, get_resume_repository
from db.models import Resume
from utils import extract_text_from_pdf
from config import Config

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile, text: str, repository: Repository = Depends(get_resume_repository)):
    content = await file.read()
    resume_content = extract_text_from_pdf(content)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=Config.AI_SERVER_URL + "/analyze-resume",
            json={"resume_content": resume_content, "text": text}
        )
        result = response.json()

    resume = Resume(resume_content, text)
    await repository.add_item(resume)
    return {"result": result}