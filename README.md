# Gymora

A home workout app for Gymora, built with React (Create React App). It has a shop, a weekly workout planner and a set log. Product photos, banners and lifestyle images come from the Gymora Image Asset Pack.

## Getting started

You need Node.js 18 or newer.

```
npm install
npm start
```

The app opens at http://localhost:3000. To make a production build, run `npm run build`. The `build` folder uses relative paths, so you can upload it to any static host or open it from a subfolder.

## Folder layout

```
gymora/
  public/
    index.html            page shell, favicon and Google Fonts links
    favicon.png, logo192.png
    images/
      hero.jpg            website hero banner
      logo-icon.png       "G" mark shown in the header
      products/           16 product photos (one per product id)
      categories/         4 category banners that also filter the shop
      lifestyle/          4 lifestyle photos in the "Train at home" strip
  src/
    index.js              entry point
    index.css             all styles, with light and dark tokens at the top
    App.js                holds the saved state and shows the current view
    App.test.js           smoke tests (run with `npm test`)
    components/
      Header.js           logo, tabs and cart count
      Shop.js             hero, floor-space field, category banners, product cards, gallery
      Plan.js             equipment, goal and time controls, weekly plan
      Log.js              set form, rest timer, 7-day chart, entries
      Cart.js             cart lines, totals, coupon, demo checkout
      Figure.js           small movement figures in the plan
    data/
      products.js         the 16 products and 4 categories (edit this for real prices and specs)
      exercises.js        exercise library and the equipment each one needs
      planner.js          weekly plan generator
    hooks/
      useLocalStorage.js  useState that saves to the browser
      useHashRoute.js     small router for #shop, #plan, #log, #cart
    utils.js              money, dates, cart totals, streak
  package.json
  README.md
```

## What it does

- **Shop:** hero banner, four category banners that filter the list, and a floor-space field that marks each product as fitting or not.
- **Cart and checkout:** quantity controls, GST-inclusive prices in rupees, free delivery over Rs 4,999, coupon `GYMORA10` for 10% off, and a demo checkout.
- **Plan:** choose the equipment you own, a goal, days per week and session length. The plan uses only exercises you can do, and suggests the next product to buy.
- **Log:** record sets, see sessions, sets and streak for the last 7 days, and use the rest timer.

## Things to know

- Product names, categories and pack sizes come from the asset pack. Prices, floor space and the other specs in `src/data/products.js` are placeholders.
- The asset pack has no treadmill photo, so the treadmill from the earlier version is not in the shop.
- The images were cropped out of the pack PDF, which only holds small previews (about 150 to 190 px wide per product). They look sharp at card size but will look soft if shown much larger. For full-size use, ask for the original files (the pack lists 1200 x 1200 px product images and a 1920 x 800 px hero banner) and replace the files in `public/images` using the same names.
- The hero banner is cropped just below the top edge of the PDF preview, where the original image was damaged.
- Colours follow the pack: primary #111827, accent #00CFFF, background #F8FAFC, surface #FFFFFF. The pack suggests Montserrat and Inter. This version still uses Big Shoulders Display, Archivo and IBM Plex Mono. Change the font links in `public/index.html` and the `--f-*` variables in `src/index.css` to switch.
- Checkout is a demo. No payment is taken and nothing is sent anywhere.
- The cart, plan settings and log are saved in the browser with `localStorage`, so they stay on that device only.
