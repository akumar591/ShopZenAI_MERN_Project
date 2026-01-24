import { useState } from "react";
import axios from "axios";
import { Upload, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
  });

  const [images, setImages] = useState({});
  const [previews, setPreviews] = useState({});

  /* ================= IMAGE + AI ================= */
  const handleImage = async (key, file) => {
    if (!file) return;

    setImages((p) => ({ ...p, [key]: file }));
    setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(file) }));

    if (key === "image1") {
      try {
        setAiLoading(true);
        const fd = new FormData();
        fd.append("image", file);

        const res = await axios.post(
          "http://localhost:4000/api/ai/scan-image",
          fd
        );

        if (res.data?.success) {
          const ai = res.data.result;
          setForm((f) => ({
            ...f,
            name: ai.name || f.name,
            description: ai.description || f.description,
            category: ai.category || f.category,
            subCategory: ai.subCategory || f.subCategory,
          }));
          setMessage("AI filled product details");
        }
      } catch {
        setMessage("AI scan failed");
      } finally {
        setAiLoading(false);
      }
    }
  };

  const removeImage = (key) => {
    setImages((p) => {
      const o = { ...p };
      delete o[key];
      return o;
    });
    setPreviews((p) => {
      const o = { ...p };
      delete o[key];
      return o;
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      Object.keys(images).forEach((k) => data.append(k, images[k]));

      const res = await axios.post(
        "http://localhost:4000/api/product/add",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("Product published successfully");
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          subCategory: "",
          sizes: "",
        });
        setImages({});
        setPreviews({});
      }
    } catch {
      setMessage("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 flex flex-col">

      {/* TOP BAR */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
        <h1 className="font-semibold tracking-wide text-sm sm:text-base">
          Add Product <span className="text-indigo-400">• Draft</span>
        </h1>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 sm:px-5 py-1.5 rounded-md text-sm font-semibold"
        >
          {loading ? "Saving..." : "Publish"}
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">

          {/* IMAGES – TOP ON MOBILE */}
          <div className="order-1 lg:order-2 w-full lg:w-[45%] border-b lg:border-b-0 lg:border-l border-white/10 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              Product Media
            </h2>

            {aiLoading && (
              <p className="text-xs text-indigo-400 mb-3 flex gap-1">
                <Sparkles size={14} /> AI analyzing image…
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {["image1", "image2", "image3", "image4"].map((img) => (
                <div
                  key={img}
                  className="h-32 sm:h-40 border border-dashed border-white/20 rounded-lg flex items-center justify-center relative"
                >
                  {previews[img] ? (
                    <>
                      <img
                        src={previews[img]}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(img)}
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <label className="text-xs text-gray-400 cursor-pointer text-center">
                      <Upload className="mx-auto mb-1" />
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleImage(img, e.target.files[0])
                        }
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="order-2 lg:order-1 w-full lg:w-[55%] p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
            <EditorInput
              label="Product name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              big
            />

            <EditorTextarea
              label="Description"
              value={form.description}
              onChange={(v) =>
                setForm({ ...form, description: v })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <EditorInput
                label="Price"
                value={form.price}
                onChange={(v) => setForm({ ...form, price: v })}
              />
              <EditorInput
                label="Sizes (S,M,L)"
                value={form.sizes}
                onChange={(v) => setForm({ ...form, sizes: v })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <EditorInput
                label="Category"
                value={form.category}
                onChange={(v) =>
                  setForm({ ...form, category: v })
                }
              />
              <EditorInput
                label="Sub category"
                value={form.subCategory}
                onChange={(v) =>
                  setForm({ ...form, subCategory: v })
                }
              />
            </div>

            {message && (
              <p className="text-sm text-indigo-400">{message}</p>
            )}
          </div>
        </div>
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

/* ================= SMALL EDITOR COMPONENTS ================= */

const EditorInput = ({ label, value, onChange, big }) => (
  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent border-b border-white/20 outline-none py-2 ${
        big ? "text-2xl font-semibold" : "text-sm"
      }`}
      placeholder="Type here…"
    />
  </div>
);

const EditorTextarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <textarea
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-white/20 outline-none py-2 text-sm resize-none"
      placeholder="Write product story…"
    />
  </div>
);

export default AddProduct;
