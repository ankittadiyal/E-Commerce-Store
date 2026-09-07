export const API_BASE_URL = 'https://fakestoreapi.com';

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  try {
    if (!response.ok) throw new Error('Unable to load products right now.');
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Unable to load products right now.');
  }
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
  try {
    if (!response.ok) throw new Error('Product not found.');
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Product not found.');
  }
}
