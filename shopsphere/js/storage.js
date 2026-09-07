export const STORAGE_KEYS = { cart: 'shopsphere-cart', wishlist: 'shopsphere-wishlist', orders: 'shopsphere-orders' };

export function getStored(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function setStored(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
