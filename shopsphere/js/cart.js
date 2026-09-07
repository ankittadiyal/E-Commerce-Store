import { getStored, setStored, STORAGE_KEYS } from './storage.js';
import { escapeHtml, formatCurrency, titleCase } from './utils.js';
import { showToast, updateCounters } from './ui.js';

export function getCart() { return getStored(STORAGE_KEYS.cart); }

export function addToCart(product, quantity = 1) {
	const cart = getCart();
	const existing = cart.find((item) => item.id === product.id);
	if (existing) existing.quantity += quantity;
	else cart.push({ ...product, quantity });
	setStored(STORAGE_KEYS.cart, cart);
}

export function updateQuantity(id, quantity) {
	const cart = getCart();
	const item = cart.find((product) => product.id === id);
	if (item) item.quantity = Math.max(1, quantity);
	setStored(STORAGE_KEYS.cart, cart);
}

export function removeFromCart(id) { setStored(STORAGE_KEYS.cart, getCart().filter((product) => product.id !== id)); }

export function clearCart() { setStored(STORAGE_KEYS.cart, []); }

export function calculateTotals(coupon = '') {
	const subtotal = getCart().reduce((total, product) => total + product.price * product.quantity, 0);
	const discountRate = coupon === 'SAVE20' ? .2 : coupon === 'SAVE10' ? .1 : 0;
	const discount = subtotal * discountRate;
	const shipping = subtotal === 0 || subtotal - discount >= 75 ? 0 : 8.95;
	return { subtotal, discount, shipping, total: subtotal - discount + shipping, discountRate };
}

function renderSummary(totals, coupon) {
	return `<aside class="summary-card"><h2>Order summary</h2><form class="coupon-form" data-coupon-form><label class="sr-only" for="coupon-code">Coupon code</label><input id="coupon-code" name="coupon" value="${coupon}" placeholder="Coupon code" autocomplete="off"><button type="submit">Apply</button></form>${totals.discountRate ? `<p class="coupon-note">${totals.discountRate * 100}% discount applied.</p>` : ''}<div class="summary-row"><span>Subtotal</span><span>${formatCurrency(totals.subtotal)}</span></div><div class="summary-row"><span>Discount</span><span>-${formatCurrency(totals.discount)}</span></div><div class="summary-row"><span>Shipping</span><span>${totals.shipping ? formatCurrency(totals.shipping) : 'Free'}</span></div><div class="summary-row total"><span>Total</span><span>${formatCurrency(totals.total)}</span></div><a class="button button-dark" href="checkout.html">Continue to checkout <span>&#8594;</span></a></aside>`;
}

function renderCart() {
	const container = document.querySelector('[data-cart-view]');
	if (!container) return;
	const cart = getCart();
	const coupon = sessionStorage.getItem('shopsphere-coupon') || '';
	if (!cart.length) { container.innerHTML = '<div class="empty-cart"><div class="empty-icon">&#10022;</div><h2>Your bag is waiting.</h2><p>There is plenty of room for something considered.</p><a class="button button-dark" href="products.html">Explore the collection <span>&#8594;</span></a></div>'; return; }
	container.innerHTML = `<div class="cart-layout"><section class="cart-items" aria-label="Items in your bag">${cart.map((item) => `<article class="cart-item"><div class="cart-item-image"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"></div><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(titleCase(item.category))}</p><div class="quantity-control"><button type="button" data-cart-decrease="${item.id}" aria-label="Decrease quantity">-</button><span>${item.quantity}</span><button type="button" data-cart-increase="${item.id}" aria-label="Increase quantity">+</button></div><button class="remove-button" type="button" data-cart-remove="${item.id}">Remove</button></div><span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span></article>`).join('')}</section>${renderSummary(calculateTotals(coupon), coupon)}</div>`;
}

export function initCart() {
	const container = document.querySelector('[data-cart-view]');
	if (!container) return;
	renderCart();
	container.addEventListener('click', (event) => {
		const decrease = event.target.closest('[data-cart-decrease]');
		const increase = event.target.closest('[data-cart-increase]');
		const remove = event.target.closest('[data-cart-remove]');
		if (decrease || increase) { const id = Number((decrease || increase).dataset.cartDecrease || (decrease || increase).dataset.cartIncrease); const item = getCart().find((product) => product.id === id); updateQuantity(id, item.quantity + (increase ? 1 : -1)); renderCart(); updateCounters(); }
		if (remove) { removeFromCart(Number(remove.dataset.cartRemove)); renderCart(); updateCounters(); showToast('Removed from your bag.'); }
	});
	container.addEventListener('submit', (event) => {
		if (!event.target.matches('[data-coupon-form]')) return;
		event.preventDefault();
		const coupon = new FormData(event.target).get('coupon').toString().trim().toUpperCase();
		if (!['SAVE10', 'SAVE20', ''].includes(coupon)) { showToast('That coupon is not valid. Try SAVE10 or SAVE20.'); return; }
		sessionStorage.setItem('shopsphere-coupon', coupon);
		showToast(coupon ? `${coupon} applied to your order.` : 'Coupon removed.');
		renderCart();
	});
}
