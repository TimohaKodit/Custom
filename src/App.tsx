import { getCurrentWindow } from "@tauri-apps/api/window";
import { ClaudeCard } from "./cards/ClaudeCard";
import { DiskCard } from "./cards/DiskCard";
import { PcCard } from "./cards/PcCard";
import { useClaudeStats } from "./hooks/useClaudeStats";
import { useDiskStats } from "./hooks/useDiskStats";
import { useSystemStats } from "./hooks/useSystemStats";

export default function App() {
  const system = useSystemStats();
  const claude = useClaudeStats();
  const disk = useDiskStats();

  const hide = () => getCurrentWindow().hide();

  return (
    <div className="panel">
      <header className="head drag">
        <span className="head-title">Custom</span>
        <span className="dot" />
        <span className="muted">сейчас</span>
        <span className="grow" />
        <button type="button" className="icon-btn" aria-label="Свернуть" onClick={hide}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
      </header>

      <div className="cards">
        <PcCard stats={system.stats} error={system.error} history={system.history} />
        <ClaudeCard stats={claude.stats} error={claude.error} />
        <DiskCard report={disk.report} error={disk.error} refresh={disk.refresh} />
      </div>

      <footer className="foot">
        <span>всё считается локально</span>
        <span className="grow" />
        <span className="mono">v0.1.0</span>
      </footer>
    </div>
  );
}
