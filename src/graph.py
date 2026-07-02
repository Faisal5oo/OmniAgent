from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from src.nodes.qualifier import lead_qualifier_node
from src.nodes.retriever import context_retriever_node
from src.nodes.drafter import email_drafter_node
from src.nodes.sender import email_sender_node
from src.state import AgentState


def build_workflow() -> CompiledStateGraph:

    """Initializes, wires, and compiles the multi-agent system state machine."""
    workflow = StateGraph(AgentState)

    workflow.add_node("qualifier", lead_qualifier_node)
    workflow.add_node("retriever", context_retriever_node)
    workflow.add_node("drafter", email_drafter_node)
    workflow.add_node("sender", email_sender_node)

    workflow.add_edge(START, "qualifier")
    workflow.add_edge(START, "retriever")

    workflow.add_edge("qualifier", "drafter")
    workflow.add_edge("retriever", "drafter")

    workflow.add_edge("drafter", "sender")
    workflow.add_edge("sender", END)
    
    short_term_memory = MemorySaver()

    return workflow.compile(
        checkpointer=short_term_memory,
        interrupt_before=["sender"]
        )

compiled_graph: CompiledStateGraph = build_workflow()