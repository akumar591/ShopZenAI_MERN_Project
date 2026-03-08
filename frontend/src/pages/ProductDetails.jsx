import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams(); // MongoDB _id
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
          "http://localhost:5000/api/product/single",
          { productId: id }
        );

        if (res.data.success) {
          setProduct(res.data.product);
          setSize(res.data.product.sizes?.[0] || "M");
        }
      } catch (error) {
        console.error("Product fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 gap-12 bg-white p-6 rounded-xl shadow">

          {/* IMAGE */}
          <div>
            <img
              src={product.image?.[0]}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-lg"
            />
          </div>

          {/* DETAILS */}
          <div>
            <p className="text-sm text-indigo-600 uppercase font-medium">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {product.name}
            </h1>

            <p className="text-2xl text-indigo-600 font-bold mt-4">
              ₹{product.price}
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* SIZE */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <p className="font-medium text-gray-700 mb-2">
                  Select Size:
                </p>
                <div className="flex gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-lg border ${
                        size === s
                          ? "bg-indigo-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Quantity:
              </span>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 border rounded-lg px-3 py-2"
              />
            </div>

            {/* ADD TO CART ✅ FIXED */}
            <button
              onClick={() => addToCart(product._id, size, qty)}
              className="mt-8 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-sm text-gray-500 underline"
            >
              ← Back to products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
