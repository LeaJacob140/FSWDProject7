import { useState } from "react";
import "./AddProduct.css";
import categories from '../assets/categories';
import Navbar from "../components/Navbar.jsx";


function AddProduct({ user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !stock || !categoryId || !image) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category_id", Number(categoryId));
    formData.append("image", image);

    try {
      console.log("Current user:", user);

      const res = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Response data:", data);
      console.log("Response status:", res.status);

      if (res.ok) {
        setMessage("✅ Product added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setCategoryId("");
        setImage(null);
        setImagePreview(null);
      } else {
        setMessage(data.message || "❌ Error adding product");
      }
    } catch (err) {
      setMessage("🚨 Server error: " + err.message);
    }
  };

  return (
    <>
      <Navbar user={user} />
    <div className="form-container">
      <h2>Add New Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={name}
            placeholder="Enter product name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            placeholder="Enter product description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price ($):</label>
          <input
            type="number"
            value={price}
            placeholder="0.00"
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            placeholder="Available stock"
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="form-group">
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
  <option value="">Select category</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
          )}
        </div>

        <button type="submit" className="submit-btn">
          ➕ Add Product
        </button>
      </form>
    </div>
        </>

  );
}

export default AddProduct;
