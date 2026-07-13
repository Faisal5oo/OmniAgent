import json
from typing import Any, AsyncGenerator, Dict
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse
from src.config import settings
from src.graph import compiled_graph


app = FastAPI(
    title="OmniAgent Core API Engine",
    version="1.0.0",
    description="Asynchronous SSE production engine driving multi-agent workflows.",
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentExecutionRequest(BaseModel):
    prompt: str = Field(..., description="The direct business intent or query from the client.")
    thread_id: str = Field("default_omni_session", description="Unique identifier for LangGraph thread memory.")


class AgentApprovalRequest(BaseModel):
    thread_id: str = Field(..., description="Target thread session memory ID to resume.")
    approve: bool = Field(..., description="Boolean flag confirming or rejecting content propagation.")
    email_draft: str | None = Field(
        None,
        description="Final human-edited email body submitted at approval time.",
    )


@app.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "operational", "framework": "FastAPI + LangGraph Streaming"}


@app.post("/api/agent/stream")
async def stream_agent_pipeline(payload: AgentExecutionRequest) -> EventSourceResponse:
    async def event_generator() -> AsyncGenerator[Dict[str, Any], None]:
        initial_state = {
            "messages": [{"role": "user", "content": payload.prompt}],
            "active_nodes": []
        }
        
        config = {"configurable": {"thread_id": payload.thread_id}}
        
        try:
            async for event in compiled_graph.astream_events(initial_state, config, version="v2"):
                kind = event.get("event")
                node_name = event.get("metadata", {}).get("langgraph_node", "")
                
                if kind == "on_chain_start" and node_name:
                    yield {
                        "event": "node_start",
                        "data": json.dumps({"node": node_name})
                    }
                    
                elif kind == "on_chain_end" and node_name:
                    yield {
                        "event": "node_end",
                        "data": json.dumps({"node": node_name})
                    }
                
                elif kind == "on_chat_model_stream" and node_name == "drafter":
                    content = event.get("data", {}).get("chunk", {}).content
                    if content:
                        yield {
                            "event": "token",
                            "data": json.dumps({"text": content})
                        }
                        
                elif kind == "on_chain_end" and event.get("name") == "LangGraph":
                    final_output = event.get("data", {}).get("output", {})
                    yield {
                        "event": "complete",
                        "data": json.dumps({
                            "lead_data": final_output.get("lead_data", {}),
                            "email_draft": final_output.get("email_draft", ""),
                            "requires_approval": final_output.get("requires_approval", False)
                        })
                    }
                    
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"detail": f"Internal pipeline thread execution failure: {str(e)}"})
            }

    return EventSourceResponse(event_generator())


@app.post("/api/agent/approve")
async def process_human_approval(payload: AgentApprovalRequest) -> Dict[str, Any]:
    config = {"configurable": {"thread_id": payload.thread_id}}
    
    state_snapshot = await compiled_graph.aget_state(config)
    if not state_snapshot.next:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The requested thread session execution path is not in an actionable paused state."
        )
        
    update_values: Dict[str, Any] = {
        "is_approved": payload.approve,
        "requires_approval": False,
    }

    if payload.approve and payload.email_draft is not None:
        update_values["email_draft"] = payload.email_draft

    await compiled_graph.aupdate_state(
        config=config,
        values=update_values,
        as_node="drafter"
    )
    
    final_state = await compiled_graph.ainvoke(None, config)
    
    return {
        "status": "resumed_execution_complete",
        "final_active_node": final_state.get("active_nodes", [])[-1] if final_state.get("active_nodes") else "sender"
    }