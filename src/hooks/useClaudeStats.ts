import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { ClaudeStats } from "../lib/claudeTypes";

/** Логи Claude Code меняются медленно, чаще опрашивать нет смысла. */
const POLL_MS = 30_000;

export function useClaudeStats() {
  const [stats, setStats] = useState<ClaudeStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      // разбор всех .jsonl может занять секунды — не накладываем вызовы
      if (busy.current) return;
      busy.current = true;
      try {
        const next = await invoke<ClaudeStats>("get_claude_stats");
        if (!alive) return;
        setStats(next);
        setError(null);
      } catch (err) {
        if (alive) setError(String(err));
      } finally {
        busy.current = false;
      }
    };

    void tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return { stats, error };
}
