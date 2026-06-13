import io
import contextlib
import os

os.makedirs("outputs", exist_ok=True)

def web_search(query: str) -> str:
    # Replace with real API like SerpAPI or Tavily
    return (
        f"Search results for '{query}':\n"
        f"1. Found comprehensive information about {query}.\n"
        f"2. Key facts: This topic involves multiple important aspects.\n"
        f"3. Recent developments show growing interest in {query}.\n"
        f"Tip: Integrate SerpAPI or Tavily for real search results."
    )

def run_python(code: str) -> str:
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(code, {"__builtins__": __builtins__})
        output = buf.getvalue()
        return output if output else "Code ran successfully (no output)"
    except Exception as e:
        return f"Error: {e}"

def save_file(filename: str, content: str) -> str:
    path = os.path.join("outputs", filename)
    with open(path, "w") as f:
        f.write(content)
    return f"Saved to outputs/{filename}"

def read_file(filename: str) -> str:
    path = os.path.join("outputs", filename)
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        return f"File not found: {filename}"

TOOLS = [
    {
        "name": "web_search",
        "description": "Search the web for current information on any topic",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "run_python",
        "description": "Execute Python code and return the output",
        "input_schema": {
            "type": "object",
            "properties": {
                "code": {"type": "string", "description": "Python code to execute"}
            },
            "required": ["code"]
        }
    },
    {
        "name": "save_file",
        "description": "Save text content to a file in the outputs folder",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string", "description": "Name of the file"},
                "content": {"type": "string", "description": "Content to save"}
            },
            "required": ["filename", "content"]
        }
    },
    {
        "name": "read_file",
        "description": "Read the content of a file from the outputs folder",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string", "description": "Name of the file to read"}
            },
            "required": ["filename"]
        }
    }
]

def execute_tool(name: str, inputs: dict) -> str:
    if name == "web_search":  return web_search(inputs["query"])
    if name == "run_python":  return run_python(inputs["code"])
    if name == "save_file":   return save_file(inputs["filename"], inputs["content"])
    if name == "read_file":   return read_file(inputs["filename"])
    return f"Unknown tool: {name}"
