import { PRODUCTS } from './data/products';

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const money = (n) => INR.format(n);

export const pad = (n) => String(n).padStart(2, '0');
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = (d, n) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
};
export const parseYmd = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const FREE_DELIVERY_AT = 4999;
export const DELIVERY_FEE = 149;
export const COUPON_CODE = 'GYMORA10';

export const cartCount = (cart) => Object.values(cart).reduce((a, b) => a + b, 0);

// Prices include 18% GST. Coupon takes 10% off the subtotal.
export function totals(cart, coupon) {
  let sub = 0;
  Object.keys(cart).forEach((id) => {
    const p = getProduct(id);
    if (p) sub += p.price * cart[id];
  });
  const disc = coupon ? Math.round(sub * 0.1) : 0;
  const after = sub - disc;
  const ship = after === 0 || after >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  const total = after + ship;
  return { sub, disc, after, ship, total, gst: Math.round((total * 18) / 118) };
}

// Example sessions so the log and chart are not empty on first open.
export function seedLog() {
  const today = new Date();
  const rows = [
    [6, 'Dumbbell goblet squat', 12, 10, 3],
    [6, 'Dumbbell row', 14, 10, 3],
    [4, 'Push-up', 0, 12, 3],
    [4, 'Dumbbell shoulder press', 8, 8, 3],
    [2, 'Kettlebell swing', 12, 15, 4],
    [2, 'Reverse lunge', 10, 10, 3],
    [1, 'Dumbbell Romanian deadlift', 14, 10, 3],
    [1, 'Band row', 0, 15, 3],
  ];
  return rows.map(([ago, ex, kg, reps, sets]) => ({ id: uid(), date: ymd(addDays(today, -ago)), ex, kg, reps, sets, sample: true }));
}

// Consecutive days with a logged set, ending today (or yesterday if today is empty).
export function streak(dates) {
  const set = new Set(dates);
  let d = new Date();
  if (!set.has(ymd(d))) d = addDays(d, -1);
  let n = 0;
  while (set.has(ymd(d))) {
    n += 1;
    d = addDays(d, -1);
  }
  return n;
}
