import { fetchProducts } from './api.js';
import { addToCart } from './cart.js';
import { filterProducts, initFilters } from './filters.js';
import { getStored, setStored, STORAGE_KEYS } from './storage.js';
import { escapeHtml, formatCurrency, getRating, stars, titleCase } from './utils.js';
import { showToast, updateCounters } from './ui.js';

let products = [];

function isWishlisted(id) { return getStored(STORAGE_KEYS.wishlist).some((product) => product.id === id); }

export function renderProductCard(product) {
	return `<article class="product-card"><div class="product-image-wrap"><button class="wishlist-button ${isWishlisted(product.id) ? 'active' : ''}" type="button" data-wishlist-id="${product.id}" aria-label="${isWishlisted(product.id) ? 'Remove' : 'Add'} ${escapeHtml(product.title)} ${isWishlisted(product.id) ? 'from' : 'to'} wishlist">${isWishlisted(product.id) ? '♥' : '♡'}</button><a href="products.html?id=${product.id}" data-view-product="${product.id}"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy"></a></div><div class="product-info"><p class="product-category">${escapeHtml(titleCase(product.category))}</p><a class="product-title" href="products.html?id=${product.id}">${escapeHtml(product.title)}</a><div class="product-meta"><span class="product-price">${formatCurrency(product.price)}</span><span class="product-rating" title="${getRating(product)} out of 5">${stars(getRating(product))}</span></div><button class="add-button" type="button" data-add-to-cart="${product.id}">Add to bag</button></div></article>`;
}

function showError(container, message) { container.innerHTML = `<div class="empty-state"><div class="empty-icon">!</div><h2>Something went off-script.</h2><p>${escapeHtml(message)}</p><button class="button button-dark" type="button" data-retry-products>Try again</button></div>`; }

function toggleWishlist(id) {
	const wishlist = getStored(STORAGE_KEYS.wishlist);
	const index = wishlist.findIndex((product) => product.id === id);
	if (index >= 0) { wishlist.splice(index, 1); showToast('Removed from your wishlist.'); }
	else { const product = products.find((item) => item.id === id); if (product) { wishlist.push(product); showToast('Added to your wishlist.'); } }
	setStored(STORAGE_KEYS.wishlist, wishlist);
	updateCounters();
	renderCurrentProducts();
}

function openProductDetails(product) {
	const modal = document.createElement('dialog');
	modal.className = 'product-modal';
	modal.setAttribute('aria-labelledby', `product-detail-${product.id}`);
	modal.innerHTML = `<button class="modal-close icon-button" type="button" data-close-modal aria-label="Close product details">&times;</button><div class="modal-image"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}"></div><div class="modal-copy"><p class="eyebrow">${escapeHtml(titleCase(product.category))}</p><h2 id="product-detail-${product.id}">${escapeHtml(product.title)}</h2><div class="modal-rating"><span>${stars(getRating(product))}</span> ${getRating(product)} / 5</div><p>${escapeHtml(product.description)}</p><strong class="modal-price">${formatCurrency(product.price)}</strong><div class="modal-actions"><div class="quantity-control"><button type="button" data-quantity-decrease aria-label="Decrease quantity">-</button><span data-modal-quantity>1</span><button type="button" data-quantity-increase aria-label="Increase quantity">+</button></div><button class="button button-dark" type="button" data-modal-add>Add to bag <span>&#8594;</span></button></div></div>`;
	document.body.append(modal);
	modal.showModal();
	let quantity = 1;
	modal.querySelector('[data-quantity-decrease]').addEventListener('click', () => { quantity = Math.max(1, quantity - 1); modal.querySelector('[data-modal-quantity]').textContent = quantity; });
	modal.querySelector('[data-quantity-increase]').addEventListener('click', () => { quantity += 1; modal.querySelector('[data-modal-quantity]').textContent = quantity; });
	modal.querySelector('[data-modal-add]').addEventListener('click', () => { addToCart(product, quantity); updateCounters(); showToast('Added to your bag.'); modal.close(); });
	modal.querySelector('[data-close-modal]').addEventListener('click', () => modal.close());
	modal.addEventListener('close', () => modal.remove());
}

let currentVisibleProducts = [];
function renderCurrentProducts() {
	const grid = document.querySelector('[data-products-grid]');
	if (!grid) return;
	grid.innerHTML = currentVisibleProducts.map(renderProductCard).join('');
	document.querySelector('[data-results-count]')?.replaceChildren(document.createTextNode(currentVisibleProducts.length));
	document.querySelector('[data-products-empty]')?.toggleAttribute('hidden', currentVisibleProducts.length > 0);
}

function bindProductActions() {
	document.addEventListener('click', (event) => {
		const wishlistButton = event.target.closest('[data-wishlist-id]');
		if (wishlistButton) { event.preventDefault(); toggleWishlist(Number(wishlistButton.dataset.wishlistId)); return; }
		const addButton = event.target.closest('[data-add-to-cart]');
		if (addButton) { const product = products.find((item) => item.id === Number(addButton.dataset.addToCart)); if (product) { addToCart(product); updateCounters(); showToast('Added to your bag.'); } return; }
		const detailLink = event.target.closest('[data-view-product]');
		if (detailLink) { event.preventDefault(); const product = products.find((item) => item.id === Number(detailLink.dataset.viewProduct)); if (product) openProductDetails(product); }
	});
}

export async function initFeatured() {
	const container = document.querySelector('[data-featured-products]');
	if (!container) return;
	try { products = await fetchProducts(); const featured = products.slice(0, 4); container.innerHTML = featured.map(renderProductCard).join(''); bindProductActions(); }
	catch (error) { showError(container, error.message); }
}

export async function initProducts() {
	const grid = document.querySelector('[data-products-grid]');
	if (!grid) return;
	try {
		products = await fetchProducts();
		const params = new URLSearchParams(window.location.search);
		if (params.get('wishlist') === 'true') {
			const wishlistIds = new Set(getStored(STORAGE_KEYS.wishlist).map((product) => product.id));
			products = products.filter((product) => wishlistIds.has(product.id));
		}
		const { filters } = initFilters({ initial: { search: params.get('search') || '', category: params.get('category') || 'all' }, onChange: (nextFilters) => { currentVisibleProducts = filterProducts(products, nextFilters); if (nextFilters.price) document.querySelector('[data-price-output]').textContent = formatCurrency(nextFilters.price); renderCurrentProducts(); } });
		const categorySelect = document.querySelector('[data-filter-category]');
		[...new Set(products.map((product) => product.category))].sort().forEach((category) => categorySelect?.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(category)}">${escapeHtml(titleCase(category))}</option>`));
		if (filters.category !== 'all') categorySelect.value = filters.category;
		currentVisibleProducts = filterProducts(products, filters);
		renderCurrentProducts();
		document.querySelectorAll('[data-clear-filters]').forEach((button) => button.addEventListener('click', () => window.location.assign('products.html')));
		bindProductActions();
		const requestedId = Number(params.get('id'));
		if (params.has('id')) {
			const requestedProduct = products.find((product) => product.id === requestedId);
			if (requestedProduct) openProductDetails(requestedProduct);
			else showToast('That product could not be found.');
		}
	} catch (error) { showError(grid, error.message); document.querySelector('[data-retry-products]')?.addEventListener('click', () => initProducts()); }
}
