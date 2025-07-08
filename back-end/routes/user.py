from fastapi import APIRouter, Depends, Body, Header
from fastapi.exceptions import HTTPException
from db.models import User
from db.repositories import UserRepository, get_user_repository
from utils import (
    hash_password, verify_password,
    create_access_token, verify_access_token
)

user_router = APIRouter()

@user_router.post("/user")
async def create_user(
    username: str = Body(...),
    password: str = Body(...),
    password_check: str = Body(...),
    repository: UserRepository = Depends(get_user_repository)
):
    user = await repository.get_user_by_username(username)
    if user:
        raise HTTPException(status_code=400, detail=f"Username: {username} already exists")
    
    if password != password_check:
        raise HTTPException(status_code=400, detail="Password and password check is not same")
    
    user = User(
        username=username,
        password=hash_password(password)
    )
    user: User = await repository.add_item(user)
    return {"result": user.id}


@user_router.post("/login")
async def login(
    username: str = Body(...),
    password: str = Body(...),
    repository: UserRepository = Depends(get_user_repository)
):
    user: User = await repository.get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=400, detail=f"{username} is not exists")
    
    if not verify_password(
        plain_password=password,
        hashed_password=user.password
    ):
        raise HTTPException(status_code=400, detail="Password is not correct")
    
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}
    

@user_router.get("/me")
async def get_current_user(
    authorization: str = Header(...),
    repository: UserRepository = Depends(get_user_repository)
):
    token = authorization.replace("Bearer ", "")
    payload = verify_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = int(payload["sub"])
    user = await repository.get_item(user_id)
    return {"user_id": user.id, "username": user.username}