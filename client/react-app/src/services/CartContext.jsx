import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ user, children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) fetchCart();
    else setCart([]);
  }, [user]);

  const fetchCart = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user?.token) throw new Error("User not logged in");
    try {
      const res = await fetch("http://localhost:5001/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const data = await res.json();
      console.log('Add to cart response:', data);

      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      setCart(data); // update context
      return data;
    } catch (err) {
      console.error("Add to cart error:", err);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user?.token) throw new Error("User not logged in");
    try {
      const res = await fetch(`http://localhost:5001/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Remove from cart error:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    if (!user?.token) throw new Error("User not logged in");
    try {
      const res = await fetch("http://localhost:5001/api/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Clear cart error:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
