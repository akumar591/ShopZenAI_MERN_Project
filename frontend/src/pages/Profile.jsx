import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Package, Mail } from "lucide-react";
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
        const profileRes = await axios.get(
          "https://shopzenai-mern-project.onrender.com/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileRes.data.success) {
          setProfile(profileRes.data.user);
        }

        const orderRes = await axios.post(
          "https://shopzenai-mern-project.onrender.com/api/order/userorders",
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
      <div className="pt-6 min-h-screen flex items-center justify-center">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="sm:pt-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-6 md:space-y-8">

        {/* ================= PROFILE CARD ================= */}

        <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6 md:p-8
        flex
        flex-col md:flex-row
        items-center md:items-center
        gap-4 md:gap-6
        text-center md:text-left
        ">

          <div className="
          w-20 h-20 md:w-24 md:h-24
          rounded-full
          bg-indigo-600
          text-white
          flex items-center justify-center
          text-3xl md:text-4xl
          font-bold
          ">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {profile.name}
            </h1>

            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mt-2 text-sm md:text-base">
              <Mail size={16} /> {profile.email}
            </p>

            <p className="mt-1 text-xs md:text-sm text-gray-500">
              Welcome back to <b>ShopZen AI</b> 👋
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* CART */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex gap-4 items-center">

            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <ShoppingCart />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                Cart
              </h3>

              <p className="text-gray-600 text-xs md:text-sm">
                {cartCount > 0
                  ? `${cartCount} items in cart`
                  : "Your cart is empty"}
              </p>
            </div>

            <Link
              to="/cart"
              className="text-indigo-600 text-sm font-semibold"
            >
              View →
            </Link>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex gap-4 items-center">

            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Package />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                Orders
              </h3>

              <p className="text-gray-600 text-xs md:text-sm">
                {orders.length} total orders
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Delivered: {deliveredCount} · Active: {activeOrders} · Cancelled: {cancelledCount}
              </p>
            </div>

            <Link
              to="/orders"
              className="text-emerald-600 text-sm font-semibold"
            >
              View →
            </Link>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="
        bg-white
        rounded-xl
        shadow
        p-5 md:p-6
        flex
        flex-col md:flex-row
        gap-4
        justify-between
        items-start md:items-center
        ">

          <p className="text-gray-600 text-sm md:text-base">
            Manage your shopping and track orders easily.
          </p>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">

            <Link
              to="/products"
              className="
              w-full md:w-auto
              text-center
              px-5 py-2
              rounded-lg
              bg-indigo-600
              text-white
              hover:bg-indigo-700
              transition
              text-sm
              "
            >
              Browse Products
            </Link>

            <Link
              to="/orders"
              className="
              w-full md:w-auto
              text-center
              px-5 py-2
              rounded-lg
              border border-gray-300
              hover:bg-gray-100
              transition
              text-sm
              "
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