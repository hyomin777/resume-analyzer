import httpx
from typing import Optional, List
from fastapi import APIRouter, UploadFile, Depends, Header, File, Form, Body
from fastapi.exceptions import HTTPException
from db.models import Result
from db.repositories import ResultRepository, get_result_repository
from services import ResumeService, get_resume_service
from schemas import ResumeCreate, ResumeOut, ResumeWithRelationsOut
from utils import get_current_user_id
from config import Config

resume_router = APIRouter()


@resume_router.post("/resume", response_model=ResumeWithRelationsOut)
async def create_resume(
    resume: ResumeCreate,
    service: ResumeService = Depends(get_resume_service),
    authorization: str = Header(...),
):
    try:
        user_id = int(get_current_user_id(authorization))
        result = await service.create_resume(user_id, resume)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@resume_router.get("/resume/{resume_id}", response_model=ResumeWithRelationsOut)
async def get_resume(
    resume_id: int,
    service: ResumeService = Depends(get_resume_service),
    authorization: str = Header(...),
):
    try:
        user_id = int(get_current_user_id(authorization))
        resume = await service.get_resume_with_relations(user_id=user_id, resume_id=resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        return resume
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@resume_router.get("/resumes", response_model=List[ResumeOut])
async def get_resumes(
    service: ResumeService = Depends(get_resume_service),
    authorization: str = Header(...)
):
    try:
        user_id = int(get_current_user_id(authorization))
        resumes = await service.get_resume(user_id)
        return resumes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@resume_router.patch("/resume/{resume_id}", response_model=ResumeOut)
async def patch_resume(
    resume_id: int,
    resume: ResumeCreate,
    service: ResumeService = Depends(get_resume_service),
    authorization: str = Header(...)
):
    try:
        user_id = int(get_current_user_id(authorization))
        result = await service.patch_resume(user_id, resume_id, resume)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@resume_router.patch("/resume/{resume_id}/deactivate", response_model=ResumeOut)
async def deactivate_resume(
    resume_id: int,
    service: ResumeService = Depends(get_resume_service),
    authorization: str = Header(...)
):
    try:
        user_id = int(get_current_user_id(authorization))
        result = await service.deactivate_resume(user_id, resume_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@resume_router.post("/resume/analysis")
async def analyze_resume(
    authorization: str = Header(...),
    file: Optional[UploadFile] = File(None),
    resume_id: Optional[int] = Form(None),
    jd_description: Optional[str] = Form(None),
    service: ResumeService = Depends(get_resume_service)
):
    user_id = int(get_current_user_id(authorization))

    if file:
        if not file.filename.lower().endswith(".pdf"):
            return {"error": "Only PDF files are supported."}
        pdf_bytes = await file.read()
        resume = await service.create_resume_from_pdf(user_id, pdf_bytes)
        content = resume.content

    elif resume_id is not None:
        content = await service.build_resume_content(user_id, resume_id)

    else:
        raise HTTPException(status_code=400, detail="You must select a PDF file or resume")

    # Request analyzing to AI server
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
            return {"error": "AI server analyze resume failed"}
        result = response.json()

    return {"result": result}


@resume_router.post("/resume/question")
async def generate_question(
    authorization: str = Header(...),
    file: Optional[UploadFile] = File(None),
    resume_id: Optional[int] = Form(None),
    jd_description: Optional[str] = Form(...),
    service: ResumeService = Depends(get_resume_service)
):
    user_id = int(get_current_user_id(authorization))

    if file:
        if not file.filename.lower().endswith(".pdf"):
            return {"error": "Only PDF files are supported."}
        pdf_bytes = await file.read()
        resume = await service.create_resume_from_pdf(user_id, pdf_bytes)
        content = resume.content

    elif resume_id is not None:
        content = await service.build_resume_content(user_id, resume_id)

    else:
        raise HTTPException(status_code=400, detail="You must select a PDF file or resume")

    # Request question generation to AI server
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=Config.AI_SERVER_URL + "/api/question",
            json={
                "content": content,
                "jd_description": jd_description
            },
            timeout=120
        )
        if response.status_code != 200:
            return {"error": "AI server analyze resume failed"}
        result = response.json()

    return result


@resume_router.post("/result")
async def save_result(
    authorization: str = Header(...),
    body: dict = Body(...),
    repository: ResultRepository = Depends(get_result_repository),
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
    repository: ResultRepository = Depends(get_result_repository)
):
    results = await repository.get_all_by_user_id(int(get_current_user_id(authorization)))
    return {"result": [{"id": r.id, "user_id": r.user_id, "result": r.result} for r in results]}