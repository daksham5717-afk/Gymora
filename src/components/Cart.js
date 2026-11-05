import { useState } from 'react';
import { COUPON_CODE, FREE_DELIVERY_AT, addDays, getProduct, money, totals } from '../utils';

const EMPTY_FORM = { name: '', phone: '', pin: '', addr: '', pay: 'UPI' };

function validate(f) {
  const err = {};
  if (f.name.trim().length < 2) err.name = 'Enter your full name.';
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\s/g, ''))) err.phone = 'Enter a 10 digit mobile number.';
  if (!/^\d{6}$/.test(f.pin.trim())) err.pin = 'Enter a 6 digit PIN code.';
  if (f.addr.trim().length < 8) err.addr = 'Enter the full delivery address.';
  return err;
}

export default function Cart({ cart, coupon, setCoupon, onQty, onRemove, onClear }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [couponText, setCouponText] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [order, setOrder] = useState(null);

  const lines = Object.keys(cart).map((id) => ({ p: getProduct(id), qty: cart[id] })).filter((l) => l.p);
  const has = lines.length > 0;
  const t = totals(cart, coupon);
  const pct = Math.min(100, Math.round((t.after / FREE_DELIVERY_AT) * 100));
  const field = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const applyCoupon = () => {
    const code = couponText.trim().toUpperCase();
    if (code === COUPON_CODE) {
      setCoupon(true);
      setCouponMsg('');
    } else {
      setCouponMsg(code ? `That code is not valid. Try ${COUPON_CODE}.` : 'Enter a code first.');
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate(form);
    setErrors(err);
    if (Object.keys(err).length) return;
    setOrder({
      id: 'GYM-' + Math.floor(100000 + Math.random() * 900000),
      name: form.name.trim(),
      items: lines.map((l) => `${l.p.name} × ${l.qty}`).join(', '),
      total: t.total,
      pay: form.pay,
      eta: addDays(new Date(), 4),
    });
    onClear();
    window.scrollTo(0, 0);
  };

  return (
    <section className="view">
      <div>
        <div className="kicker">Your cart</div>
        <h1 className="h1">Check out</h1>
      </div>

      {order ? (
        <div className="done">
          <div className="h2">Order placed (demo)</div>
          <div>Order <span className="mono">{order.id}</span> for {order.name}</div>
          <div className="note">{order.items}</div>
          <div>
            Total <span className="mono">{money(order.total)}</span> · {order.pay} · Delivery by{' '}
            {order.eta.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="note">This is a demo checkout. No payment was taken and no order was sent.</div>
          <div>
            <a className="btn" style={{ textDecoration: 'none', display: 'inline-block' }} href="#shop">Keep shopping</a>
          </div>
        </div>
      ) : (
        <div className="split">
          <div className="panel" style={{ minWidth: 0 }}>
            {!has && <p className="empty">Your cart is empty. <a href="#shop">Browse the shop</a></p>}
            {lines.map(({ p, qty }) => (
              <div className="line" key={p.id}>
                <div className="ic"><img src={p.img} alt={p.name} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className="note mono">{money(p.price)} each</div>
                </div>
                <div className="rt">
                  <span className="mono">{money(p.price * qty)}</span>
                  <span className="qty">
                    <button type="button" aria-label="Fewer" onClick={() => onQty(p.id, -1)}>−</button>
                    <span>{qty}</span>
                    <button type="button" aria-label="More" onClick={() => onQty(p.id, 1)}>+</button>
                  </span>
                  <button className="btn ghost small" type="button" onClick={() => onRemove(p.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {has && (
            <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
              <div className="panel">
                <div className="trow"><span>Subtotal</span><span className="mono">{money(t.sub)}</span></div>
                {t.disc > 0 && (
                  <div className="trow"><span>Coupon {COUPON_CODE}</span><span className="mono">−{money(t.disc)}</span></div>
                )}
                <div className="trow"><span>Delivery</span><span className="mono">{t.ship ? money(t.ship) : 'Free'}</span></div>
                <div className="trow total"><span>Total</span><span className="mono">{money(t.total)}</span></div>
                <div className="note">Includes GST of {money(t.gst)}.</div>
                <div className="bar"><i style={{ width: pct + '%' }} /></div>
                <div className="note">
                  {t.after >= FREE_DELIVERY_AT ? 'Free delivery applied.' : `Add ${money(FREE_DELIVERY_AT - t.after)} more for free delivery.`}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label htmlFor="coupon">Coupon code</label>
                  <div className="row">
                    <input id="coupon" type="text" placeholder={COUPON_CODE} style={{ width: 150, textTransform: 'uppercase' }} value={couponText} onChange={(e) => setCouponText(e.target.value)} />
                    <button className="btn ghost small" type="button" onClick={applyCoupon}>Apply</button>
                  </div>
                  <div className="err" role="status">{couponMsg}</div>
                </div>
              </div>

              <form className="panel" onSubmit={submit} noValidate autoComplete="on">
                <div className="h2" style={{ marginBottom: 14 }}>Delivery</div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <label htmlFor="f-name">Full name</label>
                    <input id="f-name" type="text" autoComplete="name" value={form.name} onChange={field('name')} />
                    <div className="err">{errors.name}</div>
                  </div>
                  <div className="fgrid" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
                    <div>
                      <label htmlFor="f-phone">Mobile number</label>
                      <input id="f-phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10 digits" value={form.phone} onChange={field('phone')} />
                      <div className="err">{errors.phone}</div>
                    </div>
                    <div>
                      <label htmlFor="f-pin">PIN code</label>
                      <input id="f-pin" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" value={form.pin} onChange={field('pin')} />
                      <div className="err">{errors.pin}</div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="f-addr">Address</label>
                    <textarea id="f-addr" rows="3" autoComplete="street-address" value={form.addr} onChange={field('addr')} />
                    <div className="err">{errors.addr}</div>
                  </div>
                  <div>
                    <span className="lab">Payment</span>
                    <div className="pay">
                      {['UPI', 'Card', 'Cash on delivery'].map((m) => (
                        <label key={m}>
                          <input type="radio" name="pay" value={m} checked={form.pay === m} onChange={field('pay')} /> {m}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="btn" type="submit">Place order</button>
                  <p className="note" style={{ margin: 0 }}>Demo checkout. No payment is taken and nothing leaves this page.</p>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
