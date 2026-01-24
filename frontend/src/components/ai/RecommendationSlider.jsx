import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecommendationSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH REAL PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/product/listproduct"
        );

        if (res.data.success) {
          // 👉 sirf 8–10 products dikhana (recommended style)
          setProducts(res.data.products.slice(0, 10));
        }
      } catch (err) {
        console.error("Recommendation fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return null; // slider ke liye loader zaroori nahi
  }

  if (products.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🤖 Recommended for You
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/products/${product._id}`)}
              className="min-w-[250px] bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={product.image?.[0]}
                alt={product.name}
                loading="lazy"
                className="h-48 w-full object-cover rounded-t-xl"
              />

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-indigo-600 font-bold mt-1">
                  ₹{product.price}
                </p>

                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {product.subCategory}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSlider;
