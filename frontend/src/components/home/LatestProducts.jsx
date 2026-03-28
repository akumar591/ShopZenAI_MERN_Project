import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../product/ProductCard";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get(
          "https://shopzenai-mern-project.onrender.com/api/product/listproduct",
        );

        if (res.data.success) {
          // ✅ LATEST FIRST (DESCENDING)
          const sorted = res.data.products.sort((a, b) => b.date - a.date);

          const latest = sorted.slice(0, 10);
          setProducts(latest);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* ✅ IMPROVED HEADING */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl inline-block relative">
          Latest Products
          <span className="block h-[3px] bg-indigo-600 mt-2 rounded-full w-full"></span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
