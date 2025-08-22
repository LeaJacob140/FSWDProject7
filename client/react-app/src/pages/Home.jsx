import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "./CartContext.jsx";
import AddProduct from "./AddProduct";
import "./home.css";

function Home({ user, setUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMsg, setCartMsg] = useState("");
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    setCartMsg("");
    try {
      await addToCart(product); // quantity defaults to 1
      setCartMsg(`Added "${product.name}" to cart!`);
    } catch (err) {
      setCartMsg("Failed to add to cart: " + err.message);
    }
    setAddingId(null);
  };

  if (!user) return <div>Loading...</div>;
  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div>Welcome, {user?.username || "Guest"}</div>

      {user?.role === "admin" && (
        <div style={{ margin: "20px 0" }}>
          <AddProduct user={user} />
        </div>
      )}

      <div className="container">
        <h1>Our Products</h1>
        {cartMsg && <div className="cart-message">{cartMsg}</div>}
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://localhost:5001/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${Number(product.price).toFixed(2)}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={addingId === product.id}
              >
                {addingId === product.id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
