import { useEffect, useState } from 'react';

// useState that remembers its value in this browser. Falls back quietly if storage is blocked.
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) {
      /* storage unavailable */
    }
    return typeof initial === 'function' ? initial() : initial;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable */
    }
  }, [key, value]);

  return [value, setValue];
}
