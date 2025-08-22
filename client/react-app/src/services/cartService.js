export async function getCart(user) {
  const res = await fetch('http://localhost:5001/api/cart', {
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return await res.json();
}

export async function addToCart(user, product, quantity = 1) {
  const res = await fetch('http://localhost:5001/api/cart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId: product.id, quantity })
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return await res.json(); // returns updated cart
}

export async function removeFromCart(user, cartItemId) {
  const res = await fetch(`http://localhost:5001/api/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
  return await res.json(); // returns updated cart
}

export async function clearCart(user) {
  const res = await fetch('http://localhost:5001/api/cart', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return await res.json(); // returns updated cart
}