import { useState, useEffect } from 'react';
import { getCart, removeFromCart, clearCart } from '../services/cartService';

function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} className="product-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{item.name}</h3>
                <p>${item.price} × {item.qty}</p>
              </div>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          ))}
          <h2>Total: ${total}</h2>
          <button onClick={() => { clearCart(); setItems([]); }} style={{ marginTop: '1rem' }}>Clear Cart</button>
        </div>
      )}
    </div>
  );
}

export default Cart;