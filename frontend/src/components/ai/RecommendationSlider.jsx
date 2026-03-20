import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecommendationSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://shopzenai-mern-project.onrender.com/api/product/listproduct"
        );

        if (res.data.success) {
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

  if (loading || products.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-3 lg:px-6">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4">
          🤖 Recommended for You
        </h2>

        {/* 🔥 MOBILE + DESKTOP RESPONSIVE SCROLLER */}
        <div className="flex gap-3 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">

          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/products/${product._id}`)}

              className="
              snap-start
              min-w-[48%]      /* 🔥 mobile → 2 cards */
              sm:min-w-[200px]
              lg:min-w-[250px]
              bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer
              "
            >
              <img
                src={product.image?.[0]}
                alt={product.name}
                loading="lazy"
                className="h-36 lg:h-48 w-full object-cover rounded-t-xl"
              />

              <div className="p-2 lg:p-4">
                <h3 className="text-sm lg:text-base font-semibold text-gray-800 line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-indigo-600 font-bold text-sm lg:text-base mt-1">
                  ₹{product.price}
                </p>

                <p className="text-[10px] lg:text-xs text-gray-500 mt-1 capitalize">
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