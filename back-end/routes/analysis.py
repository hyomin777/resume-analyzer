from fastapi import APIRouter, Depends, Header, Body
from fastapi.exceptions import HTTPException
from services import AnalysisService, get_analysis_service
from schemas import AnalysisOut
from utils import get_current_user_id

analysis_router = APIRouter()

@analysis_router.post("/analysis", response_model=AnalysisOut)
async def save_analysis(
    authorization: str = Header(...),
    body: dict = Body(...),
    service: AnalysisService = Depends(get_analysis_service),
):
    try:
        user_id = int(get_current_user_id(authorization))
        result = await service.create_analysis(user_id, body)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@analysis_router.get("/analyses", response_model=list[AnalysisOut])
async def get_analyses(
    authorization: str = Header(...),
    service: AnalysisService = Depends(get_analysis_service)
):
    try:
        user_id = int(get_current_user_id(authorization))
        results = await service.get_analysis(user_id)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@analysis_router.patch("/analysis/{analysis_id}/deactivate")
async def deactivate_analysis(
    analysis_id: int,
    authorization: str = Header(...),
    service: AnalysisService = Depends(get_analysis_service)
):
    try:
        user_id = int(get_current_user_id(authorization))
        result = await service.deactivate_analysis(user_id, analysis_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))