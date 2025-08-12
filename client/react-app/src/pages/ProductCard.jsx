import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img 
        src={`http://localhost:5001/uploads/${product.image}`} 
        alt={product.name} 
        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
      />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button 
        className="login-btn" 
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}