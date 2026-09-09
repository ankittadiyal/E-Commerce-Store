export function filterProducts(products, filters) {
	const search = filters.search.trim().toLowerCase();
	return products.filter((product) => {
		const matchesSearch = !search || `${product.title} ${product.category}`.toLowerCase().includes(search);
		const matchesCategory = filters.category === 'all' || product.category === filters.category;
		const matchesPrice = product.price <= filters.price;
		const matchesRating = Number(product.rating?.rate || 0) >= filters.rating;
		return matchesSearch && matchesCategory && matchesPrice && matchesRating;
	}).sort((first, second) => {
		if (filters.sort === 'price-low') return first.price - second.price;
		if (filters.sort === 'price-high') return second.price - first.price;
		if (filters.sort === 'rating') return Number(second.rating.rate) - Number(first.rating.rate);
		if (filters.sort === 'name') return first.title.localeCompare(second.title);
		return first.id - second.id;
	});
}

export function initFilters({ onChange, initial = {} }) {
	const elements = {
		search: document.querySelector('[data-filter-search]'),
		category: document.querySelector('[data-filter-category]'),
		price: document.querySelector('[data-filter-price]'),
		rating: document.querySelector('[data-filter-rating]'),
		sort: document.querySelector('[data-filter-sort]')
	};
	const filters = { search: initial.search || '', category: initial.category || 'all', price: initial.price || 1000, rating: initial.rating || 0, sort: initial.sort || 'featured' };
	if (elements.search) elements.search.value = filters.search;
	if (elements.category) elements.category.value = filters.category;
	if (elements.price) elements.price.value = filters.price;
	if (elements.rating) elements.rating.value = filters.rating;
	if (elements.sort) elements.sort.value = filters.sort;

	Object.entries(elements).forEach(([key, element]) => element?.addEventListener('input', () => {
		filters[key] = element.value;
		onChange(filters);
	}));
	return { elements, filters };
}
