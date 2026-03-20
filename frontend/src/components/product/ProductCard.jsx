import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const defaultSize = product.sizes?.[0] || "M";

  return (

    <div className="p-3 sm:p-4 rounded-md bg-white/60 backdrop-blur-md border border-gray-200 flex flex-col h-full hover:shadow-sm transition">

      {/* IMAGE */}
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="cursor-pointer overflow-hidden rounded-md"
      >
        <img
          src={product.image?.[0]}
          alt={product.name}
          className="w-full h-40 sm:h-52 md:h-56 object-cover transition duration-300 hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow">

        {/* NAME */}
        <h3
          onClick={() => navigate(`/products/${product._id}`)}
          className="mt-3 text-sm sm:text-base font-medium cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* PRICE */}
        <p className="mt-1 text-sm sm:text-base font-medium">
          ₹{product.price}
        </p>

        {/* BUTTON */}
        <div className="mt-auto pt-3">
          <button
            onClick={() => addToCart(product._id, defaultSize, 1)}
            className="w-full bg-blue-600 text-white py-2 text-xs sm:text-sm rounded-md 
            hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>

      </div>

    </div>

  );
};

export default ProductCard;