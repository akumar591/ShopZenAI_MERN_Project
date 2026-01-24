import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, ShoppingCart, Package, Mail } from "lucide-react";
import { useCart } from "../context/CartContext";

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

const Profile = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROFILE + ORDERS ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        // 👤 PROFILE
        const profileRes = await axios.get(
          "http://localhost:4000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileRes.data.success) {
          setProfile(profileRes.data.user);
        }

        // 📦 ORDERS
        const orderRes = await axios.post(
          "http://localhost:4000/api/order/userorders",
          { userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (orderRes.data.success) {
          setOrders(orderRes.data.orders);
        }
      } catch (error) {
        console.error("Profile dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  /* ================= COUNTS ================= */
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const deliveredCount = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const cancelledCount = orders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  const activeOrders = orders.length - deliveredCount - cancelledCount;

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center text-lg">
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.name}
            </h1>

            <p className="flex items-center gap-2 text-gray-600 mt-2">
              <Mail size={16} /> {profile.email}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Welcome back to <b>ShopZen AI</b> 👋
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* CART */}
          <div className="bg-white rounded-xl shadow p-6 flex gap-4 items-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <ShoppingCart />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                Cart
              </h3>
              <p className="text-gray-600 text-sm">
                {cartCount > 0
                  ? `${cartCount} items in cart`
                  : "Your cart is empty"}
              </p>
            </div>

            <Link
              to="/cart"
              className="text-indigo-600 font-semibold"
            >
              View →
            </Link>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-xl shadow p-6 flex gap-4 items-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Package />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                Orders
              </h3>
              <p className="text-gray-600 text-sm">
                {orders.length} total orders
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Delivered: {deliveredCount} · Active: {activeOrders} · Cancelled: {cancelledCount}
              </p>
            </div>

            <Link
              to="/orders"
              className="text-emerald-600 font-semibold"
            >
              View →
            </Link>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <p className="text-gray-600">
            Manage your shopping and track orders easily.
          </p>

          <div className="flex gap-4">
            <Link
              to="/products"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>

            <Link
              to="/orders"
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              View Orders
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
