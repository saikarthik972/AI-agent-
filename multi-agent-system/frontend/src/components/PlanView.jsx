const AGENT_COLORS = {
  researcher: { bg: "#0f1e2e", border: "#1d4ed8", dot: "#3b82f6", label: "#60a5fa" },
  writer:     { bg: "#0f2018", border: "#15803d", dot: "#22c55e", label: "#4ade80" },
  coder:      { bg: "#1e1a0f", border: "#b45309", dot: "#f59e0b", label: "#fbbf24" },
  analyst:    { bg: "#1e0f0f", border: "#b91c1c", dot: "#ef4444", label: "#f87171" },
};

export default function PlanView({ tasks }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 13, fontWeight: 500, color: "#64748b",
                   marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Plan — {tasks.length} tasks
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tasks.map((t, i) => {
          const c = AGENT_COLORS[t.agent] || AGENT_COLORS.researcher;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "10px 14px", borderRadius: 8,
              background: c.bg, border: `1px solid ${c.border}44`,
            }}>
              <span style={{
                minWidth: 20, height: 20, borderRadius: "50%",
                background: c.dot, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 600,
                color: "#000", marginTop: 1,
              }}>{i + 1}</span>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.label,
                               textTransform: "capitalize" }}>{t.agent}</span>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#94a3b8" }}>
                  {t.task}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
