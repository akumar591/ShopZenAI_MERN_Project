import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://shopzenai-mern-project.onrender.com/api/product/listproduct"
      );

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Fetch products failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/product/remove",
        { id },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== id)
        );
      }
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-300">
        Loading products…
      </div>
    );
  }

  return (
    <div className="text-gray-100 relative">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Products
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage all store products • Total {products.length}
        </p>
      </div>

      {/* EMPTY */}
      {products.length === 0 && (
        <p className="text-gray-400">
          No products available.
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              overflow-hidden
              hover:border-indigo-500/40
              transition
            "
          >
            {/* IMAGE */}
            <div className="relative h-44">
              <img
                src={p.image?.[0]}
                alt={p.name}
                className="w-full h-full object-cover"
              />

              {p.bestseller && (
                <span className="absolute top-2 left-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-2">
              <h2 className="font-semibold text-lg leading-tight">
                {p.name}
              </h2>

              <p className="text-sm text-gray-400">
                ₹{p.price} • {p.category} / {p.subCategory}
              </p>

              <p className="text-xs text-gray-500">
                Sizes: {p.sizes?.join(", ")}
              </p>

              {/* ACTION */}
              <button
                onClick={() => deleteProduct(p._id)}
                className="
                  mt-4
                  w-full
                  flex items-center justify-center gap-2
                  text-sm
                  border border-red-500/40
                  text-red-400
                  py-2
                  rounded-lg
                  hover:bg-red-500/10
                  transition
                "
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE DASHBOARD FAB ================= */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="
          fixed md:hidden
          bottom-5 right-5
          z-50
          bg-indigo-600 hover:bg-indigo-700
          text-white
          px-4 py-3
          rounded-full
          shadow-2xl
          text-sm font-semibold
        "
      >
        Dashboard
      </button>

    </div>
  );
};

export default ProductList;
