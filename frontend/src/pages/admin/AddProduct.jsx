import { useState } from "react";
import axios from "axios";
import { Upload, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);

  const categories = {
    Men: ["Topwear", "Bottomwear", "Jeans", "Shirts"],
    Women: ["Topwear", "Bottomwear", "Dresses", "Ethnic"],
    Electronics: ["Mobiles", "TV", "LED TV", "Laptops"],
    Footwear: ["Shoes", "Sneakers", "Slippers", "Flip Flop"],
    Audio: ["Headphones", "Earbuds", "Speakers"],
    Watches: ["Analog", "Digital", "Smartwatch"],
  };

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

  // ✅ IMAGE + AI
  const handleImage = async (key, file) => {
    if (!file) return;

    setImages((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));

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

          setForm((prev) => ({
            ...prev,
            name: ai.name || prev.name,
            description: ai.description || prev.description,
            category: ai.category || prev.category,
            subCategory: ai.subCategory || prev.subCategory,
          }));

          showMessage("AI filled product details 🚀");
        }
      } catch {
        showMessage("AI scan failed ❌");
      } finally {
        setAiLoading(false);
      }
    }
  };

  const removeImage = (key) => {
    setImages((prev) => {
      const obj = { ...prev };
      delete obj[key];
      return obj;
    });

    setPreviews((prev) => {
      const obj = { ...prev };
      delete obj[key];
      return obj;
    });
  };

  // ✅ SMART SAVE FUNCTION
  const handleSave = async () => {
    if (loading) return; // 🔒 lock

    // ✅ VALIDATION
    if (!form.name.trim()) return showMessage("Product name is required");
    if (!form.description.trim()) return showMessage("Description is required");
    if (!form.price || isNaN(form.price)) return showMessage("Enter valid price");
    if (!form.category) return showMessage("Select category");
    if (!form.subCategory) return showMessage("Select sub category");
    if (Object.keys(images).length === 0) return showMessage("Upload at least one image");

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");
      if (!token) return showMessage("Admin login required");

      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", Number(form.price));
      data.append("category", form.category);
      data.append("subCategory", form.subCategory);
      data.append("sizes", JSON.stringify(form.sizes));
      data.append("bestseller", false);

      Object.keys(images).forEach((key) => {
        data.append(key, images[key]);
      });

      const res = await axios.post(
        "https://shopzenai-mern-project.onrender.com/api/product/add",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        showMessage("Product published successfully 🚀");

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
      } else {
        showMessage(res.data.message || "Something went wrong");
      }
    } catch {
      showMessage("Server error ❌");
    } finally {
      setLoading(false); // 🔓 unlock
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col pb-20">

      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-600 px-4 py-2 rounded text-sm">
          {message}
        </div>
      )}

      {/* HEADER */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <h1 className="text-sm">Add Product</h1>

        <button
          onClick={handleSave}
          disabled={loading}
          className="hidden md:block bg-indigo-600 px-4 py-1.5 rounded-md text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Publish"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">

        {/* IMAGE */}
        <div className="w-full lg:w-[45%] p-4">

          {aiLoading && (
            <p className="text-xs text-indigo-400 flex gap-1 mb-3">
              <Sparkles size={14} /> AI analyzing image…
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {["image1", "image2", "image3", "image4"].map((img) => (
              <div key={img} className="h-32 border border-dashed border-white/20 rounded flex items-center justify-center relative">
                {previews[img] ? (
                  <>
                    <img src={previews[img]} className="w-full h-full object-cover rounded" />
                    <button onClick={() => removeImage(img)} className="absolute top-2 right-2 bg-black/70 p-1 rounded-full">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="text-xs cursor-pointer text-center">
                    <Upload className="mx-auto mb-1" />
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleImage(img, e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="w-full lg:w-[55%] p-4 space-y-6">

          <Input label="Product name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <Input label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v === "" ? "" : Number(v) })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="relative">
              <label className="text-xs text-gray-400">Category</label>
              <div onClick={() => { setOpenCategory(!openCategory); setOpenSubCategory(false); }} className="border-b border-white/20 py-2 cursor-pointer">
                {form.category || "Select Category"}
              </div>

              {openCategory && (
                <div className="absolute z-50 w-full bg-[#0f172a] border border-white/10 mt-2 rounded">
                  {Object.keys(categories).map((cat) => (
                    <div key={cat} onClick={() => { setForm({ ...form, category: cat, subCategory: "" }); setOpenCategory(false); }} className="p-2 hover:bg-indigo-600 cursor-pointer">
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="text-xs text-gray-400">Sub Category</label>
              <div onClick={() => {
                if (!form.category) return showMessage("Select category first");
                setOpenSubCategory(!openSubCategory);
                setOpenCategory(false);
              }} className="border-b border-white/20 py-2 cursor-pointer">
                {form.subCategory || "Select Sub Category"}
              </div>

              {openSubCategory && form.category && (
                <div className="absolute z-50 w-full bg-[#0f172a] border border-white/10 mt-2 rounded">
                  {categories[form.category].map((sub) => (
                    <div key={sub} onClick={() => { setForm({ ...form, subCategory: sub }); setOpenSubCategory(false); }} className="p-2 hover:bg-indigo-600 cursor-pointer">
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE BUTTON */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0f172a] border-t border-white/10 p-4 flex justify-center">
        <button onClick={handleSave} disabled={loading} className="w-[90%] bg-indigo-600 py-3 rounded-lg">
          {loading ? "Saving..." : "Publish Product"}
        </button>
      </div>

    </div>
  );
};

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent border-b border-white/20 py-2" />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <textarea rows={5} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent border-b border-white/20 py-2 resize-none" />
  </div>
);

export default AddProduct;