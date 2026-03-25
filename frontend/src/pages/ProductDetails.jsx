import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.post(
          "https://shopzenai-mern-project.onrender.com/api/product/single",
          { productId: id }
        );

        if (res.data.success) {
          setProduct(res.data.product);
          setSize(res.data.product.sizes?.[0] || "M");
        }
      } catch {
        console.error("Product fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 TOAST FUNCTION
  const showToast = () => {
    const toast = document.createElement("div");
    toast.innerText = "Added to cart 🛒";

    toast.className =
      "fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-md shadow z-50";

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 1500);
  };

  // 🔥 HANDLE ADD
  const handleAddToCart = () => {
    addToCart(product._id, size, qty);
    showToast();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-20">

      <div className="max-w-7xl mx-auto md:px-6 md:py-10">
        <div className="grid md:grid-cols-2 gap-8 bg-white md:p-6 md:rounded-xl md:shadow">

          {/* IMAGE */}
          <div>
            <img
              src={product.image?.[0]}
              alt={product.name}
              className="w-full h-[320px] md:h-[420px] object-cover md:rounded-lg"
            />
          </div>

          {/* DETAILS */}
          <div className="p-4 md:p-0">

            <p className="text-xs text-indigo-600 uppercase font-medium">
              {product.category}
            </p>

            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
              {product.name}
            </h1>

            <p className="text-2xl text-indigo-600 font-bold mt-2">
              ₹{product.price}
            </p>

            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* SIZE */}
            {product.sizes?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Select Size
                </p>

                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-1.5 text-sm border ${
                        size === s
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white hover:border-indigo-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Quantity
              </span>

              <div className="flex items-center border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1"
                >
                  -
                </button>

                <span className="px-3">{qty}</span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* DESKTOP BUTTON */}
            <button
              onClick={handleAddToCart}
              className="
                hidden md:flex
                mt-8
                items-center gap-2
                bg-indigo-600
                text-white
                px-6 py-3
                hover:bg-indigo-700
                transition
              "
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-xs text-gray-500 underline"
            >
              ← Back to products
            </button>

          </div>
        </div>
      </div>

      {/* 🔥 MOBILE FIXED BUTTON */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t px-4 py-2 z-50">

        <button
          onClick={handleAddToCart}
          className="
            w-full
            flex items-center justify-center gap-2
            bg-indigo-600
            text-white
            py-2.5
            text-sm font-medium
            hover:bg-indigo-700
            transition
          "
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

      </div>

    </div>
  );
};

export default ProductDetails;