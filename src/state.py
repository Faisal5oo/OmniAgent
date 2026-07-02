from typing import Annotated, Any, Dict, List, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field

def merge_active_nodes(left: List[str], right: List[str]) -> List[str]:
    """
    Appends new active node states to the historical execution trace.
    
    Acts as a conflict-free reducer for parallel graph paths.
    """
    return left + right

class AgentTelemetry(BaseModel):
    
    total_tokens: int = 0
    estimated_cost: float = 0.0
    node_latencies: Dict[str, float] = Field(default_factory=dict)

class AgentState(BaseModel):
    """
    The unified Pydantic state machine schema for OmniAgent.
    
    Enforces strict type-safety and field validation across all LangGraph nodes.
    """
    
    messages: Annotated[Sequence[BaseMessage], add_messages] = Field(default_factory=list)
    lead_data: Dict[str, Any] = Field(default_factory=dict)
    retrieved_context: List[str] = Field(default_factory=list)
    email_draft: str = ""
    requires_approval: bool = False
    is_approved: bool = False
    current_active_node: str = ""
    active_nodes: Annotated[List[str], merge_active_nodes] = Field(default_factory=list)
    telemetry: AgentTelemetry = Field(default_factory=AgentTelemetry)