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
  const { cartItems, clearCart } = useCart(); // ✅ FIX

  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentMethod] = useState("COD");

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

  /* ================= AUTH + CART CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  /* ================= FETCH PRODUCT DETAILS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids = [...new Set(cartItems.map((i) => i.productId))];
        if (!ids.length) return;

        const res = await axios.post(
          "http://localhost:4000/api/product/cart-products",
          { ids }
        );

        if (res.data.success) {
          const map = {};
          res.data.products.forEach((p) => {
            map[p._id] = p;
          });
          setProductMap(map);
        }
      } catch (err) {
        console.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [cartItems]);

  /* ================= SUBTOTAL ================= */
  const subtotal = cartItems.reduce((sum, item) => {
    const price = productMap[item.productId]?.price || 0;
    return sum + price * item.qty;
  }, 0);

  /* ================= ADDRESS VALIDATION ================= */
  const isAddressValid = () => {
    const requiredFields = [
      "name",
      "phone",
      "house",
      "area",
      "city",
      "state",
      "pincode",
    ];

    for (let field of requiredFields) {
      if (!address[field] || address[field].trim() === "") {
        alert(`Please fill ${field}`);
        return false;
      }
    }

    if (address.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }

    if (address.pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    try {
      if (!isAddressValid()) return;

      setLoading(true);

      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!userId) {
        alert("User not authenticated");
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/api/order/place",
        {
          userId,
          items: cartItems,
          amount: subtotal,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        clearCart();                 // ✅ CART CLEAR
        alert("Order Placed Successfully 🎉");
        navigate("/orders");         // ✅ REDIRECT
      } else {
        alert(res.data.message || "Order failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ================= TOP: PRODUCTS ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>

          {cartItems.map((item) => {
            const product = productMap[item.productId];
            return (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex justify-between items-center border-b py-4"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={product?.image?.[0]}
                    alt={product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div>
                    <p className="font-semibold">{product?.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Qty: {item.qty}
                    </p>
                  </div>
                </div>

                <p className="font-semibold">
                  ₹{(product?.price || 0) * item.qty}
                </p>
              </div>
            );
          })}

          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ADDRESS */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {["name","phone","house","area","city","state","pincode"].map((f) => (
                <input
                  key={f}
                  placeholder={f.toUpperCase()}
                  className="input"
                  onChange={(e) =>
                    setAddress({ ...address, [f]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-xl font-bold">Payment & Summary</h2>

            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </p>

            <div className="payment active">
              <input type="radio" checked readOnly />
              Cash on Delivery
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          border-radius: 0.5rem;
        }
        .payment {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          gap: 0.75rem;
          align-items: center;
          background: #eef2ff;
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
