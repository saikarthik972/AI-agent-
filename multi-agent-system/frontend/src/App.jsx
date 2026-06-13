import { useState } from "react";
import AgentPanel from "./components/AgentPanel";
import ResultView from "./components/ResultView";
import PlanView from "./components/PlanView";

const EXAMPLES = [
  "Research quantum computing, write a Python simulation of a qubit, and summarize findings",
  "Analyze the pros and cons of electric vehicles, write a comparison article, and show Python code to calculate charging costs",
  "Research machine learning trends in 2024, write an executive summary, and build a Python script to visualize the data",
];

export default function App() {
  const [goal, setGoal]       = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents]   = useState([]);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const run = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);
    setEvents([]);
    setResult(null);
    setError(null);

    try {
      const evtSource = new EventSource(
        `/stream?goal=${encodeURIComponent(goal)}`
      );

      // SSE not supported easily with POST — use fetch /run instead
      evtSource.close();

      const res = await fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setEvents(data.events || []);
      setResult(data.result);
    } catch (e) {
      setError(e.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const plan = events.find(e => e.type === "plan");
  const agentEvents = events.filter(e =>
    e.type === "agent_start" || e.type === "agent_done"
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0d14",
      color: "#e2e8f0", fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e2433", padding: "0 2rem",
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", background: "#0d1117",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>🤖</div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Multi-Agent System</span>
          <span style={{
            fontSize: 11, background: "#1e2433", color: "#6366f1",
            padding: "2px 8px", borderRadius: 20, fontWeight: 500,
          }}>v1.0</span>
        </div>
        <span style={{ fontSize: 12, color: "#475569" }}>
          Researcher · Writer · Coder · Analyst
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Goal input */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>
            Enter a goal for the agents
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={goal}
              onChange={e => setGoal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && run()}
              placeholder="e.g. Research AI trends, write a summary, and show Python code..."
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 10,
                background: "#161b27", border: "1px solid #1e2433",
                color: "#e2e8f0", fontSize: 14, outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              onClick={run}
              disabled={loading || !goal.trim()}
              style={{
                padding: "12px 28px", borderRadius: 10, border: "none",
                background: loading || !goal.trim() ? "#1e2433" : "#6366f1",
                color: loading || !goal.trim() ? "#475569" : "#fff",
                fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}
            >
              {loading ? "Running…" : "Run Agents"}
            </button>
          </div>

          {/* Example goals */}
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setGoal(ex)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6,
                  background: "#161b27", border: "1px solid #1e2433",
                  color: "#64748b", cursor: "pointer",
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            padding: "2rem", textAlign: "center",
            background: "#161b27", borderRadius: 12,
            border: "1px solid #1e2433", marginBottom: 24,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              Agents are collaborating… this may take 30–60 seconds
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "1rem 1.25rem", borderRadius: 10, marginBottom: 24,
            background: "#1f0f0f", border: "1px solid #7f1d1d", color: "#f87171",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Plan */}
        {plan && <PlanView tasks={plan.tasks} />}

        {/* Agent activity */}
        {agentEvents.length > 0 && <AgentPanel events={agentEvents} />}

        {/* Final result */}
        {result && <ResultView result={result} />}
      </div>
    </div>
  );
}
