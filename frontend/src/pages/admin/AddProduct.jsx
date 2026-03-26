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
    sizes: [],
  });

  const [images, setImages] = useState({});
  const [previews, setPreviews] = useState({});

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

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
          "https://shopzenai-mern-project.onrender.com/api/ai/scan-image",
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

          showMessage("AI filled product details");
        }
      } catch {
        showMessage("AI scan failed");
      } finally {
        setAiLoading(false);
      }
    }
  };

  const removeImage = (key) => {
    setImages((p) => {
      const obj = { ...p };
      delete obj[key];
      return obj;
    });

    setPreviews((p) => {
      const obj = { ...p };
      delete obj[key];
      return obj;
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const data = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === "sizes") {
          data.append("sizes", JSON.stringify(v));
        } else {
          data.append(k, v);
        }
      });

      Object.keys(images).forEach((k) => data.append(k, images[k]));

      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/product/add",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        showMessage("Product published successfully");

        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          subCategory: "",
          sizes: [],
        });

        setImages({});
        setPreviews({});
      }
    } catch {
      showMessage("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">

      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-600 px-6 py-2 rounded-md shadow-lg text-sm font-semibold">
            {message}
          </div>
        </div>
      )}

      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
        <h1 className="font-semibold text-sm sm:text-base">
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

      <div className="flex flex-col lg:flex-row flex-1">

        <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-l border-white/10 p-4 sm:p-6">

          <h2 className="text-xs uppercase text-gray-400 mb-4">
            Product Media
          </h2>

          {aiLoading && (
            <p className="text-xs text-indigo-400 flex gap-1 mb-3">
              <Sparkles size={14} /> AI analyzing image…
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
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
                      className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="text-xs text-gray-400 text-center cursor-pointer">
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

        <div className="w-full lg:w-[55%] p-4 sm:p-6 lg:p-8 space-y-6">

          <EditorInput
            label="Product name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            big
          />

          <EditorTextarea
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <EditorInput
            label="Price"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
          />

          <div>
            <label className="text-xs text-gray-400">Sizes</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded border text-sm ${
                    form.sizes.includes(size)
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-white/20"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EditorInput
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
            />

            <EditorInput
              label="Sub Category"
              value={form.subCategory}
              onChange={(v) => setForm({ ...form, subCategory: v })}
            />
          </div>

        </div>
      </div>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="fixed md:hidden bottom-5 right-5 bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-full shadow-lg text-sm"
      >
        Dashboard
      </button>
    </div>
  );
};

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
      placeholder="Write product description…"
    />
  </div>
);

export default AddProduct;