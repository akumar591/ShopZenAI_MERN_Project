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

  const [searchParams] = useSearchParams();

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/product/listproduct"
        );

        if (res.data.success) {
          const data = res.data.products;
          setProducts(data);

          const prices = data.map((p) => p.price || 0);
          const max = Math.max(...prices);

          setMaxPrice(max);
          setPriceLimit(max);
        }
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= READ CATEGORY FROM URL ================= */
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setFilter(urlCategory.toLowerCase());
    }
  }, [searchParams]);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    let list = [...products];
    const normalize = (v = "") => v.toLowerCase().trim();

    if (search.trim()) {
      const q = normalize(search);
      list = list.filter(
        (p) =>
          normalize(p.name).includes(q) ||
          normalize(p.category).includes(q) ||
          normalize(p.subCategory).includes(q)
      );
    }

    if (filter !== "all") {
      list = list.filter((p) => {
        const name = normalize(p.name);
        const category = normalize(p.category);
        const subCategory = normalize(p.subCategory);

        return (
          name.includes(filter) ||
          category.includes(filter) ||
          subCategory.includes(filter)
        );
      });
    }

    list = list.filter((p) => p.price <= priceLimit);

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, filter, sort, priceLimit]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col gap-4">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="electronics">Electronics</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Sort</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Showing {filteredProducts.length} products
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
