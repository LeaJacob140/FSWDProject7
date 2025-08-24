import { useCart } from "../services/CartContext.jsx";
import { useNavigate } from "react-router-dom";
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
        {cart.map(item => {
            console.log("Image URL:", item.image); // ✅ move it here

            return (
              <div key={item.id} className="product-card-cart">
                <img
                  src={`http://localhost:5001/uploads/${item.image}`}
                  alt={item.productName}
                  className="product-img"
                />

                <div className="product-info">
                  {item.name} {item.description}
                  <p className="product-details">
                    Qty: {item.quantity} | Price: ${item.price} | 
                    Total: ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </p>
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  ✖
                </button>
              </div>
            );
          })}


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
