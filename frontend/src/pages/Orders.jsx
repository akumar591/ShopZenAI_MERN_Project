import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= USER ID ================= */
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

  // 🔥 NEW STATES
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken();

        if (!token || !userId) {
          navigate("/auth");
          return;
        }

        const res = await axios.post(
          "https://shopzenai-mern-project.onrender.com/api/order/userorders",
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          const sorted = res.data.orders.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setOrders(sorted);

          const ids = new Set();
          sorted.forEach((o) =>
            o.items.forEach((i) => ids.add(i.productId))
          );

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  /* ================= CANCEL ================= */
  const confirmCancel = (orderId) => {
    setSelectedOrder(orderId);
    setShowConfirm(true);
  };

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/order/cancel",
        { orderId: selectedOrder, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === selectedOrder ? { ...o, status: "Cancelled" } : o
          )
        );

        // 🔥 toast
        const toast = document.createElement("div");
        toast.innerText = "Order cancelled successfully";

        toast.className =
          "fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-md shadow z-50";

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1500);
      }

      setShowConfirm(false);
      setSelectedOrder(null);

    } catch {
      alert("Cancel failed");
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

  return (
    <div className="bg-gray-100 min-h-screen pt-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        <h1 className="text-2xl font-semibold">
          My Orders ({orders.length})
        </h1>

        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-md">

            {/* HEADER */}
            <div className="p-4 border-b">
              <p className="text-sm font-medium">
                Order #{order._id.slice(-6)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>

            {/* ITEMS */}
            {order.items.map((item, idx) => {
              const product = productMap[item.productId];

              return (
                <div key={idx} className="p-4 border-b flex gap-4">
                  <img
                    src={product?.image?.[0]}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {item.size} | Qty: {item.qty}
                    </p>
                    <p className="font-semibold text-sm mt-2">
                      ₹{(product?.price || 0) * item.qty}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* FOOTER */}
            <div className="p-4 space-y-3">

              <div className="flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>₹{order.amount}</span>
              </div>

              <div className="flex items-center justify-between">

                <p className="text-sm">
                  <span className="text-gray-500">Status: </span>
                  <span
                    className={`font-medium ${
                      order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-indigo-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>

                {order.payment === false &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => confirmCancel(order._id)}
                      className="text-red-500 text-xs"
                    >
                      Cancel Order
                    </button>
                  )}

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-md w-80 space-y-4">

            <p className="text-sm font-medium text-center">
              Are you sure you want to cancel your order?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border py-2 text-sm rounded-md"
              >
                No
              </button>

              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-500 text-white py-2 text-sm rounded-md"
              >
                Yes, Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Orders;