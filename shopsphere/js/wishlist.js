import { getStored, setStored, STORAGE_KEYS } from './storage.js';

export function getWishlist() { return getStored(STORAGE_KEYS.wishlist); }

export function isWishlisted(id) { return getWishlist().some((product) => product.id === id); }

export function toggleWishlist(product) {
	const wishlist = getWishlist();
	const index = wishlist.findIndex((item) => item.id === product.id);
	if (index >= 0) wishlist.splice(index, 1);
	else wishlist.push(product);
	setStored(STORAGE_KEYS.wishlist, wishlist);
	return index < 0;
}

export function removeFromWishlist(id) { setStored(STORAGE_KEYS.wishlist, getWishlist().filter((product) => product.id !== id)); }

export function initWishlist() {}
