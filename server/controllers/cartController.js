const cartModel = require('../models/cartModel');

const getCart = async (req, res) => {
  try {
    const items = await cartModel.getCartItems(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) return res.status(400).json({ message: 'Invalid input' });

    await cartModel.addToCart(req.user.id, productId, quantity);
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await cartModel.removeFromCart(cartItemId);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await cartModel.clearCart(req.user.id);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
