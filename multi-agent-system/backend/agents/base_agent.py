import anthropic
from tools import TOOLS, execute_tool
from memory import memory

client = anthropic.Anthropic()

class BaseAgent:
    def __init__(self, name: str, system_prompt: str, memory_key: str):
        self.name = name
        self.system_prompt = system_prompt
        self.memory_key = memory_key

    def run(self, task: str) -> str:
        context = memory.all_context()
        messages = [{
            "role": "user",
            "content": (
                f"Current shared memory (from other agents):\n{context}\n\n"
                f"Your task: {task}"
            )
        }]

        while True:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1000,
                system=self.system_prompt,
                tools=TOOLS,
                messages=messages
            )

            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result
                        })
                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})
            else:
                text = next(
                    (b.text for b in response.content if hasattr(b, "text")), ""
                )
                memory.write(self.name, self.memory_key, text)
                return text
