import { useCart } from "../services/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

import './Checkout.css';

function Checkout({ user }) {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.username || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const total = cart
    .reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
    .toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !cardNumber || !expiry || !cvv || !address) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    // Here you would normally send data to backend payment API
    setMessage(`✅ Order placed successfully! Total: $${total}`);
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <>   
       <Navbar user={user} />
    <div className="checkout-container">
      <h1>Checkout</h1>
      {message && <p className="message">{message}</p>}

      <div className="cart-summary">
        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item.productId} className="checkout-item">
            <span>{item.productName} × {item.quantity}</span>
            <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
          </div>
        ))}
        <h3>Total: ${total}</h3>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Billing & Shipping Info</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Card Number:
          <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required placeholder="1234 5678 9012 3456" />
        </label>
        <label>
          Expiry Date:
          <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} required placeholder="MM/YY" />
        </label>
        <label>
          CVV:
          <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} required placeholder="123" />
        </label>
        <label>
          Shipping Address:
          <textarea value={address} onChange={e => setAddress(e.target.value)} required />
        </label>
        <button type="submit" className="place-order-btn">Place Order</button>
      </form>
    </div>
    </>
  );
}

export default Checkout;
