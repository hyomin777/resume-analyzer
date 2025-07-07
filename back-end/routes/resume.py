import httpx
from fastapi import APIRouter, UploadFile, Depends, Header, File, Form, Body
from fastapi.exceptions import HTTPException
from db import Repository, get_resume_repository, get_result_repository
from db.models import Resume, Result
from utils import extract_text_from_pdf, get_current_user_id
from config import Config

resume_router = APIRouter()

@resume_router.post("/resume")
async def upload_resume(
    authorization: str = Header(...),
    file: UploadFile = File(...), 
    jd_description: str = Form(default=None),
    repository: Repository = Depends(get_resume_repository),
):
    user_id = get_current_user_id(authorization)

    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF files are supported."}
    
    resume = await file.read()
    content = extract_text_from_pdf(resume)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=Config.AI_SERVER_URL + "/api/resume",
            json={
                "content": content,
                "jd_description": jd_description
            },
            timeout=120
        )
        if response.status_code != 200:
            return {"error": "AI server analyze resume failed",}

        result = response.json()

    resume = Resume(
        user_id=int(user_id),
        content=content,
        jd_description=jd_description
    )
    await repository.add_item(resume)
    return {"result": result}


@resume_router.post("/result")
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


@resume_router.get("/results")
async def get_results(
    authorization: str = Header(...),
    repository: Repository = Depends(get_result_repository)
):
    results = await repository.get_all_by_user_id(int(get_current_user_id(authorization)))
    return {"result": [{"id": r.id, "user_id": r.user_id, "result": r.result} for r in results]}