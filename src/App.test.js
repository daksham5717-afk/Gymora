import { act } from 'react';
import { createRoot } from 'react-dom/client';
import fs from 'fs';
import path from 'path';
import App from './App';
import { PRODUCTS, CATEGORIES } from './data/products';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

function mount() {
  window.localStorage.clear();
  window.location.hash = '#shop';
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  act(() => root.render(<App />));
  return el;
}

function go(hash) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

test('shop lists the products', () => {
  const el = mount();
  expect(el.textContent).toContain('Adjustable Dumbbell Set');
  expect(el.querySelectorAll('.card').length).toBe(16);
  expect(el.querySelectorAll('.card img').length).toBe(16);
});

test('adding a product updates the cart and totals', () => {
  const el = mount();
  act(() => el.querySelector('.card .btn').click());
  expect(el.querySelector('.cartlink b').textContent).toBe('1');
  go('#cart');
  expect(el.textContent).toContain('₹14,999');
});

test('plan and log views render', () => {
  const el = mount();
  go('#plan');
  expect(el.querySelectorAll('.day').length).toBe(3);
  go('#log');
  expect(el.querySelector('svg[role="img"]')).not.toBeNull();
  expect(el.textContent).toContain('Day streak');
});

test('every product and category image exists in public/', () => {
  const pub = path.join(__dirname, '..', 'public');
  PRODUCTS.forEach((p) => expect(fs.existsSync(path.join(pub, p.img))).toBe(true));
  CATEGORIES.forEach((c) => expect(fs.existsSync(path.join(pub, 'images', 'categories', c.image + '.jpg'))).toBe(true));
  ['hero.jpg', 'logo-icon.png'].forEach((f) => expect(fs.existsSync(path.join(pub, 'images', f))).toBe(true));
});

test('category tiles filter the shop', () => {
  const el = mount();
  act(() => el.querySelectorAll('.cat')[3].click()); // Yoga & Wellness
  expect(el.querySelectorAll('.card').length).toBe(3);
  act(() => el.querySelector('.results .chip').click()); // All products
  expect(el.querySelectorAll('.card').length).toBe(16);
});
