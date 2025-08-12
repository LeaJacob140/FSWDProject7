import { useState, useEffect } from 'react';
import { getCart, clearCart } from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // reuse Amazon styles

function Checkout() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }
    const order = {
      customerName: name,
      shippingAddress: address,
      paymentInfo: payment,
      items,
      total: parseFloat(total),
    };

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/');
      } else {
        alert('Failed to place order.');
      }
    } catch {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <h1 className="login-title">Checkout</h1>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2>Order Summary</h2>
              {items.map(item => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
                  {item.name} × {item.qty} - ${ (item.price * item.qty).toFixed(2) }
                </div>
              ))}
              <h3>Total: ${total}</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Shipping Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Payment Info (card number)"
                value={payment}
                onChange={e => setPayment(e.target.value)}
                required
              />
              <button type="submit" className="login-btn" style={{ marginTop: '12px' }}>
                Place Order
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;