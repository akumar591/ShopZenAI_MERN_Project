import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/order/list",
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Admin order fetch error", err.response?.data);
    }
  };

  /* ================= FETCH PRODUCTS (FOR NAME + IMAGE) ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://shopzenai-mern-project.onrender.com/api/product/listproduct"
      );

      if (res.data.success) {
        const map = {};
        res.data.products.forEach((p) => {
          map[p._id] = p;
        });
        setProductMap(map);
      }
    } catch (err) {
      console.error("Product fetch failed");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    try {
      await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/order/status",
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Status update failed", err.response?.data);
    }
  };

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()]).finally(() =>
      setLoading(false)
    );
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-300">
        Loading orders…
      </div>
    );
  }

  return (
    <div className="text-gray-100 relative">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage customer orders • Total {orders.length}
        </p>
      </div>

      {/* EMPTY */}
      {orders.length === 0 && (
        <p className="text-gray-400">No orders found.</p>
      )}

      {/* ORDERS */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              p-6
              space-y-4
            "
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="
                  bg-slate-800
                  border border-white/10
                  text-sm
                  px-3 py-1.5
                  rounded-lg
                  outline-none
                "
              >
                <option>Order Placed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            {/* CUSTOMER */}
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-gray-400">Name:</span>{" "}
                {order.address.name}
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{" "}
                {order.address.phone}
              </p>
              <p className="text-gray-400">
                {order.address.house}, {order.address.area},{" "}
                {order.address.city}, {order.address.state} –{" "}
                {order.address.pincode}
              </p>
            </div>

            {/* ITEMS */}
            <div className="border-t border-white/10 pt-3 space-y-3">
              {order.items.map((item, i) => {
                const product = productMap[item.productId];

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm"
                  >
                    <img
                      src={product?.image?.[0]}
                      alt={product?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <p className="font-medium">
                        {product?.name || "Product"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Size: {item.size} × {item.qty}
                      </p>
                    </div>

                    <span className="text-gray-300">
                      ₹{(item.price || 0) * item.qty}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* TOTAL */}
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>₹{order.amount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE DASHBOARD FAB ================= */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="
          fixed md:hidden
          bottom-5 right-5
          z-50
          bg-indigo-600 hover:bg-indigo-700
          text-white
          px-4 py-3
          rounded-full
          shadow-2xl
          text-sm font-semibold
        "
      >
        Dashboard
      </button>

    </div>
  );
};

export default AdminOrders;
