import os
import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from orchestrator import run_goal

load_dotenv()

app = FastAPI(title="Multi-Agent System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GoalRequest(BaseModel):
    goal: str


@app.get("/health")
def health():
    return {"status": "ok", "message": "Multi-agent system is running"}


@app.post("/run")
async def run(req: GoalRequest):
    """Run all agents and return the complete result."""
    events = []

    async def collect(event):
        events.append(event)

    result = await run_goal(req.goal, progress_callback=collect)
    return {"events": events, "result": result}


@app.post("/stream")
async def stream(req: GoalRequest):
    """Stream agent progress in real time using Server-Sent Events."""
    async def event_generator():
        queue = asyncio.Queue()

        async def callback(event):
            await queue.put(event)

        async def run_task():
            result = await run_goal(req.goal, progress_callback=callback)
            await queue.put({"type": "complete", "result": result})

        asyncio.create_task(run_task())

        while True:
            event = await queue.get()
            yield f"data: {json.dumps(event)}\n\n"
            if event.get("type") == "complete":
                break

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
