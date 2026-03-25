import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const { cartItems, updateCart, removeFromCart, loading } = useCart();
  const [productMap, setProductMap] = useState({});
  const navigate = useNavigate();

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids = [...new Set(cartItems.map((i) => i.productId))];
        if (!ids.length) return;

        const res = await axios.post(
          "https://shopzenai-mern-project.onrender.com/api/product/cart-products",
          { ids }
        );

        if (res.data.success) {
          const map = {};
          res.data.products.forEach((p) => {
            map[p._id] = p;
          });
          setProductMap(map);
        }
      } catch {
        console.error("Failed to load cart products");
      }
    };

    fetchProducts();
  }, [cartItems]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-6">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-6">

        {/* LEFT - ITEMS */}
        <div className="lg:col-span-2 bg-white rounded-md">

          {cartItems.map((item, index) => {
            const product = productMap[item.productId];

            return (
              <div key={index} className="p-4 border-b flex gap-4">

                {/* IMAGE */}
                <img
                  src={product?.image?.[0]}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      {product?.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size}
                    </p>

                    {/* QTY */}
                    <div className="flex items-center gap-2 mt-3">

                      <button
                        onClick={() =>
                          updateCart(item.productId, item.size, item.qty - 1)
                        }
                        disabled={item.qty === 1}
                        className="w-7 h-7 border rounded text-sm"
                      >
                        -
                      </button>

                      <span className="text-sm">{item.qty}</span>

                      <button
                        onClick={() =>
                          updateCart(item.productId, item.size, item.qty + 1)
                        }
                        className="w-7 h-7 border rounded text-sm"
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* 🔥 PRICE + REMOVE SAME LINE */}
                  <div className="flex items-center justify-between mt-3">

                    {/* PRICE */}
                    <p className="font-semibold text-sm">
                      ₹{product?.price}
                    </p>

                    {/* REMOVE */}
                    <button
                      onClick={() => {
                        removeFromCart(item.productId, item.size);

                        // 🔥 TOAST WITH PRODUCT NAME
                        const toast = document.createElement("div");
                        toast.innerText = `${product?.name || "Product"} removed from cart`;

                        toast.className =
                          "fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-md shadow z-50";

                        document.body.appendChild(toast);

                        setTimeout(() => toast.remove(), 1500);
                      }}
                      className="text-xs text-red-500 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white rounded-md p-5 h-fit sticky top-20">

          <h2 className="text-sm font-semibold mb-4">
            PRICE DETAILS
          </h2>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Price</span>
              <span>
                ₹
                {cartItems.reduce((t, i) => {
                  const p = productMap[i.productId];
                  return t + (p?.price || 0) * i.qty;
                }, 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr />

            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>
                ₹
                {cartItems.reduce((t, i) => {
                  const p = productMap[i.productId];
                  return t + (p?.price || 0) * i.qty;
                }, 0)}
              </span>
            </div>

          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-md text-sm"
          >
            Place Order
          </button>

        </div>

      </div>
    </div>
  );
};

export default Cart;