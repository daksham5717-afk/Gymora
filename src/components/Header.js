const TABS = [
  ['shop', 'Shop'],
  ['plan', 'Plan'],
  ['log', 'Log'],
];

export default function Header({ view, count }) {
  return (
    <header className="top wrap">
      <a className="brand" href="#shop">
        <img src={`${process.env.PUBLIC_URL}/images/logo-icon.png`} alt="" width="34" height="34" />
        <span>GYMORA</span>
      </a>
      <nav className="nav" aria-label="Sections">
        {TABS.map(([id, label]) => (
          <a key={id} href={'#' + id} aria-current={view === id ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <a className="cartlink" href="#cart" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
        Cart <b data-n={count}>{count}</b>
      </a>
    </header>
  );
}
