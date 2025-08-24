import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../services/CartContext.jsx";
import "./home.css";

function Home({ user, setUser }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMsg, setCartMsg] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useCart();

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter products by search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    setCartMsg("");
    try {
      await addToCart(product);
      setCartMsg(`Added "${product.name}" to cart!`);
    } catch (err) {
      alert(err.message);
      setCartMsg("");
    }
    setAddingId(null);
  };

  if (!user) return <div>Loading...</div>;
  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        {/* <h1>Our Products</h1> */}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        {cartMsg && <div className="cart-message">{cartMsg}</div>}

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://localhost:5001/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  ${Number(product.price).toFixed(2)}
                </p>
                {user.role === 'admin' && (
                  <p className="product-stock">
                   In Stock: {product.stock} {/* או quantity, תלוי איך זה נקרא במידע מהשרת */}
                  </p>
                )}
              </div>
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
