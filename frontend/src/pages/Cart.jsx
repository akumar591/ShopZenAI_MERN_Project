import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const { cartItems, updateCart, removeFromCart, loading } = useCart();
  const [productMap, setProductMap] = useState({});
  const navigate = useNavigate();

  /* ================= FETCH PRODUCT DETAILS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids = [...new Set(cartItems.map((i) => i.productId))];
        if (ids.length === 0) return;

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
    <div className="pt-16 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">

            {/* ITEMS */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const product = productMap[item.productId];

                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="bg-white p-4 rounded-xl shadow flex gap-4"
                  >
                    {/* IMAGE */}
                    <img
                      src={product?.image?.[0]}
                      alt={product?.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    {/* DETAILS */}
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {product?.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size}
                      </p>
                      <p className="text-indigo-600 font-bold mt-1">
                        ₹{product?.price}
                      </p>

                      {/* QTY */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateCart(
                              item.productId,
                              item.size,
                              item.qty - 1
                            )
                          }
                          disabled={item.qty === 1}
                          className="px-3 py-1 border rounded"
                        >
                          -
                        </button>

                        <span>{item.qty}</span>

                        <button
                          onClick={() =>
                            updateCart(
                              item.productId,
                              item.size,
                              item.qty + 1
                            )
                          }
                          className="px-3 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.size)
                      }
                      className="text-red-500"
                    >
                      <Trash2 />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow h-fit">
              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              <p className="flex justify-between mb-4">
                <span>Total Items</span>
                <span>{cartItems.length}</span>
              </p>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
