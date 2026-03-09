import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= USER ID FROM TOKEN ================= */
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
};

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken();

        if (!token || !userId) {
          navigate("/auth");
          return;
        }

        // 1️⃣ Fetch orders
        const res = await axios.post(
          "https://shopzenai-mern-project.onrender.com/api/order/userorders",
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const ordersData = res.data.orders.reverse();
          setOrders(ordersData);

          // 2️⃣ Collect productIds
          const ids = new Set();
          ordersData.forEach((order) => {
            order.items.forEach((item) => {
              ids.add(item.productId);
            });
          });

          // 3️⃣ Fetch product details
          if (ids.size > 0) {
            const prodRes = await axios.post(
              "https://shopzenai-mern-project.onrender.com/api/product/cart-products",
              { ids: Array.from(ids) }
            );

            if (prodRes.data.success) {
              const map = {};
              prodRes.data.products.forEach((p) => {
                map[p._id] = p;
              });
              setProductMap(map);
            }
          }
        }
      } catch (err) {
        console.error("Orders fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  /* ================= CANCEL ORDER ================= */
  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!window.confirm("Are you sure you want to cancel this order?")) return;

      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/order/cancel",
        { orderId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Order cancelled successfully");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "Cancelled" } : o
          )
        );
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Failed to cancel order");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No orders placed yet.</p>
      </div>
    );
  }

  return (
    <div className="pt-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">
                    Order ID: #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`font-semibold ${
                    order.status === "Cancelled"
                      ? "text-red-500"
                      : "text-indigo-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const product = productMap[item.productId];

                  return (
                    <div
                      key={idx}
                      className="flex gap-4 items-center border-b pb-4"
                    >
                      <img
                        src={product?.image?.[0]}
                        alt={product?.name}
                        className="w-20 h-20 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="font-semibold">
                          {product?.name || "Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} × {item.qty}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₹{(product?.price || 0) * item.qty}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between font-bold mt-4">
                <span>Total</span>
                <span>₹{order.amount}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Payment Method: {order.paymentMethod}
              </p>

              {/* CANCEL BUTTON */}
              {order.payment === false &&
                order.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="mt-4 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition"
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
