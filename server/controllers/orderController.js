const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // לקבל את פרטי העגלה
    const cartItems = await cartModel.getCartItems(userId);
    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // לחשב סה"כ
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ליצור הזמנה
    const orderId = await orderModel.createOrder(userId, totalPrice);

    // להוסיף פרטי הזמנה
    for (const item of cartItems) {
      await orderModel.addOrderItem(orderId, item.product_id, item.quantity, item.price);
    }

    // לנקות את העגלה
    await cartModel.clearCart(userId);

    res.status(201).json({ message: 'Order placed', orderId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
};
