import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const defaultSize = product.sizes?.[0] || "M";

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="cursor-pointer"
      >
        <img
          src={product.image?.[0]}
          className="h-48 w-full object-cover rounded"
        />
      </div>

      <h3
        onClick={() => navigate(`/products/${product._id}`)}
        className="mt-2 font-semibold cursor-pointer"
      >
        {product.name}
      </h3>

      <p className="text-indigo-600 font-bold">
        ₹{product.price}
      </p>

      {/* ✅ ADD TO CART HERE */}
      <button
        onClick={() => addToCart(product._id, defaultSize, 1)}
        className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
