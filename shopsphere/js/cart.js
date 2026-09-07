export function initCart() {}
import { getStored, setStored, STORAGE_KEYS } from './storage.js';

export function getCart() { return getStored(STORAGE_KEYS.cart); }

export function addToCart(product, quantity = 1) {
	const cart = getCart();
	const existing = cart.find((item) => item.id === product.id);
	if (existing) existing.quantity += quantity;
	else cart.push({ ...product, quantity });
	setStored(STORAGE_KEYS.cart, cart);
}

export function initCart() {}
