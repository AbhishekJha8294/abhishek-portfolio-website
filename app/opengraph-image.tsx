import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAGES = ["Requirement", "Planner", "Orchestrator", "Workers", "Tests", "Approval", "Pull request"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0b",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#edebe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a8a59e" }}>
          <span style={{ color: "#edebe6" }}>{site.name}</span>
          <span style={{ color: "#2b2b30" }}>|</span>
          <span>{site.role}</span>
        </div>

        <div style={{ display: "flex", fontSize: 80, lineHeight: 1.02, letterSpacing: "-0.04em", maxWidth: 980 }}>
          {site.headline}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {STAGES.map((stage, i) => (
              <div key={stage} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${stage === "Approval" ? "rgba(240,180,94,0.55)" : "#2b2b30"}`,
                    background: "#0e0e10",
                    fontSize: 19,
                    color: "#edebe6",
                  }}
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 9,
                      background: stage === "Approval" ? "#f0b45e" : "#c5f26a",
                    }}
                  />
                  {stage}
                </div>
                {i < STAGES.length - 1 && <div style={{ width: 18, height: 1, background: "#2b2b30" }} />}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#87857f" }}>
            {site.focusAreas.join("  ·  ")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
