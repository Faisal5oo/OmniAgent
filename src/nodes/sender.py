from src.state import AgentState


async def email_sender_node(state: AgentState) -> dict:
    """
    The final automated action gateway node.
    
    This node is physically protected by an interrupt barrier configuration.
    """
    return {
        "is_approved": True,
        "active_nodes": ["email_sender_node"]
    }
