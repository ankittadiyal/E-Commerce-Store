export function formatCurrency(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value); }

export function titleCase(value) { return value.replace(/\b\w/g, (letter) => letter.toUpperCase()); }

export function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

export function getRating(product) { return Number(product?.rating?.rate || 0); }

export function stars(rating) { return `${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}`; }
