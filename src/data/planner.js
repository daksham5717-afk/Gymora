import { EX } from './exercises';
import { PRODUCTS } from './products';

export const DEFAULT_PLAN = { own: ['dumbbells', 'bands', 'mat'], goal: 'strength', days: 3, mins: 30 };

const TEMPL = {
  3: [
    { l: 'Full body A', g: ['legs', 'push', 'pull', 'core', 'legs', 'push'] },
    { l: 'Full body B', g: ['pull', 'legs', 'push', 'core', 'pull', 'legs'] },
    { l: 'Full body C', g: ['push', 'legs', 'pull', 'core', 'push', 'pull'] },
  ],
  4: [
    { l: 'Upper A', g: ['push', 'pull', 'push', 'pull', 'core', 'push'] },
    { l: 'Lower A', g: ['legs', 'legs', 'core', 'legs', 'cardio', 'core'] },
    { l: 'Upper B', g: ['pull', 'push', 'pull', 'push', 'core', 'pull'] },
    { l: 'Lower B', g: ['legs', 'legs', 'legs', 'core', 'cardio', 'legs'] },
  ],
  5: [
    { l: 'Push', g: ['push', 'push', 'push', 'core', 'push', 'core'] },
    { l: 'Legs', g: ['legs', 'legs', 'legs', 'core', 'legs', 'cardio'] },
    { l: 'Pull', g: ['pull', 'pull', 'pull', 'core', 'pull', 'core'] },
    { l: 'Core and cardio', g: ['core', 'cardio', 'core', 'cardio', 'core', 'cardio'] },
    { l: 'Full body', g: ['legs', 'push', 'pull', 'core', 'cardio', 'legs'] },
  ],
};

const WEEKDAYS = { 3: ['Mon', 'Wed', 'Fri'], 4: ['Mon', 'Tue', 'Thu', 'Fri'], 5: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };

export const GOAL_NOTE = {
  strength: 'Heavier loads, fewer reps, longer rests. Choose a weight where the last rep is hard but clean.',
  fat: 'Lighter loads, short rests and a cardio finisher each day.',
  mobile: 'Controlled reps and a mobility finisher each day.',
};

const REPS = { strength: '4 × 6', fat: '3 × 15', mobile: '3 × 10' };
const TIMED = { strength: '3 × 40 s', fat: '4 × 40 s', mobile: '2 × 45 s' };
const REST = { strength: '90 s', fat: '30 s', mobile: '30 s' };

// A requirement 'a|b' is met by owning a or b.
export const available = (e, own) => e.eq.every((req) => req.split('|').some((id) => own.includes(id)));

export function scheme(e, goal) {
  return { sets: e.t ? TIMED[goal] : REPS[goal], rest: REST[goal] };
}

// Builds the week: each day fills its slots with exercises the person can do,
// preferring equipment moves and avoiding repeats within the day and the week.
export function genPlan(plan) {
  const perDay = { 20: 3, 30: 4, 45: 6 }[plan.mins] || 4;
  const finisher = { strength: null, fat: 'cardio', mobile: 'mobility' }[plan.goal];
  const usedWeek = new Set();
  return TEMPL[plan.days].map((t, i) => {
    const groups = t.g.slice(0, perDay);
    if (finisher && perDay >= 3) groups[perDay - 1] = finisher;
    const usedToday = new Set();
    const items = [];
    groups.forEach((g) => {
      const can = EX.filter((e) => e.g === g && available(e, plan.own));
      const ordered = can.filter((e) => e.eq.length).concat(can.filter((e) => !e.eq.length));
      const fresh = ordered.filter((e) => !usedToday.has(e.id));
      const unseen = fresh.filter((e) => !usedWeek.has(e.id));
      const pick = (unseen.length ? unseen : fresh)[0];
      if (pick) {
        usedToday.add(pick.id);
        usedWeek.add(pick.id);
        items.push(pick);
      }
    });
    return { weekday: WEEKDAYS[plan.days][i], label: t.l, items };
  });
}

// The product that would unlock the most exercises that are not available yet.
export function unlockTip(own) {
  let best = null;
  PRODUCTS.forEach((p) => {
    if (own.includes(p.id)) return;
    const withIt = [...own, p.id];
    const k = EX.filter((e) => !available(e, own) && available(e, withIt)).length;
    if (k > 0 && (!best || k > best.k)) best = { product: p, k };
  });
  return best;
}
