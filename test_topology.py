# Standard library imports
import asyncio

# Local imports
from src.graph import compiled_graph


async def main():
    config = {"configurable": {"thread_id": "upwork_demo_session_1"}}
    initial_input = {"messages": [{"role": "user", "content": "Execute intake operations for Enterprise Corp"}]}
    
    print("--- Initializing Automated OmniAgent Workflow Execution ---")
    async for event in compiled_graph.astream(initial_input, config, stream_mode="values"):
        # Read the latest list of nodes executed from our state history sequence
        nodes_run = event.get("active_nodes", [])
        current_trace = nodes_run[-1] if nodes_run else "START"
        print(f"Executing active state context frame at node: [{current_trace}]")
    
    current_state = await compiled_graph.aget_state(config)
    print(f"\nFull Graph Execution Trace History: {current_state.values.get('active_nodes')}")
    print(f"Is the graph execution currently halted? {bool(current_state.next)}")
    print(f"Next scheduled target node awaiting authorization: {list(current_state.next)}")

if __name__ == "__main__":
    asyncio.run(main())