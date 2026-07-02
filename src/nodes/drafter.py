from src.state import AgentState


async def email_drafter_node(state: AgentState) -> dict:
    """
    Consolidates the parallel outputs of lead qualification and context retrieval
    to formulate a structured business outreach communication draft.
    """
    company = state.lead_data.get("company", "Unknown Client")
    budget = state.lead_data.get("budget", 0)
    
    constructed_draft = (
        f"Subject: Scaled Automation Partnership for {company}\n\n"
        f"Hello Team,\nBased on our initial data vectors and your structural baseline "
        f"budget allocation of ${budget}, we have formulated your custom integration roadmap."
    )
    
    # We enforce a mandatory human approval flag before executing our outbound action
    return {
        "email_draft": constructed_draft,
        "requires_approval": True,
        "active_nodes": ["email_drafter_node"]
    }

