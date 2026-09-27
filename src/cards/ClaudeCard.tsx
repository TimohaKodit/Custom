import { Bar } from "../components/Bar";
import { percent } from "../lib/format";
import {
  clock,
  shortDate,
  todayKey,
  tokens,
  weekday,
  type ClaudeStats,
} from "../lib/claudeTypes";
import "./claude-card.css";

/**
 * Порог 5-часового окна в токенах.
 * Из логов он не читается, поэтому значение временное: позже его задаст
 * пользователь в настройках, а при отказе API по лимиту оно откалибруется
 * по `lastLimitHit` (запись `quotaLimits` с `rateLimitType: "five_hour"`).
 */
export const WINDOW_BUDGET_TOKENS = 8_000_000;

interface Props {
  stats: ClaudeStats | null;
  error: string | null;
}

export function ClaudeCard({ stats, error }: Props) {
  if (error) {
    return (
      <section className="card">
        <span className="muted">Не удалось прочитать логи Claude Code: {error}</span>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="card">
        <span className="muted">Читаю логи Claude Code…</span>
      </section>
    );
  }

  const windowPct = percent(stats.windowTokens, WINDOW_BUDGET_TOKENS);
  const weekPeak = Math.max(1, ...stats.byDay.map((d) => d.tokens));
  const projectPeak = Math.max(1, ...stats.byProject.map((p) => p.tokens));
  const today = todayKey();

  return (
    <section className="card">
      <div className="card-head">
        <span className="card-mark claude-mark">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
          </svg>
        </span>
        <span className="card-title">Claude Code</span>
        <span className="grow" />
        {stats.windowResetAt && (
          <span className="card-sub">
            сброс <span className="mono strong">{clock(stats.windowResetAt)}</span>
          </span>
        )}
      </div>

      <Bar
        label="Окно 5 ч"
        value={tokens(stats.windowTokens)}
        total={tokens(WINDOW_BUDGET_TOKENS)}
        percent={windowPct}
        color="var(--orange)"
      />

      <div className="claude-today">
        <span className="claude-today-value mono">{tokens(stats.todayTokens)}</span>
        <span className="claude-today-label">токенов сегодня</span>
      </div>

      <div className="card-meta">
        за неделю <span className="mono strong">{tokens(stats.weekTokens)}</span> ·{" "}
        <span className="mono strong">{stats.messages}</span> сообщений ·{" "}
        <span className="mono strong">{stats.sessions}</span> сессий
      </div>

      <div className="claude-week" role="img" aria-label={`Токены за 7 дней, максимум ${tokens(weekPeak)}`}>
        {stats.byDay.map((day) => {
          const isToday = day.date === today;
          const height = day.tokens > 0 ? Math.max(6, (day.tokens / weekPeak) * 100) : 0;
          return (
            <div key={day.date} className="claude-day">
              <div className="claude-day-track">
                {/* нулевой день рисуем тонкой полоской, чтобы колонка не пропадала */}
                <div
                  className={day.tokens > 0 ? "claude-day-fill" : "claude-day-fill claude-day-zero"}
                  style={day.tokens > 0 ? { height: `${height}%` } : undefined}
                />
              </div>
              <span className={isToday ? "claude-day-name claude-day-now" : "claude-day-name"}>
                {weekday(day.date)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="claude-projects">
        {stats.byProject.map((p) => (
          <div key={p.name} className="claude-proj">
            <span className="claude-proj-name">{p.name}</span>
            <span
              className="claude-proj-track"
              role="progressbar"
              aria-label={p.name}
              aria-valuenow={Math.round(percent(p.tokens, projectPeak))}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span
                className="claude-proj-fill"
                style={{ width: `${percent(p.tokens, projectPeak)}%` }}
              />
            </span>
            <span className="claude-proj-value mono">{tokens(p.tokens)}</span>
          </div>
        ))}
      </div>

      {stats.byModel.length > 0 && (
        <div className="chips">
          {stats.byModel.map((m) => (
            <span key={m.name} className="chip claude-chip">
              {m.name}
              <span className="chip-value mono">{tokens(m.tokens)}</span>
            </span>
          ))}
        </div>
      )}

      {stats.activeProjects.length > 0 && (
        <div className="card-meta">
          сейчас: <span className="strong">{stats.activeProjects.join(", ")}</span>
        </div>
      )}

      {stats.lastLimitHit && (
        <div className="card-meta">
          последний лимит <span className="mono strong">{shortDate(stats.lastLimitHit)}</span>
        </div>
      )}
    </section>
  );
}
