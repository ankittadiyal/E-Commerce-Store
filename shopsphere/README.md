# ShopSphere

ShopSphere is a polished, responsive e-commerce storefront built from scratch with HTML5, CSS3, and vanilla JavaScript ES6 modules. It uses the Fake Store API for product data and LocalStorage for cart, wishlist, theme, and order persistence.

## Status

The project is being developed as a staged portfolio build. The initial structure and responsive visual foundation are in place.

## Tech stack

- HTML5 semantic markup
- CSS3 custom properties, grid, flexbox, and responsive media queries
- Vanilla JavaScript ES6 modules
- Fake Store API: https://fakestoreapi.com/
- LocalStorage for client-side state

## Run locally

Because this project uses ES modules, serve the `shopsphere` directory with a local static server:

```bash
cd shopsphere
python3 -m http.server 8000
```

Open http://localhost:8000 in a browser.

## Project structure

```text
shopsphere/
├── index.html
├── products.html
├── cart.html
├── checkout.html
├── css/
├── js/
└── assets/screenshots/
```

## License

Built as a portfolio project for demonstration and learning.
