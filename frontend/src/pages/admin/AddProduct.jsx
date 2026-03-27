import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Upload, X, Sparkles } from "lucide-react";

const categoryData = {
  men: ["T-Shirts", "Shirts", "Jeans", "Jackets", "Shorts", "Ethnic Wear"],
  women: ["Dresses", "Tops", "Kurtis", "Jeans", "Sarees", "Skirts"],
  kids: ["T-Shirts", "Frocks", "Shorts", "Jeans", "Ethnic Wear"],
  footwear: ["Sneakers", "Sport Shoes", "Formal Shoes", "Sandals", "Boots", "Flip-Flops", "Slippers"],
  watches: ["Analog Watches", "Digital Watches", "Smart Watches"],
  electronics: ["Mobiles", "Laptops", "Tablets", "Cameras"],
  audio: ["Headphones", "Earbuds", "Speakers", "Soundbars"],
};

const AddProduct = () => {
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

  const getSizes = () => {
    if (form.category === "men" || form.category === "women")
      return ["S", "M", "L", "XL", "XXL"];
    if (form.category === "kids")
      return ["1 Year", "2 Year", "3 Year", "4 Year", "5 Year"];
    if (form.category === "footwear") return ["6", "7", "8", "9", "10"];
    if (form.category === "watches") return ["Small", "Medium", "Large"];
    return [];
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, String(size)],
    }));
  };

  const handleImage = async (key, file) => {
    if (!file) return;

    setImages((p) => ({ ...p, [key]: file }));
    setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(file) }));

    // ✅ AI FEATURE (RESTORED)
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
        if (k === "sizes") data.append("sizes", JSON.stringify(v));
        else if (k === "price") data.append("price", Number(v));
        else data.append(k, v);
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
          <div className="bg-green-600 px-6 py-2 rounded-md text-sm font-semibold">
            {message}
          </div>
        </div>
      )}

      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <h1 className="font-semibold text-sm">Add Product</h1>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`hidden md:block px-4 py-1.5 rounded-md text-sm font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Please wait..." : "Publish"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">

        {/* IMAGE SECTION */}
        <div className="w-full lg:w-[45%] p-4">

          {/* ✅ AI LOADING UI */}
          {aiLoading && (
            <p className="text-xs text-indigo-400 flex gap-1 mb-3">
              <Sparkles size={14} /> AI analyzing image…
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {["image1", "image2", "image3", "image4"].map((img) => (
              <div key={img} className="h-32 border border-dashed border-white/20 rounded-lg flex items-center justify-center relative">
                {previews[img] ? (
                  <>
                    <img src={previews[img]} className="w-full h-full object-cover rounded-lg" />
                    <button onClick={() => removeImage(img)} className="absolute top-2 right-2 bg-black/70 p-1 rounded-full">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="text-xs text-gray-400 text-center cursor-pointer">
                    <Upload className="mx-auto mb-1" />
                    Upload
                    <input type="file" hidden onChange={(e) => handleImage(img, e.target.files[0])} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="w-full lg:w-[55%] p-4 space-y-6">

          <EditorInput label="Product Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <EditorTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <EditorInput label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <CustomDropdown
              label="Category"
              options={Object.keys(categoryData)}
              value={form.category}
              onChange={(val) =>
                setForm({
                  ...form,
                  category: val,
                  subCategory: "",
                  sizes: [],
                })
              }
            />

            <CustomDropdown
              label="Sub Category"
              options={categoryData[form.category] || []}
              value={form.subCategory}
              onChange={(val) =>
                setForm({ ...form, subCategory: val })
              }
              disabled={!form.category}
              showMessage={showMessage}
            />

          </div>

          {getSizes().length > 0 && (
            <div>
              <p className="text-xs text-gray-400">Sizes</p>
              <div className="flex gap-2 mt-2 mb-4 flex-wrap">
                {getSizes().map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 border rounded ${
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
          )}

        </div>
      </div>

      <div className="fixed md:hidden bottom-5 left-0 w-full px-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold ${
            loading ? "bg-gray-500" : "bg-indigo-600"
          }`}
        >
          {loading ? "Please wait..." : "Add Product"}
        </button>
      </div>
    </div>
  );
};

// CUSTOM DROPDOWN
const CustomDropdown = ({ label, options, value, onChange, disabled, showMessage }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs text-gray-400">{label}</label>

      <div
        onClick={() => {
          if (disabled) {
            showMessage("Please select category first");
            return;
          }
          setOpen(!open);
        }}
        className={`w-full border-b py-2 text-sm flex justify-between cursor-pointer ${
          disabled ? "border-gray-600 text-gray-500" : "border-white/20"
        }`}
      >
        <span>{value || `Select ${label}`}</span>
        <span>⌄</span>
      </div>

      {open && (
        <div className="absolute w-full bg-[#020617] border border-white/10 mt-2 rounded-md z-50 max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-indigo-600 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditorInput = ({ label, value, onChange, type }) => (
  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <input
      type={type || "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-white/20 py-2"
    />
  </div>
);

const EditorTextarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-white/20 py-2"
    />
  </div>
);

export default AddProduct;