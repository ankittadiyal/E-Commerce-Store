export const API_BASE_URL = 'https://fakestoreapi.com';

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Unable to load products right now.');
  return response.json();
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error('Product not found.');
  return response.json();
}
