import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
  });

  /* ================= TOAST ================= */
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.innerText = msg;

    toast.className =
      "fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-md shadow z-50";

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
    if (cartItems.length === 0) navigate("/cart");
  }, [cartItems, navigate]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const ids = [...new Set(cartItems.map((i) => i.productId))];
      if (!ids.length) return;

      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/product/cart-products",
        { ids }
      );

      if (res.data.success) {
        const map = {};
        res.data.products.forEach((p) => (map[p._id] = p));
        setProductMap(map);
      }
    };

    fetchProducts();
  }, [cartItems]);

  /* ================= SUBTOTAL ================= */
  const subtotal = cartItems.reduce((sum, item) => {
    const price = productMap[item.productId]?.price || 0;
    return sum + price * item.qty;
  }, 0);

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/order/place",
        {
          userId,
          items: cartItems,
          amount: subtotal,
          address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        clearCart();

        showToast("Order placed successfully 🎉");

        setTimeout(() => {
          navigate("/orders");
        }, 800);
      } else {
        showToast("Failed to place order");
      }

    } catch (err) {
      console.error(err);
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* ORDER ITEMS */}
        <div className="bg-white rounded-md">

          {cartItems.map((item, index) => {
            const product = productMap[item.productId];

            return (
              <div key={index} className="p-4 border-b flex gap-4">

                <img
                  src={product?.image?.[0]}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      {product?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Size: {item.size} | Qty: {item.qty}
                    </p>
                  </div>

                  <p className="font-semibold text-sm mt-2">
                    ₹{(product?.price || 0) * item.qty}
                  </p>

                </div>

              </div>
            );
          })}

          <div className="p-4 flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

        </div>

        {/* MAIN SECTION */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ADDRESS */}
          <div className="lg:col-span-2 bg-white p-5 rounded-md">

            <h2 className="text-lg font-semibold mb-4">
              Delivery Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {["name","phone","house","area","city","state","pincode"].map((f) => (
                <input
                  key={f}
                  placeholder={f.toUpperCase()}
                  className="input-clean"

                  type={f === "phone" || f === "pincode" ? "tel" : "text"}
                  inputMode={f === "phone" || f === "pincode" ? "numeric" : "text"}
                  maxLength={f === "phone" ? 10 : f === "pincode" ? 6 : undefined}

                  onChange={(e) => {
                    let value = e.target.value;

                    if (f === "phone" || f === "pincode") {
                      value = value.replace(/[^0-9]/g, "");
                    }

                    setAddress({ ...address, [f]: value });
                  }}
                />
              ))}

            </div>

          </div>

          {/* SUMMARY */}
          <div className="bg-white p-5 rounded-md space-y-4 h-fit sticky top-20">

            <h2 className="text-sm font-semibold">
              PRICE DETAILS
            </h2>

            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="payment">
              <input type="radio" checked readOnly />
              Cash on Delivery
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className={`
                w-full py-2.5 text-sm rounded-md transition
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"}
              `}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

          </div>

        </div>
      </div>

      {/* INPUT STYLE */}
      <style>{`
        .input-clean {
          border: none;
          border-bottom: 1px solid #d1d5db;
          padding: 8px 4px;
          font-size: 14px;
          outline: none;
          background: transparent;
          transition: 0.2s;
        }

        .input-clean:focus {
          border-bottom: 1px solid #6366f1;
        }

        .payment {
          display: flex;
          gap: 8px;
          font-size: 14px;
          align-items: center;
          padding: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default Checkout;