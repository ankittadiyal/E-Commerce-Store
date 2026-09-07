import { getCartCount, getWishlistCount } from './storage.js';

export function showToast(message) {
  const region = document.querySelector('.toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

export function updateCounters() {
  document.querySelectorAll('[data-cart-count]').forEach((element) => { element.textContent = getCartCount(); });
  document.querySelectorAll('[data-wishlist-count]').forEach((element) => { element.textContent = getWishlistCount(); });
}

export function initUI() {
  const theme = localStorage.getItem('shopsphere-theme');
  if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
  updateCounters();

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', (event) => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('shopsphere-theme', isDark ? 'light' : 'dark');
    event.currentTarget.setAttribute('aria-label', isDark ? 'Switch to dark mode' : 'Switch to light mode');
  });

  document.querySelector('[data-menu-toggle]')?.addEventListener('click', (event) => {
    event.currentTarget.closest('.navbar')?.classList.toggle('menu-open');
  });

  document.querySelector('[data-back-to-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => document.querySelector('[data-back-to-top]')?.classList.toggle('visible', window.scrollY > 500));

  document.querySelector('.newsletter-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast('You are on the list. Welcome to the edit.');
  });
}
