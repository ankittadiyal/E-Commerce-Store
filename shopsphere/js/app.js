import { initUI } from './ui.js';
import { initFeatured, initProducts } from './products.js';

initUI();
if (document.body.dataset.page === 'home') initFeatured();
if (document.body.dataset.page === 'products') initProducts();
