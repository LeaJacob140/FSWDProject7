const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // אם רוצים להשבית לוגים
});

// מייבאים את כל המודלים ומעבירים את החיבור (sequelize)
const User = require('./userModel')(sequelize);
const Product = require('./productModel')(sequelize);
const CartItem = require('./cartModel')(sequelize);
const Order = require('./orderModel')(sequelize);
const Notification = require('./notificationModel')(sequelize);

// הגדרת קשרים בין הטבלאות

// משתמש יכול להיות בעל הרבה הזמנות
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// משתמש יכול להיות בעל סל קניות (רבים לפריטים)
User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// מוצר יכול להופיע בהרבה פריטי סל קניות
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// הזמנה יכולה להכיל הרבה מוצרים - כאן פשוטה - אפשר להרחיב עם טבלת ביניים להזמנות ומוצרים
Order.hasMany(Product, { foreignKey: 'orderId' }); // אפשר גם קשרים מורכבים יותר לפי הצורך

// משתמש יכול לקבל התראות
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Product,
  CartItem,
  Order,
  Notification,
};
