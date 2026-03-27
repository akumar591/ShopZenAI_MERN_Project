import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/product/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  const [mobileFilter, setMobileFilter] = useState(false);

  const [tempFilter, setTempFilter] = useState("all");
  const [tempSort, setTempSort] = useState("");
  const [tempPriceRange, setTempPriceRange] = useState("all");

  const [desktopPriceOpen, setDesktopPriceOpen] = useState(false);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);

  const [mobilePriceOpen, setMobilePriceOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const [searchParams] = useSearchParams();

  const categories = [
    "all",
    "men",
    "women",
    "kids",
    "electronics",
    "watches",
    "beauty",
    "grocery",
    "footwear",
    "audio",
  ];

  const priceOptions = [
    { label: "All", value: "all" },
    { label: "Under ₹1000", value: "1000" },
    { label: "₹1000 - ₹2000", value: "2000" },
    { label: "₹2000 - ₹5000", value: "5000" },
    { label: "Above ₹5000", value: "5000+" },
  ];

  const sortOptions = [
    { label: "Default", value: "" },
    { label: "Low → High", value: "low" },
    { label: "High → Low", value: "high" },
  ];

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://shopzenai-mern-project.onrender.com/api/product/listproduct",
        );
        if (res.data.success) setProducts(res.data.products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // URL CATEGORY
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) setFilter(urlCategory.toLowerCase());
  }, [searchParams]);

  // MOBILE TEMP SYNC
  useEffect(() => {
    if (mobileFilter) {
      setTempFilter(filter);
      setTempSort(sort);
      setTempPriceRange(priceRange);
    }
  }, [mobileFilter]);

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    let list = [...products];

    const normalize = (v = "") =>
      v
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim();

    if (search.trim()) {
      list = list.filter((p) => normalize(p.name).includes(normalize(search)));
    }

    if (filter !== "all") {
      list = list.filter((p) => normalize(p.category) === normalize(filter));
    }

    if (priceRange !== "all") {
      list = list.filter((p) => {
        if (priceRange === "1000") return p.price <= 1000;
        if (priceRange === "2000") return p.price > 1000 && p.price <= 2000;
        if (priceRange === "5000") return p.price > 2000 && p.price <= 5000;
        if (priceRange === "5000+") return p.price > 5000;
        return true;
      });
    }

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, filter, sort, priceRange]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* SEARCH */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border w-full px-3 py-2 text-sm rounded-md"
          />
          <button
            onClick={() => setMobileFilter(true)}
            className="lg:hidden border px-3 py-2 text-sm rounded-md"
          >
            Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8">
          {/* DESKTOP FILTER */}
          <div className="hidden lg:block w-[220px] space-y-6">
            {/* CATEGORY */}
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`block text-sm mb-2 relative group
                    ${filter === c ? "font-semibold text-black" : "text-gray-500"}
                  `}
                >
                  {c}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all
                      ${filter === c ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div>
              <button
                onClick={() => setDesktopPriceOpen(!desktopPriceOpen)}
                className="w-full flex justify-between border-b py-2 text-sm"
              >
                Price
              </button>

              {desktopPriceOpen &&
                priceOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriceRange(p.value)}
                    className={`block text-sm mb-2
                      ${priceRange === p.value ? "font-semibold text-black" : "text-gray-500"}
                    `}
                  >
                    {p.label}
                  </button>
                ))}
            </div>

            {/* SORT */}
            <div>
              <button
                onClick={() => setDesktopSortOpen(!desktopSortOpen)}
                className="w-full flex justify-between border-b py-2 text-sm"
              >
                Sort
              </button>

              {desktopSortOpen &&
                sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={`block text-sm mb-2
                      ${sort === s.value ? "font-semibold text-black" : "text-gray-500"}
                    `}
                  >
                    {s.label}
                  </button>
                ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="flex-1 pb-20">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold">No Products Found 😢</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try changing filters or search
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white p-4 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setMobileFilter(false)}>✕</button>
            </div>

            {/* CATEGORY */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Category</p>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setTempFilter(c)}
                  className={`block text-sm mb-2
                    ${tempFilter === c ? "font-semibold text-black" : "text-gray-500"}
                  `}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div className="mb-4">
              <button
                onClick={() => setMobilePriceOpen(!mobilePriceOpen)}
                className="w-full flex justify-between border-b py-2 text-sm"
              >
                Price
              </button>

              {mobilePriceOpen &&
                priceOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setTempPriceRange(p.value)}
                    className={`block text-sm mt-2
                      ${tempPriceRange === p.value ? "font-semibold text-black" : "text-gray-500"}
                    `}
                  >
                    {p.label}
                  </button>
                ))}
            </div>

            {/* SORT */}
            <div className="mb-4">
              <button
                onClick={() => setMobileSortOpen(!mobileSortOpen)}
                className="w-full flex justify-between border-b py-2 text-sm"
              >
                Sort
              </button>

              {mobileSortOpen &&
                sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setTempSort(s.value)}
                    className={`block text-sm mt-2
                      ${tempSort === s.value ? "font-semibold text-black" : "text-gray-500"}
                    `}
                  >
                    {s.label}
                  </button>
                ))}
            </div>

            {/* APPLY */}
            <button
              onClick={() => {
                setFilter(tempFilter);
                setSort(tempSort);
                setPriceRange(tempPriceRange);
                setMobileFilter(false);
              }}
              className="w-full bg-black text-white py-2 mt-4 rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
