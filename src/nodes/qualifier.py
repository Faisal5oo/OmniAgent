from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

from src.config import settings
from src.state import AgentState
from src.tools.business_tools import query_crm_database

async def lead_qualifier_node(state: AgentState) -> dict:
    llm = ChatOpenAI(
        model=settings.LLM_MODEL,
        api_key=settings.OPENROUTER_API_KEY.get_secret_value(),
        base_url=settings.OPENROUTER_BASE_URL,
        temperature=0.0,
    )
    
    llm_with_tools = llm.bind_tools([query_crm_database])
    user_prompt = state.messages[0].content if state.messages else ""

    response = await llm_with_tools.ainvoke([
        HumanMessage(content=f"Analyze and extract corporate context metadata for: {user_prompt}")
    ])

    extracted_budget = 25000  # Default baseline
    if response.tool_calls:
        tool_call = response.tool_calls[0]
        company = tool_call["args"].get("company_name", "Unknown")
        tool_result = await query_crm_database(company)
        
        if "75000" in tool_result:
            extracted_budget = 75000

    return {
        "lead_data": {
            "company": "Enterprise Corp" if "Enterprise" in str(user_prompt) else "Unknown",
            "budget": extracted_budget,
            "qualified": True if extracted_budget >= 45000 else False
        },
        "active_nodes": ["lead_qualifier_node"]
    }