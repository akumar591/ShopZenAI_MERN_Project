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

  const [openPrice, setOpenPrice] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const [openMobilePrice, setOpenMobilePrice] = useState(false);
  const [openMobileSort, setOpenMobileSort] = useState(false);

  const [searchParams] = useSearchParams();

  const categories = ["all","men","women","electronics","watches","footwear","audio"];

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://shopzenai-mern-project.onrender.com/api/product/listproduct");
        if (res.data.success) setProducts(res.data.products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) setFilter(urlCategory.toLowerCase());
  }, [searchParams]);

  useEffect(() => {
    if (mobileFilter) {
      setTempFilter(filter);
      setTempSort(sort);
      setTempPriceRange(priceRange);
    }
  }, [mobileFilter]);

  const filteredProducts = useMemo(() => {

    let list = [...products];

    const normalize = (v="") => v.toLowerCase().replace(/[^a-z0-9\s]/g,"").trim();
    const getWords = (t) => normalize(t).split(/\s+/);

    if (search.trim()) {
      const words = getWords(search);
      list = list.filter(p => {
        const all = [...getWords(p.name),...getWords(p.category),...getWords(p.subCategory)];
        return words.every(w => all.includes(w));
      });
    }

    if (filter !== "all") {
      list = list.filter(p => {
        const all = [...getWords(p.name),...getWords(p.category),...getWords(p.subCategory)];
        return all.includes(filter);
      });
    }

    if (priceRange !== "all") {
      list = list.filter(p => {
        if (priceRange === "1000") return p.price <= 1000;
        if (priceRange === "2000") return p.price > 1000 && p.price <= 2000;
        if (priceRange === "5000") return p.price > 2000 && p.price <= 5000;
        if (priceRange === "5000+") return p.price > 5000;
      });
    }

    if (sort === "low") list.sort((a,b)=>a.price-b.price);
    if (sort === "high") list.sort((a,b)=>b.price-a.price);

    return list;

  },[products,search,filter,sort,priceRange]);

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
            onChange={(e)=>setSearch(e.target.value)}
            className="border w-full px-3 py-1.5 text-sm rounded-md"
          />
          <button onClick={()=>setMobileFilter(true)} className="lg:hidden border px-3 py-1.5 text-sm rounded-md">
            Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8">

          {/* FILTER */}
          <div className="hidden lg:block w-[220px] space-y-6">

            {/* CATEGORY */}
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              {categories.map(c=>(
                <button key={c} onClick={()=>setFilter(c)} className="block text-sm">
                  {c}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div>
              <button onClick={()=>setOpenPrice(!openPrice)} className="w-full flex justify-between border-b">
                Price {openPrice?"−":"+"}
              </button>
              {openPrice && priceOptions.map(p=>(
                <button key={p.value} onClick={()=>setPriceRange(p.value)} className="block text-sm">
                  {p.label}
                </button>
              ))}
            </div>

            {/* SORT */}
            <div>
              <button onClick={()=>setOpenSort(!openSort)} className="w-full flex justify-between border-b">
                Sort {openSort?"−":"+"}
              </button>
              {openSort && sortOptions.map(s=>(
                <button key={s.value} onClick={()=>setSort(s.value)} className="block text-sm">
                  {s.label}
                </button>
              ))}
            </div>

          </div>

          {/* PRODUCTS */}
          <div className="flex-1 pb-20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filteredProducts.map(p=>(
                <ProductCard key={p._id} product={p}/>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;