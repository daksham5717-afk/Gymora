import { useEffect, useState } from 'react';

export const VIEWS = ['shop', 'plan', 'log', 'cart'];

const read = () => {
  const h = (window.location.hash || '#shop').slice(1);
  return VIEWS.includes(h) ? h : 'shop';
};

// Tiny hash router: #shop, #plan, #log, #cart.
export default function useHashRoute() {
  const [view, setView] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setView(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return view;
}
