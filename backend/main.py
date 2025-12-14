from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router

from app.database import engine
from app.models import Base


app = FastAPI(title="KazWonder API")
app.include_router(router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173"],  # в проде лучше ограничить доменом фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "KazWonder API работает!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)
