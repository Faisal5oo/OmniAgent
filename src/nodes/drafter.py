from langchain_openai import ChatOpenAI
from src.config import settings
from src.state import AgentState


async def email_drafter_node(state: AgentState) -> dict:
    """
    Consumes CRM qualification fields and filtered corporate RAG constraints 
    to draft an enterprise-level, compliance-aligned B2B outreach asset.
    """
    lead_data = state.lead_data
    retrieved_context = state.retrieved_context
    
    company = state.lead_data.get("company", "Unknown Organization")
    budget = state.lead_data.get("budget", 0)
    is_qualified = state.lead_data.get("qualified", False)
    
    context_str = "\n".join(retrieved_context) if retrieved_context else "No corporate policies applied."
    
    llm = ChatOpenAI(
        api_key=settings.OPENROUTER_API_KEY.get_secret_value(),  #
        base_url=settings.OPENROUTER_BASE_URL,
        model=settings.RAG_MODEL
    )
    
    system_prompt = (
        "You are the senior sales copywriting agent for OmniAgent Command Center.\n"
        "Generate a sharp, single-paragraph business email based on the execution data below.\n\n"
        "CRM METRICS:\n"
        f"- Account Name: {company}\n"
        f"- Qualification Flag: {'QUALIFIED' if is_qualified else 'UNQUALIFIED'} (Budget: ${budget:,})\n\n"
        "CORPORATE CONSTRAINTS & RAG DATA:\n"
        f"{context_str}\n\n"
        "EXECUTION CRITERIA:\n"
        "1. If account name matches VIP policies, apply the accurate discount matrix rates mentioned in the data.\n"
        "2. Reference response speed or scheduling expectations matching the extracted SLA directives.\n"
        "3. Do not invent metrics or names. Rely strictly on the facts provided above.\n"
        "4. Tone: Minimalist, authoritative, clean-tech style."
    )
    
    response = await llm.ainvoke(system_prompt)
    
    return {
        "email_draft": response.content,
        "requires_approval": True,
        "active_nodes": ["email_drafter_node"]
    }

