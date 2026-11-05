import { useRef, useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { money } from '../utils';

const IMG = (path) => `${process.env.PUBLIC_URL}/images/${path}`;

const LIFESTYLE = [
  ['lifestyle/curl.jpg', 'A man curling a dumbbell in a home gym'],
  ['lifestyle/room.jpg', 'A bright room with a folding bench, a dumbbell rack, a plant and a squat rack'],
  ['lifestyle/yoga.jpg', 'A woman meditating on a mat in a home workout room'],
  ['lifestyle/corner.jpg', 'A corner with kettlebell, dumbbells, a roller and a plant on a wooden floor'],
];

function ProductCard({ product: p, room, inCart, onAdd }) {
  const fits = p.fp <= room;
  return (
    <article className="card">
      <div className="tile">
        <img src={p.img} alt={p.name} loading="lazy" />
        <span className={'fit ' + (fits ? 'ok' : 'no')}>{fits ? 'Fits' : `Needs ${p.fp.toFixed(1)} m²`}</span>
      </div>
      <h3>{p.name}</h3>
      <p className="blurb">{p.blurb}</p>
      <dl className="specs">
        <div>
          <dt>{p.sl}</dt>
          <dd>{p.sv}</dd>
        </div>
        <div>
          <dt>Floor space</dt>
          <dd>{p.fp ? `${p.fp.toFixed(1)} m²` : 'Door or wall'}</dd>
        </div>
      </dl>
      <div className="buy">
        <span className="price">{money(p.price)}</span>
        <button className="btn" type="button" onClick={() => onAdd(p.id)}>
          {inCart ? `Add another (${inCart})` : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}

export default function Shop({ room, setRoom, cart, onAdd }) {
  const [cat, setCat] = useState('all');
  const [roomText, setRoomText] = useState(String(room));
  const gridRef = useRef(null);
  const list = PRODUCTS.filter((p) => cat === 'all' || p.cat === cat);
  const catName = (CATEGORIES.find((c) => c.id === cat) || {}).name;

  const onRoom = (e) => {
    setRoomText(e.target.value);
    const v = parseFloat(e.target.value);
    setRoom(Number.isNaN(v) ? 0 : v);
  };

  const toGrid = (e) => {
    e.preventDefault();
    if (gridRef.current) gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pick = (id) => {
    setCat(id);
    if (gridRef.current) gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="view">
      <h1 className="sr-only">Gymora home workout equipment</h1>

      <div className="hero">
        <a className="hero-link" href="#shop" onClick={toGrid} aria-label="Shop the collection">
          <img
            src={IMG('hero.jpg')}
            alt="Gear that fits the room you have. Premium home workout equipment for a stronger, healthier you."
          />
        </a>
        <div className="panel hero-info">
          <div className="kicker">Home workout equipment</div>
          <p className="lede" style={{ margin: 0 }}>
            Enter your free floor space and every product is marked if it fits.
          </p>
          <div className="room">
            <label htmlFor="room" style={{ margin: 0 }}>Free floor space</label>
            <input id="room" type="number" min="0" max="40" step="0.5" value={roomText} onChange={onRoom} />
            <span className="note">m²</span>
          </div>
          <ul className="facts">
            <li>Prices are in rupees and include GST</li>
            <li>Free delivery over ₹4,999</li>
            <li>Coupon <span className="mono">GYMORA10</span> takes 10% off</li>
          </ul>
        </div>
      </div>

      <div className="cats" role="group" aria-label="Shop by category">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="cat" type="button" aria-pressed={cat === c.id} onClick={() => pick(c.id)}>
            <img src={IMG(`categories/${c.image}.jpg`)} alt="" />
            <span className="sr-only">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="results" ref={gridRef}>
        <button className="chip" type="button" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
          All products
        </button>
        <span className="note" role="status">
          {cat === 'all' ? `${list.length} products` : `${list.length} of ${PRODUCTS.length} products in ${catName}`}
        </span>
      </div>

      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} room={room} inCart={cart[p.id] || 0} onAdd={onAdd} />
        ))}
      </div>

      <div>
        <h2 className="h2">Train at home</h2>
        <p className="note" style={{ margin: '6px 0 14px' }}>Sample images from the Gymora asset pack.</p>
        <div className="gallery">
          {LIFESTYLE.map(([src, alt]) => (
            <img key={src} src={IMG(src)} alt={alt} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
