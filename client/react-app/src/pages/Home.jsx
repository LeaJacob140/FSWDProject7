import { useEffect, useState } from 'react';
import { addToCart } from '../services/cartService';


function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;