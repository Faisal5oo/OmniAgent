import chromadb
from src.config import settings

def get_chroma_client():
    """Initializes and returns a thread-safe local persistent Chroma client."""
    return chromadb.PersistentClient(path=str(settings.CHROMA_DB_PATH))

def get_or_create_knowledge_collection(client=None):
    """Retrieves or constructs the canonical multi-agent reference collection."""
    if client is None:
        client = get_chroma_client()
    return client.get_or_create_collection(name="omniagent_knowledge")