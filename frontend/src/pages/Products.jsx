import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/product/ProductCard";

const Products = () => {

  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");
  const [sort,setSort] = useState("");

  const [maxPrice,setMaxPrice] = useState(0);
  const [priceLimit,setPriceLimit] = useState(0);

  const [mobileFilter,setMobileFilter] = useState(false);

  const [searchParams] = useSearchParams();


  /* ================= FETCH PRODUCTS ================= */

  useEffect(()=>{

    const fetchProducts = async()=>{

      try{

        const res = await axios.get(
          "http://localhost:5000/api/product/listproduct"
        );

        if(res.data.success){

          const data = res.data.products;

          setProducts(data);

          const prices = data.map(p=>p.price || 0);
          const max = Math.max(...prices);

          setMaxPrice(max);
          setPriceLimit(max);
        }

      }catch(err){
        console.error("Product fetch failed",err);
      }
      finally{
        setLoading(false);
      }

    };

    fetchProducts();

  },[]);



  /* ================= URL CATEGORY ================= */

  useEffect(()=>{

    const urlCategory = searchParams.get("category");

    if(urlCategory){
      setFilter(urlCategory.toLowerCase());
    }

  },[searchParams]);



  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(()=>{

    let list = [...products];

    const normalize = (v="") => v.toLowerCase().trim();

    if(search.trim()){

      const q = normalize(search);

      list = list.filter(p =>
        normalize(p.name).includes(q) ||
        normalize(p.category).includes(q) ||
        normalize(p.subCategory).includes(q)
      );
    }

    if(filter !== "all"){

      list = list.filter(p =>{

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

    list = list.filter(p => p.price <= priceLimit);

    if(sort === "low") list.sort((a,b)=>a.price-b.price);
    if(sort === "high") list.sort((a,b)=>b.price-a.price);

    return list;

  },[products,search,filter,sort,priceLimit]);



  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    )
  }



  return(

  <div className="bg-gray-100 min-h-screen">

  <div className="max-w-7xl mx-auto px-3 py-6">


  {/* ================= SEARCH BAR ================= */}

  <div className="bg-white shadow-sm rounded-lg p-2 mb-4 flex gap-2">

  <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
  />

  <button
  onClick={()=>setMobileFilter(true)}
  className="lg:hidden bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-md"
  >
  Filters
  </button>

  </div>



  {/* ================= MAIN GRID ================= */}

  <div className="grid lg:grid-cols-4 gap-4">


  {/* ================= PRODUCTS ================= */}

  <div className="lg:col-span-3">

  <p className="text-xs text-gray-500 mb-3">
  Showing {filteredProducts.length} products
  </p>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">

  {filteredProducts.map(product =>(

  <ProductCard
  key={product._id}
  product={product}
  />

  ))}

  </div>

  </div>



  {/* ================= DESKTOP FILTERS ================= */}

  <div className="hidden lg:block bg-white p-4 rounded-lg shadow-sm space-y-5 sticky top-20 h-fit">

  <h2 className="text-sm font-semibold">
  Filters
  </h2>



  {/* CATEGORY */}

  <div>

  <p className="text-sm font-medium mb-1">
  Category
  </p>

  <div className="flex flex-col gap-1 text-sm">

  {["all","men","women","kids","electronics"].map(c =>(

  <label key={c} className="flex items-center gap-2">

  <input
  type="radio"
  checked={filter === c}
  onChange={()=>setFilter(c)}
  />

  {c}

  </label>

  ))}

  </div>

  </div>



  {/* PRICE */}

  <div>

  <p className="text-sm font-medium mb-1">
  Price
  </p>

  <input
  type="range"
  min="0"
  max={maxPrice}
  value={priceLimit}
  onChange={(e)=>setPriceLimit(Number(e.target.value))}
  className="w-full"
  />

  <div className="flex justify-between text-xs text-gray-500 mt-1">

  <span>₹0</span>
  <span>₹{priceLimit}</span>

  </div>

  </div>



  {/* SORT */}

  <div>

  <p className="text-sm font-medium mb-1">
  Sort
  </p>

  <select
  value={sort}
  onChange={(e)=>setSort(e.target.value)}
  className="border rounded-md px-2 py-1 text-sm w-full"
  >

  <option value="">Default</option>
  <option value="low">Low → High</option>
  <option value="high">High → Low</option>

  </select>

  </div>

  </div>

  </div>

  </div>



  {/* ================= MOBILE FILTER DRAWER ================= */}

  {mobileFilter && (

  <div className="fixed inset-0 bg-black/40 z-50 flex">

  <div className="bg-white w-64 p-4 space-y-5">

  <div className="flex justify-between items-center">

  <h2 className="text-sm font-semibold">
  Filters
  </h2>

  <button
  onClick={()=>setMobileFilter(false)}
  className="text-red-500 text-sm"
  >
  Close
  </button>

  </div>


  <div>

  <p className="text-sm font-medium mb-1">Category</p>

  {["all","men","women","kids","electronics"].map(c =>(

  <label key={c} className="flex gap-2 text-sm">

  <input
  type="radio"
  checked={filter === c}
  onChange={()=>setFilter(c)}
  />

  {c}

  </label>

  ))}

  </div>


  <div>

  <p className="text-sm font-medium mb-1">Price</p>

  <input
  type="range"
  min="0"
  max={maxPrice}
  value={priceLimit}
  onChange={(e)=>setPriceLimit(Number(e.target.value))}
  className="w-full"
  />

  </div>


  <select
  value={sort}
  onChange={(e)=>setSort(e.target.value)}
  className="border rounded-md px-2 py-1 text-sm w-full"
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