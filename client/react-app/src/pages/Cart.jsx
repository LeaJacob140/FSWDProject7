// import { useCart } from "../services/CartContext.jsx";
// import { useNavigate } from 'react-router-dom';
// import './Cart.css';

// function Cart() {
//   const { cart, removeFromCart, clearCart } = useCart();
//   const navigate = useNavigate();
  

//   const total = cart
//     .reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
//     .toFixed(2);

//   return (
//     <div className="container">
//       <h1>Your Cart</h1>
//       {cart.length === 0 ? (
//         <p>Cart is empty.</p>
//       ) : (
//         <div>
//           {cart.map(item => (
//          <div key={item.productId} className="product-card">
//             <div className="product-info">
//               <h3>{item.productName}</h3>
//               <p>
//                 Price: ${(Number(item.price) * Number(item.quantity)).toFixed(2)} <br />
//                 Quantity: {item.quantity}
//               </p>
//             </div>
//             <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
//               Remove
//             </button>
//           </div>

//           ))}
//           <h2>Total: ${total}</h2>
//           <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
//           <button className="checkout-btn" onClick={() => navigate('/checkout')}>Checkout</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;

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
    // Navigate to checkout and send cart and user info
    navigate('/checkout', { state: { cart, user } });
  };

  return (
    <>
      <Navbar user={user} setUser={() => {}} />
    <div className="container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.productId} className="product-card">
              <div className="product-info">
                <h3>{item.productName}</h3>
                <p>
                  Price: ${(Number(item.price) * Number(item.quantity)).toFixed(2)} <br />
                  Quantity: {item.quantity}
                </p>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
                Remove
              </button>
            </div>
          ))}
          <h2>Total: ${total}</h2>
          <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
        </>

  );
}

export default Cart;
