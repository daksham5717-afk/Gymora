import { useMemo } from 'react';
import Figure from './Figure';
import { PRODUCTS } from '../data/products';
import { GOAL_NOTE, genPlan, scheme, unlockTip } from '../data/planner';
import { getProduct } from '../utils';

function Segmented({ label, options, value, onChange }) {
  return (
    <div>
      <span className="lab">{label}</span>
      <div className="seg" role="group" aria-label={label}>
        {options.map(([v, text]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Plan({ plan, setPlan, onLog }) {
  const days = useMemo(() => genPlan(plan), [plan]);
  const tip = useMemo(() => unlockTip(plan.own), [plan.own]);
  const total = days.reduce((a, d) => a + d.items.length, 0);

  const toggle = (id) =>
    setPlan((p) => ({ ...p, own: p.own.includes(id) ? p.own.filter((x) => x !== id) : [...p.own, id] }));
  const set = (key) => (value) => setPlan((p) => ({ ...p, [key]: value }));

  return (
    <section className="view">
      <div>
        <div className="kicker">Weekly planner</div>
        <h1 className="h1">A week of training from what you own</h1>
        <p className="lede">
          Pick your equipment, goal and time. The plan only uses exercises you can do today and shows what the next
          piece of gear would add.
        </p>
      </div>

      <div className="split">
        <div className="panel ctrl">
          <div>
            <span className="lab">Equipment you own</span>
            <div className="chips tight" role="group" aria-label="Equipment you own">
              {PRODUCTS.map((p) => (
                <button key={p.id} className="chip" type="button" aria-pressed={plan.own.includes(p.id)} onClick={() => toggle(p.id)}>
                  {p.short}
                </button>
              ))}
            </div>
          </div>
          <Segmented
            label="Goal"
            value={plan.goal}
            onChange={set('goal')}
            options={[['strength', 'Strength'], ['fat', 'Fat loss'], ['mobile', 'Mobility']]}
          />
          <Segmented label="Days per week" value={plan.days} onChange={set('days')} options={[[3, '3'], [4, '4'], [5, '5']]} />
          <Segmented
            label="Session length"
            value={plan.mins}
            onChange={set('mins')}
            options={[[20, '20 min'], [30, '30 min'], [45, '45 min']]}
          />
          <p className="note" style={{ margin: 0 }}>{GOAL_NOTE[plan.goal]}</p>
        </div>

        <div style={{ display: 'grid', gap: 14, minWidth: 0 }}>
          <div className="note">
            {plan.days} days a week, about {plan.mins} minutes each, {total} exercises in total. Start every session
            with 5 minutes of easy movement.
          </div>
          <div className="days">
            {days.map((d) => (
              <div className="day" key={d.label}>
                <header>
                  <span className="h2" style={{ fontSize: '1.35rem' }}>{d.label}</span>
                  <span className="mono note">{d.weekday}</span>
                </header>
                <ul>
                  {d.items.map((e) => {
                    const s = scheme(e, plan.goal);
                    const eq = e.eq.length
                      ? e.eq.map((req) => req.split('|').map((id) => getProduct(id).short).join(' or ')).join(' + ')
                      : 'No equipment';
                    return (
                      <li key={e.id}>
                        <span className="fig"><Figure group={e.g} /></span>
                        <span className="nm">{e.n}</span>
                        <button className="btn ghost small" type="button" onClick={() => onLog(e.n)}>Log</button>
                        <span className="meta">
                          <span className="mono">{s.sets}</span> · rest {s.rest} · {eq}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          {tip && (
            <div className="tip">
              <span>
                The {tip.product.name} unlocks {tip.k} more exercise{tip.k > 1 ? 's' : ''} in this plan.
              </span>
              <a className="btn small" style={{ textDecoration: 'none' }} href="#shop">View in shop</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
