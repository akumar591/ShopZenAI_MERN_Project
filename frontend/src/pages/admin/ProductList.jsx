import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ NEW STATE (CONFIRM MODAL)
  const [confirmId, setConfirmId] = useState(null);

  const adminToken = localStorage.getItem("adminToken");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://shopzenai-mern-project.onrender.com/api/product/listproduct"
      );

      if (res.data.success) {
        setProducts([...res.data.products].reverse());
      }
    } catch {
      showMessage("Failed to load products ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
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
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showMessage("Product deleted successfully ✅");
      }
    } catch {
      showMessage("Delete failed ❌");
    } finally {
      setConfirmId(null); // close modal
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-300">
        Loading products…
      </div>
    );
  }

  return (
    <div className="text-gray-100 relative">

      {/* 🔔 MESSAGE */}
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-600 px-4 py-2 rounded text-sm">
          {message}
        </div>
      )}

      {/* ✅ CONFIRM MODAL (NEW) */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-[#020617] p-6 rounded-xl w-[90%] max-w-sm border border-white/10 text-center space-y-4">

            <h2 className="text-lg font-semibold">
              Delete Product?
            </h2>

            <p className="text-sm text-gray-400">
              Are you sure you want to delete this product?
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteProduct(confirmId)}
                className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
        <p className="text-sm text-gray-400">
          Total Products: {products.length}
        </p>
      </div>

      {products.length === 0 && (
        <p className="text-gray-400">No products available.</p>
      )}

      <div className="border border-white/10 rounded-xl overflow-hidden">

        <div className="hidden md:grid grid-cols-6 bg-white/5 text-sm text-gray-400 px-4 py-3">
          <span>Product</span>
          <span>Name</span>
          <span>Price</span>
          <span>Category</span>
          <span>Sizes</span>
          <span className="text-center">Action</span>
        </div>

        {products.map((p) => (
          <div
            key={p._id}
            className="border-t border-white/10 hover:bg-white/5 transition"
          >

            {/* DESKTOP */}
            <div className="hidden md:grid grid-cols-6 items-center px-4 py-3">
              <img
                src={p.image?.[0]}
                className="w-12 h-12 object-cover rounded"
              />

              <span className="text-sm font-medium truncate">
                {p.name}
              </span>

              <span className="text-sm">₹{p.price}</span>

              <span className="text-xs text-gray-400">
                {p.category} / {p.subCategory}
              </span>

              <span className="text-xs text-gray-500">
                {p.sizes?.join(", ") || "-"}
              </span>

              <button
                onClick={() => setConfirmId(p._id)} // ✅ CHANGE
                className="flex justify-center text-red-400 hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* MOBILE */}
            <div className="md:hidden p-4 flex gap-4 items-start">

              <img
                src={p.image?.[0]}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1 space-y-1">

                <p className="font-semibold text-sm leading-tight">
                  {p.name}
                </p>

                <p className="text-xs text-gray-400">
                  ₹{p.price}
                </p>

                <p className="text-xs text-gray-500">
                  {p.category} / {p.subCategory}
                </p>

                <p className="text-xs text-gray-500">
                  Sizes: {p.sizes?.join(", ") || "-"}
                </p>

              </div>

              <button
                onClick={() => setConfirmId(p._id)} // ✅ CHANGE
                className="text-red-400 mt-1"
              >
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="fixed md:hidden bottom-5 right-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg text-sm"
      >
        Dashboard
      </button>

    </div>
  );
};

export default ProductList;