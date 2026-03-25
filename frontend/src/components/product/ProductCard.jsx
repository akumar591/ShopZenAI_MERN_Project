import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const defaultSize = product.sizes?.[0] || "M";

  const handleAddToCart = () => {
    addToCart(product._id, defaultSize, 1);

    // 🔥 toast (TOP POSITION ONLY CHANGE)
    const toast = document.createElement("div");
    toast.innerText = "Added to cart 🛒";
    toast.className =
      "fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-md shadow z-50";

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 1500);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-sm transition">

      {/* IMAGE */}
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="relative cursor-pointer"
      >
        <img
          src={product.image?.[0]}
          alt={product.name}
          className="w-full h-[170px] sm:h-[200px] object-cover rounded-t-lg"
        />

        {/* AD */}
        <span className="absolute top-2 left-2 text-[10px] bg-gray-200 px-2 py-0.5 rounded">
          AD
        </span>

        {/* CART ICON */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
        >
          <ShoppingCart size={14} />
        </div>

        {/* RATING */}
        <div className="absolute bottom-2 left-2 bg-white text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1">
          ⭐ {product.rating || "4.2"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-2.5 py-2 space-y-1">

        <p className="text-[10px] text-purple-600 font-medium">
          trendy
        </p>

        <h3
          onClick={() => navigate(`/products/${product._id}`)}
          className="text-sm font-medium line-clamp-1 cursor-pointer leading-tight"
        >
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-500 line-clamp-1 leading-tight">
          {product.category}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-1 text-sm">
          <span className="text-green-600 font-semibold">
            ₹{product.price}
          </span>

          <span className="text-gray-400 line-through text-[10px]">
            ₹{product.price + 500}
          </span>

          <span className="text-green-600 text-[10px]">
            50% off
          </span>
        </div>

        <p className="text-[10px] text-gray-500">
          Delivery Tomorrow
        </p>

      </div>
    </div>
  );
};

export default ProductCard;