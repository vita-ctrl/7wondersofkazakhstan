from fastapi import APIRouter
from .subscribe import router as subscribe_router
from .support import router as support_router
from .auth import router as auth_router
from .users_me import router as user_me_router

router = APIRouter()

router.include_router(subscribe_router)
router.include_router(support_router)
router.include_router(auth_router)
router.include_router(user_me_router)
