// Product line from the Gymora Image Asset Pack. Names, categories and the pack sizes come from the pack.
// Prices, floor space and the other specs are placeholders: replace them with Gymora's real figures.
// fp = floor space in square metres (0 means it mounts on a door or wall).
const img = (name) => `${process.env.PUBLIC_URL}/images/products/${name}.jpg`;

export const CATEGORIES = [
  { id: 'strength', name: 'Strength Training', image: 'strength' },
  { id: 'mobility', name: 'Mobility & Recovery', image: 'mobility' },
  { id: 'homegym', name: 'Home Gym Essentials', image: 'home-gym' },
  { id: 'yoga', name: 'Yoga & Wellness', image: 'yoga' },
];

export const PRODUCTS = [
  // Strength Training
  { id: 'dumbbells', cat: 'strength', short: 'Adjustable dumbbells', name: 'Adjustable Dumbbell Set', price: 14999, fp: 0.3, sl: 'Load', sv: '2–24 kg', blurb: 'Dial from 2 to 24 kg per hand. One pair replaces a rack of fixed weights.', img: img('dumbbells') },
  { id: 'hex', cat: 'strength', short: 'Hex dumbbells', name: 'Hex Dumbbell Pair', price: 3999, fp: 0.2, sl: 'Weight', sv: '2 × 10 kg', blurb: 'Rubber-coated hex heads that stay put on the floor, with a chrome handle.', img: img('hex') },
  { id: 'plates', cat: 'strength', short: 'Weight plates', name: 'Weight Plates', price: 2499, fp: 0.3, sl: 'Sizes', sv: '2.5 / 5 / 10 / 15 kg', blurb: 'Cast plates with clear weight marks. Add them to a bar as you get stronger.', img: img('plates') },
  { id: 'kettlebell', cat: 'strength', short: 'Kettlebell', name: 'Kettlebell 16 kg', price: 2999, fp: 0.2, sl: 'Range', sv: '4 / 8 / 12 / 16 / 24 kg', blurb: 'Flat base and a wide handle for swings and squats. Shown in 16 kg.', img: img('kettlebell') },
  // Mobility & Recovery
  { id: 'bands', cat: 'mobility', short: 'Bands', name: 'Resistance Band Kit', price: 1499, fp: 0.1, sl: 'Levels', sv: '5 bands, light to heavy', blurb: 'Five loop bands in five colours, with a carry bag.', img: img('bands') },
  { id: 'foam', cat: 'mobility', short: 'Foam roller', name: 'Foam Roller', price: 999, fp: 0.4, sl: 'Use', sv: 'Muscle recovery', blurb: 'Firm studded roller for back, hips and legs after a session.', img: img('foam') },
  // Home Gym Essentials
  { id: 'bench', cat: 'homegym', short: 'Bench', name: 'Folding Flat Bench', price: 8499, fp: 0.9, sl: 'Use', sv: 'Home workout bench', blurb: 'Padded flat bench on a steel frame that folds away for storage.', img: img('bench') },
  { id: 'pullup', cat: 'homegym', short: 'Doorway bar', name: 'Doorway Pull-up Bar', price: 1999, fp: 0, sl: 'Width', sv: 'Adjustable', blurb: 'Clamps to a door frame without drilling, with foam grips.', img: img('pullup') },
  { id: 'wallbar', cat: 'homegym', short: 'Wall bar', name: 'Wall Mount Pull-up Bar', price: 3499, fp: 0, sl: 'Build', sv: 'Heavy duty', blurb: 'Bolts to the wall for a fixed, stable bar with multiple grip positions.', img: img('wallbar') },
  { id: 'dip', cat: 'homegym', short: 'Dip station', name: 'Dip Station', price: 5999, fp: 1.0, sl: 'Use', sv: 'Bodyweight training', blurb: 'Two parallel bars with padded grips for dips, raises and L-sits.', img: img('dip') },
  { id: 'pushbars', cat: 'homegym', short: 'Push-up bars', name: 'Push-up Bars', price: 799, fp: 0.2, sl: 'Pack', sv: 'Pair', blurb: 'Raised grips that let you go deeper and keep wrists straight.', img: img('pushbars') },
  { id: 'roller', cat: 'homegym', short: 'Ab wheel', name: 'Ab Roller Wheel', price: 899, fp: 0.8, sl: 'Use', sv: 'Core training', blurb: 'Wide wheel with foam grips for core rollouts.', img: img('roller') },
  { id: 'rope', cat: 'homegym', short: 'Jump rope', name: 'Skipping Rope', price: 699, fp: 2.0, sl: 'Cable', sv: 'Adjustable', blurb: 'Bearing handles with a cable you can shorten to your height.', img: img('rope') },
  // Yoga & Wellness
  { id: 'mat', cat: 'yoga', short: 'Mat', name: 'Yoga Mat', price: 1299, fp: 1.8, sl: 'Thickness', sv: '6 / 8 / 10 mm', blurb: 'Dense, non-slip mat for floor work, core and stretching.', img: img('mat') },
  { id: 'block', cat: 'yoga', short: 'Yoga block', name: 'Yoga Block (Pair)', price: 599, fp: 0.2, sl: 'Use', sv: 'Support and flexibility', blurb: 'Firm foam blocks that bring the floor closer in deep stretches.', img: img('block') },
  { id: 'strap', cat: 'yoga', short: 'Yoga strap', name: 'Yoga Strap', price: 499, fp: 0.1, sl: 'Use', sv: 'Stretching and mobility', blurb: 'Wide strap with a locking buckle for hamstring and shoulder work.', img: img('strap') },
];
