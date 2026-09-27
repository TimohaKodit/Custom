import { getCurrentWindow } from "@tauri-apps/api/window";
import { PcCard } from "./cards/PcCard";
import { useSystemStats } from "./hooks/useSystemStats";

export default function App() {
  const { stats, error, history } = useSystemStats();
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

      <PcCard stats={stats} error={error} history={history} />

      <section className="card">
        <span className="muted">Карточка «Claude Code» — следующий шаг</span>
      </section>

      <span className="grow" />

      <footer className="foot">
        <span>всё считается локально</span>
        <span className="grow" />
        <span className="mono">v0.1.0</span>
      </footer>
    </div>
  );
}
