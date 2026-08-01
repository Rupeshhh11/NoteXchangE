import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import engine, Base
from app.config import settings
from app.routers import (
    auth_router,
    users_router,
    tasks_router,
    bids_router,
    payments_router,
    messages_router,
    reviews_router,
    admin_router
)
from app.websockets.manager import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="NoteXchangE FastAPI Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Frontend static mount
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend")
os.makedirs(FRONTEND_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# Include API Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(tasks_router)
app.include_router(bids_router)
app.include_router(payments_router)
app.include_router(messages_router)
app.include_router(reviews_router)
app.include_router(admin_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "NoteXchangE Python FastAPI Backend"}

# WebSocket Endpoints
@app.websocket("/ws")
async def global_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Echo or process incoming messages
            await manager.broadcast_global(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.websocket("/ws/chat/{room_id}")
async def chat_websocket(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id=room_id)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast_to_room(room_id, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id=room_id)

# Catch-all route to serve static frontend single page application
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Check if requested path is a file in static_frontend
    file_path = os.path.join(FRONTEND_DIR, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)
    # Default to index.html for SPA routing
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.isfile(index_file):
        return FileResponse(index_file)
    return {"message": "NoteXchangE API Running"}
