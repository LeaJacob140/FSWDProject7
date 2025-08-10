// Key used to store cart data in localStorage
const CART_KEY = 'cart';

/**
 * Get the cart from localStorage
 * @returns {Array} List of cart items
 */
export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Add a product to the cart
 * @param {Object} product - Product object with id, name, price
 */
export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1; // Increase quantity if product already exists
  } else {
    cart.push({ ...product, qty: 1 }); // Add new product with qty = 1
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Remove a product completely from the cart
 * @param {number} id - Product ID to remove
 */
export function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Clear the entire cart
 */
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}