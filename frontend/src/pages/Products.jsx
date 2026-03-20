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

  const [maxPrice, setMaxPrice] = useState(0);
  const [priceLimit, setPriceLimit] = useState(0);

  const [mobileFilter, setMobileFilter] = useState(false);

  const [searchParams] = useSearchParams();

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://shopzenai-mern-project.onrender.com/api/product/listproduct"
        );

        if (res.data.success) {
          const data = res.data.products;
          setProducts(data);

          const prices = data.map(p => p.price || 0);
          const max = Math.max(...prices);

          setMaxPrice(max);
          setPriceLimit(max);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= URL FILTER ================= */

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) setFilter(urlCategory.toLowerCase());
  }, [searchParams]);

  /* ================= FILTER ================= */

  const filteredProducts = useMemo(() => {

    let list = [...products];

    const normalize = (v = "") =>
      v.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

    const getWords = (text) => normalize(text).split(/\s+/);

    /* 🔍 SEARCH */
    if (search.trim()) {

      const searchWords = getWords(search);

      list = list.filter(p => {

        const allWords = [
          ...getWords(p.name),
          ...getWords(p.category),
          ...getWords(p.subCategory),
        ];

        return searchWords.every(word => allWords.includes(word));

      });
    }

    /* 🎯 CATEGORY FILTER (TOKEN BASED - NO MIX BUG) */
    if (filter !== "all") {

      list = list.filter(p => {

        const allWords = [
          ...getWords(p.name),
          ...getWords(p.category),
          ...getWords(p.subCategory),
        ];

        return allWords.includes(filter);

      });
    }

    /* 💰 PRICE */
    list = list.filter(p => p.price <= priceLimit);

    /* 🔽 SORT */
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;

  }, [products, search, filter, sort, priceLimit]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="pt-6">

      <div className="max-w-7xl mx-auto px-4">

        {/* SEARCH */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border w-full px-3 py-2 text-sm outline-none rounded-md"
          />

          <button
            onClick={() => setMobileFilter(true)}
            className="lg:hidden border px-4 text-sm rounded-md"
          >
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* FILTERS */}
          <div className="hidden lg:block w-[220px] space-y-6">

            <div>
              <p className="font-medium mb-2">Category</p>
              <div className="flex flex-col gap-2 text-sm">
                {["all", "men", "women", "kids", "electronics"].map(c => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`text-left ${
                      filter === c ? "font-medium" : "text-gray-500"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Price</p>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">₹{priceLimit}</p>
            </div>

            <div>
              <p className="font-medium mb-2">Sort</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border px-2 py-1 text-sm w-full rounded-md"
              >
                <option value="">Default</option>
                <option value="low">Low → High</option>
                <option value="high">High → Low</option>
              </select>
            </div>

          </div>

          {/* PRODUCTS */}
          <div className="flex-1">

            <p className="text-sm text-gray-500 mb-4">
              Showing {filteredProducts.length} products
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE FILTER */}
      {mobileFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">

          <div className="bg-white w-64 p-4 space-y-6">

            <button
              onClick={() => setMobileFilter(false)}
              className="text-sm text-red-500"
            >
              Close
            </button>

            <div>
              <p className="font-medium mb-2">Category</p>
              {["all", "men", "women", "kids", "electronics"].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setFilter(c);
                    setMobileFilter(false);
                  }}
                  className="block text-sm mb-1"
                >
                  {c}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceLimit}
              onChange={(e) => {
                setPriceLimit(Number(e.target.value));
                setMobileFilter(false);
              }}
              className="w-full"
            />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setMobileFilter(false);
              }}
              className="border px-2 py-1 text-sm w-full rounded-md"
            >
              <option value="">Default</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
            </select>

          </div>

        </div>
      )}

    </div>
  );
};

export default Products;