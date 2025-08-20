import { useEffect, useState } from 'react';
import { addToCart } from '../services/cartService';
import Navbar from '../components/Navbar'; 
import './home.css';

function Home({ user, setUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);     // error state

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (!user) return <div>Loading...</div>;
  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      {user && <Navbar user={user} setUser={setUser}/>}

      <div>Welcome, {user?.username || "Guest"}</div>

      <div className="container">
        <h1>Our Products</h1>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img 
                src={`http://localhost:5001/uploads/${product.image}`} 
                alt={product.name} 
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">
                ${Number(product.price).toFixed(2)} {/* Convert price to number */}
              </p>
              <button 
                className="add-to-cart-btn" 
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
