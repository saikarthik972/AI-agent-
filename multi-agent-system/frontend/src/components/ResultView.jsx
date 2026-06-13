import { useState } from "react";

export default function ResultView({ result }) {
  const [tab, setTab] = useState("final");

  const tabs = [
    { id: "final",   label: "Final answer" },
    { id: "details", label: "Agent details" },
    { id: "log",     label: "Memory log" },
  ];

  return (
    <div style={{
      background: "#0d1117", border: "1px solid #1e2433",
      borderRadius: 12, overflow: "hidden",
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 2, padding: "8px 12px",
        borderBottom: "1px solid #1e2433", background: "#161b27",
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "6px 14px", borderRadius: 6, border: "none",
              background: tab === t.id ? "#0d1117" : "transparent",
              color: tab === t.id ? "#6366f1" : "#64748b",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "1.5rem" }}>
        {/* Final answer */}
        {tab === "final" && (
          <div style={{
            fontSize: 14, lineHeight: 1.8, color: "#e2e8f0",
            whiteSpace: "pre-wrap", fontFamily: "Inter, sans-serif",
          }}>
            {result.final}
          </div>
        )}

        {/* Agent details */}
        {tab === "details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {Object.entries(result.results || {}).map(([agent, output]) => (
              <div key={agent}>
                <h3 style={{
                  fontSize: 13, fontWeight: 600, color: "#6366f1",
                  textTransform: "capitalize", marginBottom: 8,
                }}>
                  {agent}
                </h3>
                <div style={{
                  padding: "12px 14px", borderRadius: 8,
                  background: "#161b27", border: "1px solid #1e2433",
                  fontSize: 13, color: "#94a3b8", lineHeight: 1.7,
                  whiteSpace: "pre-wrap", fontFamily: "JetBrains Mono, monospace",
                }}>
                  {output}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Memory log */}
        {tab === "log" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>
              Communication log — how agents passed information to each other
            </p>
            {(result.log || []).map((entry, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 10px", borderRadius: 6,
                background: "#161b27", fontSize: 12,
                color: "#64748b", fontFamily: "JetBrains Mono, monospace",
              }}>
                <span style={{ color: "#475569" }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{entry}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
