import chromadb
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from src.config import settings
from src.state import AgentState


async def context_retriever_node(state: AgentState) -> dict:
    """
    Queries local ChromaDB vector records and evaluates relevant business documentation
    using an OpenRouter gpt-4o-mini inference loop.
    """
    # 1. Access the global persistent database storage index
    chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
    collection = chroma_client.get_collection(name="omniagent_knowledge")
    
    # 2. Extract the initial user string context from state messages
    user_query = state.messages[0].content if state.messages else ""
    
    # 3. Query the collection database matching textual similarity parameters
    results = collection.query(
        query_texts=[user_query],
        n_results=2
    )
    
    # Flatten out the array strings extracted from ChromaDB results structure
    retrieved_docs = []
    if results and "documents" in results and results["documents"]:
        retrieved_docs = results["documents"][0]
        
    # 4. Initialize an isolated OpenRouter LLM execution worker frame to process context relevance
    llm = ChatOpenAI(
        model=settings.RAG_MODEL,
        openai_api_key=settings.OPENROUTER_API_KEY.get_secret_value(),
        openai_api_base=settings.OPENROUTER_BASE_URL,
        temperature=0.1
    )
    
    system_instruction = (
        "You are a vector data analyst. Review the retrieved corporate policy documents "
        "and isolate the critical sentences that match the client's query requirements."
    )
    
    response = await llm.ainvoke([
        SystemMessage(content=system_instruction),
        HumanMessage(content=f"Query: {user_query}\nDocs: {' | '.join(retrieved_docs)}")
    ])
    
    return {
        "retrieved_context": [response.content],
        "active_nodes": ["context_retriever_node"]
     }