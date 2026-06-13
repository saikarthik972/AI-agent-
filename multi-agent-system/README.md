# Multi-Agent System

A full-stack AI agent system where 4 specialist agents collaborate to complete any goal.

## Agents

| Agent | Role |
|-------|------|
| 🔍 Researcher | Searches for facts and information |
| ✍️ Writer | Drafts and structures content |
| 💻 Coder | Writes and runs Python code |
| 📊 Analyst | Analyzes data and gives insights |

## How agents communicate

All agents share a **SharedMemory** store. Earlier agents write findings, later agents read them — so each agent builds on the previous one's work.

```
Researcher → writes "research_findings"
Writer     → reads research, writes "written_content"
Coder      → reads both, writes "code_output"
Analyst    → reads all,  writes "analysis"
Orchestrator → synthesizes everything → final answer
```

## Setup

### 1. Backend (Python)

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:
```
ANTHROPIC_API_KEY=your_key_here
```

Run the server:
```bash
python main.py
# Server starts at http://localhost:8000
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

## Usage

1. Open http://localhost:5173
2. Type a goal — e.g. *"Research quantum computing, write a summary, and show Python code"*
3. Click **Run Agents**
4. Watch the agents collaborate and read the final synthesized answer

## Project structure

```
multi-agent-system/
├── backend/
│   ├── main.py           # FastAPI server
│   ├── orchestrator.py   # Plans tasks, synthesizes results
│   ├── memory.py         # Shared memory all agents read/write
│   ├── tools.py          # web_search, run_python, save_file, read_file
│   ├── agents/
│   │   ├── base_agent.py # Base class for all agents
│   │   └── agents.py     # Researcher, Writer, Coder, Analyst
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── components/
    │       ├── PlanView.jsx    # Shows the task plan
    │       ├── AgentPanel.jsx  # Shows each agent working
    │       └── ResultView.jsx  # Final answer + details + log
    └── package.json
```

## Adding a new agent

1. Add a new `BaseAgent` instance in `backend/agents/agents.py`
2. Add it to `AGENT_MAP`
3. The orchestrator will automatically assign it tasks
