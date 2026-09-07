export const STORAGE_KEYS = { cart: 'shopsphere-cart', wishlist: 'shopsphere-wishlist', orders: 'shopsphere-orders' };

export function getStored(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function setStored(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

export function getCartCount() {
  return getStored(STORAGE_KEYS.cart).reduce((total, item) => total + item.quantity, 0);
}

export function getWishlistCount() {
  return getStored(STORAGE_KEYS.wishlist).length;
}
