import { calculateTotals, clearCart, getCart } from './cart.js';
import { getStored, setStored, STORAGE_KEYS } from './storage.js';
import { escapeHtml, formatCurrency, titleCase } from './utils.js';
import { updateCounters } from './ui.js';

function renderCheckout() {
	const container = document.querySelector('[data-checkout-view]');
	const cart = getCart();
	if (!cart.length) { container.innerHTML = '<div class="empty-cart"><div class="empty-icon">&#10022;</div><h2>Your bag is empty.</h2><p>Add something considered before checking out.</p><a class="button button-dark" href="products.html">Continue shopping <span>&#8594;</span></a></div>'; return; }
	const coupon = sessionStorage.getItem('shopsphere-coupon') || '';
	const totals = calculateTotals(coupon);
	container.innerHTML = `<div class="checkout-layout"><form class="checkout-form" data-checkout-form><section class="form-section"><h2>Delivery details</h2><div class="form-row"><div class="field"><label for="full-name">Full name</label><input id="full-name" name="fullName" type="text" autocomplete="name" required></div><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required></div></div><div class="form-row"><div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" inputmode="tel" pattern="[0-9+() \-]{7,}" autocomplete="tel" required></div><div class="field"><label for="address">Street address</label><input id="address" name="address" type="text" autocomplete="street-address" required></div></div><div class="form-row"><div class="field"><label for="city">City</label><input id="city" name="city" type="text" autocomplete="address-level2" required></div><div class="field"><label for="state">State</label><input id="state" name="state" type="text" autocomplete="address-level1" required></div></div><div class="field"><label for="pincode">Pincode</label><input id="pincode" name="pincode" type="text" inputmode="numeric" pattern="[0-9]{4,10}" autocomplete="postal-code" required></div></section><section class="form-section"><h2>Payment method</h2><div class="payment-options"><div class="payment-option"><input id="cod" name="payment" value="Cash on Delivery" type="radio" required><label for="cod">Cash on Delivery</label></div><div class="payment-option"><input id="upi" name="payment" value="UPI" type="radio"><label for="upi">UPI</label></div><div class="payment-option"><input id="card" name="payment" value="Card" type="radio"><label for="card">Card</label></div></div><p class="form-hint">This demo does not process real payments.</p></section><button class="button button-dark" type="submit">Place order <span>&#8594;</span></button></form><aside class="summary-card"><h2>In your bag</h2>${cart.map((item) => `<div class="summary-row"><span>${escapeHtml(item.title)} <small>&times; ${item.quantity}</small></span><span>${formatCurrency(item.price * item.quantity)}</span></div>`).join('')}<div class="summary-row total"><span>Total</span><span>${formatCurrency(totals.total)}</span></div></aside></div>`;
}

function createOrder(form) {
	const data = Object.fromEntries(new FormData(form));
	const cart = getCart();
	const coupon = sessionStorage.getItem('shopsphere-coupon') || '';
	const totals = calculateTotals(coupon);
	const order = { id: `SS-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'Processing', items: cart, totals, payment: data.payment, address: { fullName: data.fullName, email: data.email, phone: data.phone, address: data.address, city: data.city, state: data.state, pincode: data.pincode } };
	const orders = getStored(STORAGE_KEYS.orders);
	setStored(STORAGE_KEYS.orders, [order, ...orders]);
	clearCart();
	sessionStorage.removeItem('shopsphere-coupon');
	return order;
}

function renderConfirmation(order) {
	const container = document.querySelector('[data-checkout-view]');
	container.innerHTML = `<section class="confirmation"><div class="confirmation-mark">&#10003;</div><p class="eyebrow">Order placed</p><h1>It is on its way.</h1><p>Thanks, ${escapeHtml(order.address.fullName)}. We will send updates to ${escapeHtml(order.address.email)}.</p><div class="order-details"><div class="summary-row"><span>Order ID</span><strong>${order.id}</strong></div><div class="summary-row"><span>Estimated delivery</span><strong>${new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div><div class="summary-row"><span>Payment</span><strong>${escapeHtml(order.payment)}</strong></div><div class="summary-row"><span>Deliver to</span><strong>${escapeHtml(order.address.address)}, ${escapeHtml(order.address.city)}</strong></div><div class="summary-row total"><span>Total paid</span><strong>${formatCurrency(order.totals.total)}</strong></div></div><a class="button button-dark" href="products.html">Keep exploring <span>&#8594;</span></a></section>`;
}

function renderOrderHistory() {
	const section = document.querySelector('[data-order-history]');
	const orders = getStored(STORAGE_KEYS.orders);
	if (!section || !orders.length) return;
	section.hidden = false;
	section.innerHTML = `<p class="eyebrow">Your account, locally</p><h2>Order history.</h2><div class="history-list">${orders.map((order) => `<article class="history-card"><div class="history-header"><div><strong>${order.id}</strong><p>${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></div><div class="history-items">${order.items.map((item) => `<span>${escapeHtml(item.title)} <small>&times;${item.quantity}</small></span>`).join('')}</div><div class="history-footer"><span>${escapeHtml(order.address.city)}, ${escapeHtml(order.address.state)}</span><strong>${formatCurrency(order.totals.total)}</strong></div></article>`).join('')}</div>`;
}

export function initCheckout() {
	renderCheckout();
	renderOrderHistory();
	document.querySelector('[data-checkout-view]')?.addEventListener('submit', (event) => {
		if (!event.target.matches('[data-checkout-form]')) return;
		event.preventDefault();
		if (!event.target.reportValidity()) return;
		const order = createOrder(event.target);
		renderConfirmation(order);
		renderOrderHistory();
		updateCounters();
	});
}
