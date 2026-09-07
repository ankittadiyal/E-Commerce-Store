export function initUI() {
  const theme = localStorage.getItem('shopsphere-theme');
  if (theme === 'dark') document.documentElement.dataset.theme = 'dark';

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('shopsphere-theme', isDark ? 'light' : 'dark');
  });

  document.querySelector('[data-menu-toggle]')?.addEventListener('click', (event) => {
    event.currentTarget.closest('.navbar')?.classList.toggle('menu-open');
  });

  document.querySelector('[data-back-to-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => document.querySelector('[data-back-to-top]')?.classList.toggle('visible', window.scrollY > 500));
}
