# ShopSphere

ShopSphere is a polished e-commerce storefront for considered everyday products. It is a portfolio project built from scratch with semantic HTML, responsive CSS, and modular vanilla JavaScript. Product data comes from the Fake Store API; cart, wishlist, theme preference, coupons, and order history persist in the browser.

## Features

- Editorial homepage with featured products, category entry points, newsletter feedback, and promotional content
- Fake Store API integration with loading and recoverable error states
- Product catalogue with search, category, price, rating, and combined sorting filters
- Product detail dialog with quantity selection and invalid-ID handling
- Add-to-bag and wishlist actions with live navigation counters
- Persistent cart with quantity controls, removal, empty state, shipping, subtotal, discount, and total calculations
- Demo coupons `SAVE10` and `SAVE20`
- Frontend-only checkout simulation with delivery fields, payment method selection, and native validation
- Fake order IDs, estimated delivery dates, confirmation view, and LocalStorage order history
- Light and dark themes with saved preference
- Toast feedback, loading states, back-to-top control, keyboard focus states, and responsive layouts

## Tech stack

- HTML5 semantic markup and accessible form labels
- CSS3 custom properties, Grid, Flexbox, transitions, and media queries
- Vanilla JavaScript ES6 modules with no framework or build step
- Fake Store API: <https://fakestoreapi.com/>
- LocalStorage and SessionStorage for client-side state

## Architecture

Pages stay intentionally small and delegate behavior to modules. `app.js` initializes only the page-specific features required by the current `data-page`. `api.js` owns network requests, `products.js` owns rendering and product interactions, `filters.js` owns filtering rules, `cart.js` owns cart calculations, and `checkout.js` owns order creation and history. `storage.js` is the persistence boundary, while `ui.js` provides shared counters, themes, and toast feedback.

## Project structure

```text
shopsphere/
├── index.html
├── products.html
├── cart.html
├── checkout.html
├── README.md
├── .gitignore
├── css/
│   ├── style.css
│   ├── products.css
│   ├── cart.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── api.js
│   ├── products.js
│   ├── cart.js
│   ├── filters.js
│   ├── wishlist.js
│   ├── checkout.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
└── assets/screenshots/
```

## JavaScript concepts demonstrated

- ES module imports and exports
- Async/await and guarded Fetch API requests
- Event delegation for dynamic product and cart controls
- URLSearchParams for shareable search, category, wishlist, and detail states
- Array filtering, sorting, mapping, and reduction for product and order data
- FormData, native constraint validation, and accessible status feedback
- Date formatting and generated order identifiers

## Run locally

ES modules must be served over HTTP rather than opened directly as a file:

```bash
cd shopsphere
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser. An internet connection is required for product data from the Fake Store API.

## Screenshots

The `assets/screenshots/` directory is ready for portfolio captures. Add desktop and mobile screenshots there when publishing a visual case study.

## Future improvements

- Add pagination and a server-backed account layer
- Replace demo payments with a PCI-compliant provider in a real backend
- Add automated browser tests and a production deployment pipeline
- Add product reviews and stock availability from a real catalogue service

## License

Built as a portfolio project for demonstration and learning.
