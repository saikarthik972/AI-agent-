const AGENT_META = {
  researcher: { icon: "🔍", color: "#3b82f6", bg: "#0f1e2e", border: "#1d4ed8" },
  writer:     { icon: "✍️", color: "#22c55e", bg: "#0f2018", border: "#15803d" },
  coder:      { icon: "💻", color: "#f59e0b", bg: "#1e1a0f", border: "#b45309" },
  analyst:    { icon: "📊", color: "#ef4444", bg: "#1e0f0f", border: "#b91c1c" },
};

export default function AgentPanel({ events }) {
  // Group events by agent — keep the latest state per agent
  const agentMap = {};
  for (const e of events) {
    if (!agentMap[e.agent]) agentMap[e.agent] = {};
    Object.assign(agentMap[e.agent], e);
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 13, fontWeight: 500, color: "#64748b",
                   marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Agent results
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(agentMap).map(([agent, data]) => {
          const meta = AGENT_META[agent] || AGENT_META.researcher;
          const done = data.type === "agent_done";
          return (
            <div key={agent} style={{
              borderRadius: 10, background: meta.bg,
              border: `1px solid ${meta.border}55`,
              borderLeft: `3px solid ${meta.color}`,
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                borderBottom: done ? `1px solid ${meta.border}33` : "none",
              }}>
                <span style={{ fontSize: 16 }}>{meta.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13,
                               color: meta.color, textTransform: "capitalize" }}>
                  {agent}
                </span>
                <span style={{
                  marginLeft: "auto", fontSize: 11, padding: "2px 8px",
                  borderRadius: 20, fontWeight: 500,
                  background: done ? "#14532d" : "#451a03",
                  color: done ? "#4ade80" : "#fbbf24",
                }}>
                  {done ? "✓ done" : "working…"}
                </span>
              </div>

              {/* Result preview */}
              {done && data.result && (
                <div style={{ padding: "10px 14px" }}>
                  <p style={{
                    margin: 0, fontSize: 13, color: "#94a3b8",
                    lineHeight: 1.6, whiteSpace: "pre-wrap",
                    maxHeight: 120, overflow: "hidden",
                    maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  }}>
                    {data.result}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
