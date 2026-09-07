import { initUI } from './ui.js';
import { initFeatured, initProducts } from './products.js';
import { initCart } from './cart.js';
import { initCheckout } from './checkout.js';

initUI();
if (document.body.dataset.page === 'home') initFeatured();
if (document.body.dataset.page === 'products') initProducts();
if (document.body.dataset.page === 'cart') initCart();
if (document.body.dataset.page === 'checkout') initCheckout();
