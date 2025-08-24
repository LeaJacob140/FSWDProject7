import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Orders.css";

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch("http://localhost:5001/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        /// Fetch items for each order
        const ordersWithItems = await Promise.all(
            data.map(async (order) => {
                const resItems = await fetch(
                `http://localhost:5001/api/orders/${order.id}/items`,
                { headers: { Authorization: `Bearer ${user.token}` } }
                );
                const items = await resItems.json();
                return { ...order, items, total_price: Number(order.total_price) };
            })
            );


        setOrders(ordersWithItems);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <div>Loading...</div>;
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <>
      <Navbar user={user} />
      <div className="orders-container">
        <h1>My Orders</h1>
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h2>Order #{order.id} - ${order.total_price.toFixed(2)}</h2>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.created_at).toLocaleString()}</p>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={`http://localhost:5001/uploads/${item.product_image}`}
                    alt={item.product_name}
                    className="order-item-image"
                  />
                  <div>
                    <p>{item.product_name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Orders;
