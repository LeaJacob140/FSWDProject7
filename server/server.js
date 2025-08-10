// server/server.js
const app = require('./app');
const db = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected');
    // בסביבת פיתוח - נסנכרן מבנה הטבלאות. להיזהר בפרודקשן.
    await db.sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
