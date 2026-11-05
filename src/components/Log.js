import { useEffect, useState } from 'react';
import { EX, GROUPS } from '../data/exercises';
import { addDays, pad, parseYmd, streak, uid, ymd } from '../utils';

function Chart({ per, labels }) {
  const max = Math.max(...per);
  const top = Math.max(4, Math.ceil(max / 2) * 2);
  const W = 560, H = 190, L = 30, B = 26, T = 14, R = 8;
  const ph = H - T - B;
  const bw = (W - L - R) / 7;
  const y = (v) => T + ph - (v / top) * ph;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Sets per day for the last seven days">
      {[0, top / 2, top].map((v) => (
        <g key={v}>
          <line className="c-ax" x1={L} x2={W - R} y1={y(v)} y2={y(v)} />
          <text className="c-txt" x={L - 6} y={y(v) + 4} textAnchor="end">{v}</text>
        </g>
      ))}
      {per.map((v, i) => {
        const x = L + i * bw + bw * 0.2;
        const w = bw * 0.6;
        return (
          <g key={labels[i] + i}>
            {v > 0 && (
              <>
                <rect className="c-bar" x={x} y={y(v)} width={w} height={(v / top) * ph} rx="2" />
                <text className="c-txt" x={x + w / 2} y={y(v) - 4} textAnchor="middle">{v}</text>
              </>
            )}
            <text className="c-txt" x={x + w / 2} y={H - 8} textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Log({ log, setLog, preset, onPresetUsed }) {
  const [form, setForm] = useState({ ex: EX[0].n, kg: '0', reps: '10', sets: '3', date: ymd(new Date()) });
  const [left, setLeft] = useState(null); // seconds left on the rest timer, null when idle

  useEffect(() => {
    if (preset) {
      setForm((f) => ({ ...f, ex: preset }));
      onPresetUsed();
    }
  }, [preset, onPresetUsed]);

  useEffect(() => {
    if (left === null || left <= 0) return undefined;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const field = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const reps = parseInt(form.reps, 10);
    const sets = parseInt(form.sets, 10);
    if (!(reps > 0) || !(sets > 0)) return;
    setLog((l) => [...l, { id: uid(), date: form.date || ymd(new Date()), ex: form.ex, kg: parseFloat(form.kg) || 0, reps, sets }]);
  };

  // last 7 days
  const today = new Date();
  const days = [6, 5, 4, 3, 2, 1, 0].map((n) => addDays(today, -n));
  const per = days.map((d) => log.filter((e) => e.date === ymd(d)).reduce((a, e) => a + e.sets, 0));
  const labels = days.map((d) => d.toLocaleDateString('en-IN', { weekday: 'short' }));
  const sessions = per.filter((n) => n > 0).length;
  const sets = per.reduce((a, b) => a + b, 0);
  const run = streak(log.map((e) => e.date));

  const sorted = [...log].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const byDate = [];
  sorted.forEach((e) => {
    const last = byDate[byDate.length - 1];
    if (last && last.date === e.date) last.items.push(e);
    else byDate.push({ date: e.date, items: [e] });
  });

  const clock = left === null ? '0:00' : left > 0 ? `${Math.floor(left / 60)}:${pad(left % 60)}` : 'Go';

  return (
    <section className="view">
      <div>
        <div className="kicker">Workout log</div>
        <h1 className="h1">Write down every set</h1>
        <p className="lede">Entries stay in this browser. Add a set, check the last seven days, and use the timer between sets.</p>
      </div>

      <div className="split">
        <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
          <form className="panel" onSubmit={submit} autoComplete="off">
            <div className="fgrid">
              <div className="wide">
                <label htmlFor="lg-ex">Exercise</label>
                <select id="lg-ex" value={form.ex} onChange={field('ex')}>
                  {GROUPS.map(([g, name]) => (
                    <optgroup key={g} label={name}>
                      {EX.filter((e) => e.g === g).map((e) => (
                        <option key={e.id} value={e.n}>{e.n}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lg-kg">Weight (kg)</label>
                <input id="lg-kg" type="number" min="0" step="0.5" value={form.kg} onChange={field('kg')} />
              </div>
              <div>
                <label htmlFor="lg-reps">Reps / secs</label>
                <input id="lg-reps" type="number" min="1" step="1" value={form.reps} onChange={field('reps')} />
              </div>
              <div>
                <label htmlFor="lg-sets">Sets</label>
                <input id="lg-sets" type="number" min="1" step="1" value={form.sets} onChange={field('sets')} />
              </div>
              <div className="wide">
                <label htmlFor="lg-date">Date</label>
                <input id="lg-date" type="date" value={form.date} onChange={field('date')} />
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="btn" type="submit">Add to log</button>
            </div>
          </form>

          <div className="panel">
            <span className="lab">Rest timer</span>
            <div className="timer">
              <span className="clock">{clock}</span>
              {[30, 60, 90].map((s) => (
                <button key={s} className="btn ghost small" type="button" onClick={() => setLeft(s)}>{s} s</button>
              ))}
              <button className="btn ghost small" type="button" onClick={() => setLeft(null)}>Stop</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
          <div className="panel">
            <div className="stats">
              <div className="stat"><b className="mono">{sessions}</b><span>Sessions</span></div>
              <div className="stat"><b className="mono">{sets}</b><span>Sets</span></div>
              <div className="stat"><b className="mono">{run}</b><span>Day streak</span></div>
            </div>
            <div className="lab">Sets per day, last 7 days</div>
            <div className="chartbox"><Chart per={per} labels={labels} /></div>
          </div>

          <div className="panel entries">
            {log.some((e) => e.sample) && (
              <div className="banner">
                <span>Showing sample sessions so you can see how the log looks.</span>
                <button className="btn ghost small" type="button" onClick={() => setLog((l) => l.filter((e) => !e.sample))}>
                  Clear samples
                </button>
              </div>
            )}
            {byDate.length === 0 && <p className="empty">No sets logged yet. Add your first set above.</p>}
            {byDate.map((g) => (
              <div key={g.date}>
                <h3>{parseYmd(g.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</h3>
                {g.items.map((e) => (
                  <div className="entry" key={e.id}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{e.ex}</span>
                      {e.sample && <span className="tag">sample</span>}
                      <div className="d">{e.sets} × {e.reps}{e.kg ? ` @ ${e.kg} kg` : ' bodyweight'}</div>
                    </div>
                    <button className="btn ghost small" type="button" aria-label="Delete entry" onClick={() => setLog((l) => l.filter((x) => x.id !== e.id))}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
