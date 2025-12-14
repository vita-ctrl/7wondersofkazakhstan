
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import UserProfile
from app.database import get_db
from app.models import User
from app.schemas import UpdateProfileRequest
from app.security import get_current_user

router = APIRouter()

@router.get("/users/me", response_model=UserProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/users/me", response_model=UserProfile)
async def update_my_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.first_name is not None:
        current_user.first_name = data.first_name  # pyright: ignore[reportAttributeAccessIssue]
    if data.last_name is not None:
        current_user.last_name = data.last_name  # pyright: ignore[reportAttributeAccessIssue]

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user