import sys
from src.tools.vector_storage import get_or_create_knowledge_collection

def run_ingestion() -> None:
    print("[-] Initializing persistent ChromaDB vector store client...")
    collection = get_or_create_knowledge_collection()
    
    # Idempotency check: Don't duplicate entries if already run
    existing = collection.get()
    if existing and len(existing.get("ids", [])) > 0:
        print("[!] Collection 'omniagent_knowledge' already seeded. Skipping execution.")
        return

    documents = [
        "SLA Guidelines: Premium Tier enterprise clients must receive an automated outreach campaign within 5 minutes.",
        "Pricing Tier Matrix: Custom software deployments start at $75,000 baseline. Mid-market plans start at $25,000.",
        "Operational Policy: Enterprise Corp qualifies for VIP discount incentives on cloud compute architectures."
    ]
    
    ids = ["doc_sla_001", "doc_pricing_002", "doc_policy_003"]
    
    print("[-] Uploading vectorized records into local vector storage index...")
    collection.add(
        documents=documents,
        ids=ids
    )
    print("[+] Database ingestion phase concluded successfully.")

if __name__ == "__main__":
    run_ingestion()