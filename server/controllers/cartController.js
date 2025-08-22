const cartModel = require('../models/cartModel');

const getCart = async (req, res) => {
  try {
    const items = await cartModel.getCartItems(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    const qty = quantity && quantity > 0 ? quantity : 1; // default to 1

    await cartModel.addToCart(req.user.id, productId, qty);

    const items = await cartModel.getCartItems(req.user.id);
    res.json(items); // return updated cart
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await cartModel.removeFromCart(cartItemId);
    const items = await cartModel.getCartItems(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await cartModel.clearCart(req.user.id);
    const items = await cartModel.getCartItems(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
