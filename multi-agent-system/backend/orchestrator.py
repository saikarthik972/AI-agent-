import json
import anthropic
from memory import memory
from agents.agents import AGENT_MAP

client = anthropic.Anthropic()

def plan(goal: str) -> list:
    """Ask Claude to break the goal into ordered tasks for specific agents."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system="""You are an Orchestrator. Break the user's goal into 2-4 tasks.
Assign each task to one of these agents: researcher, writer, coder, analyst.
Order them so earlier results feed into later agents.
Each task should be specific and actionable.
Reply ONLY with a valid JSON array. No explanation. Example:
[
  {"agent": "researcher", "task": "Research the history and key facts about X"},
  {"agent": "writer", "task": "Write a clear summary based on research findings"},
  {"agent": "coder", "task": "Write Python code that demonstrates X"},
  {"agent": "analyst", "task": "Analyze the findings and give 3 key insights"}
]""",
        messages=[{"role": "user", "content": goal}]
    )

    raw = response.content[0].text.strip()
    # Strip markdown code fences if present
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def synthesize(goal: str) -> str:
    """Combine all agent results into one final answer."""
    context = memory.all_context()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        system="""You are a Synthesizer. You receive the outputs from multiple specialist agents
and combine them into one clear, complete, well-structured final answer.
Do not just list each agent's output — weave them together into a cohesive response.
Use markdown formatting for readability.""",
        messages=[{
            "role": "user",
            "content": (
                f"Original goal: {goal}\n\n"
                f"All agent outputs:\n{context}\n\n"
                f"Write the final synthesized answer."
            )
        }]
    )
    return response.content[0].text


async def run_goal(goal: str, progress_callback=None) -> dict:
    """Main entry point. Plans tasks, runs agents in order, synthesizes result."""
    memory.clear()

    # Step 1: Plan
    tasks = plan(goal)
    if progress_callback:
        await progress_callback({
            "type": "plan",
            "tasks": tasks
        })

    # Step 2: Run each agent in order
    results = {}
    for t in tasks:
        agent_name = t["agent"]
        task_text  = t["task"]

        if progress_callback:
            await progress_callback({
                "type": "agent_start",
                "agent": agent_name,
                "task": task_text
            })

        agent_fn = AGENT_MAP.get(agent_name)
        if not agent_fn:
            result = f"Unknown agent: {agent_name}"
        else:
            result = agent_fn(task_text)

        results[agent_name] = result

        if progress_callback:
            await progress_callback({
                "type": "agent_done",
                "agent": agent_name,
                "result": result
            })

    # Step 3: Synthesize
    if progress_callback:
        await progress_callback({"type": "synthesizing"})

    final = synthesize(goal)

    return {
        "tasks":   tasks,
        "results": results,
        "final":   final,
        "log":     memory.get_log()
    }
