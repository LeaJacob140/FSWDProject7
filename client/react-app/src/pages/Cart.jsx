import { useCart } from "../services/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import './Cart.css';

function Cart({ user }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
    .toFixed(2);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, user } });
  };

  return (
    <>
      
      <div className="cart-container">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty 🛒</p>
          </div>
        ) : (
          <div className="cart-content">
            {cart.map(item => (
             <div key={item.productId} className="product-card">
                <img src={item.image} alt={item.productName} className="product-img" />
                
                <div className="product-info">
                  <h3>{item.productName}</h3>
                  <p className="product-details">
                    Qty: {item.quantity} | Price: ${item.price} | 
                    Total: ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </p>
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
                  ✖
                </button>
              </div>


            ))}

            <div className="cart-summary">
              <h2>Total: ${total}</h2>
              <div className="cart-actions">
                <button className="clear-btn" onClick={clearCart}>🗑 Clear Cart</button>
                <button className="checkout-btn" onClick={handleCheckout}>💳 Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
