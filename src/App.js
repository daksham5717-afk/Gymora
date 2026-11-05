import { useCallback, useState } from 'react';
import Header from './components/Header';
import Shop from './components/Shop';
import Plan from './components/Plan';
import Log from './components/Log';
import Cart from './components/Cart';
import useHashRoute from './hooks/useHashRoute';
import useLocalStorage from './hooks/useLocalStorage';
import { DEFAULT_PLAN } from './data/planner';
import { cartCount, seedLog } from './utils';

export default function App() {
  const view = useHashRoute();

  // Everything below is saved in this browser with localStorage.
  const [cart, setCart] = useLocalStorage('gymora.cart', {});
  const [coupon, setCoupon] = useLocalStorage('gymora.coupon', false);
  const [room, setRoom] = useLocalStorage('gymora.room', 6);
  const [plan, setPlan] = useLocalStorage('gymora.plan', DEFAULT_PLAN);
  const [log, setLog] = useLocalStorage('gymora.log', seedLog);
  const [preset, setPreset] = useState(null); // exercise picked from the plan, handed to the log form
  const clearPreset = useCallback(() => setPreset(null), []);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const changeQty = (id, delta) =>
    setCart((c) => {
      const n = (c[id] || 0) + delta;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  const clearCart = () => {
    setCart({});
    setCoupon(false);
  };
  const logExercise = (name) => {
    setPreset(name);
    window.location.hash = '#log';
  };

  return (
    <>
      <Header view={view} count={cartCount(cart)} />
      <main className="wrap">
        {view === 'shop' && <Shop room={room} setRoom={setRoom} cart={cart} onAdd={addToCart} />}
        {view === 'plan' && <Plan plan={plan} setPlan={setPlan} onLog={logExercise} />}
        {view === 'log' && <Log log={log} setLog={setLog} preset={preset} onPresetUsed={clearPreset} />}
        {view === 'cart' && (
          <Cart cart={cart} coupon={coupon} setCoupon={setCoupon} onQty={changeQty} onRemove={removeFromCart} onClear={clearCart} />
        )}
      </main>
    </>
  );
}
