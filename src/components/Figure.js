// Small stick figure that shows the movement type of an exercise. Colours come from index.css.
const FIG = {
  push: '<path class="fg" d="M46 20L12 30M44 22v12M12 30l-6 4M4 37h48"/><circle class="fh" cx="50" cy="16" r="4.5"/>',
  pull: '<path class="fg" d="M12 5h32M28 18v12M28 19L21 5M28 19l7-14M28 30l-4 8M28 30l4 8"/><circle class="fh" cx="28" cy="13" r="4.5"/>',
  legs: '<path class="fg" d="M24 13l-4 10 10 4v9M22 16l13-1M10 38h36"/><circle class="fh" cx="25" cy="8" r="4.5"/>',
  core: '<path class="fg" d="M22 14l8 16 14-16M23 18l16 2M8 37h40"/><circle class="fh" cx="20" cy="9" r="4.5"/>',
  cardio: '<path class="fg" d="M28 14v12M28 16L15 6M28 16l13-10M28 26l-10 12M28 26l10 12"/><circle class="fh" cx="28" cy="9" r="4.5"/>',
  mobility: '<path class="fg" d="M22 15l4 11h14v10M26 26L12 36M22 17l9-9M6 38h40"/><circle class="fh" cx="21" cy="10" r="4.5"/>',
};

export default function Figure({ group }) {
  return <svg viewBox="0 0 56 40" aria-hidden="true" dangerouslySetInnerHTML={{ __html: FIG[group] || '' }} />;
}
