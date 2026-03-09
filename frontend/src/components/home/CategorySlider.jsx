import { Link } from "react-router-dom";
import {
  Shirt,
  Laptop,
  Watch,
  ShoppingBag,
  Headphones,
  Footprints,
} from "lucide-react";

const categories = [
  { id: 1, name: "Men", icon: <Shirt size={26} />, link: "/products?category=men" },
  { id: 2, name: "Women", icon: <ShoppingBag size={26} />, link: "/products?category=women" },
  { id: 3, name: "Electronics", icon: <Laptop size={26} />, link: "/products?category=electronics" },
  { id: 4, name: "Watches", icon: <Watch size={26} />, link: "/products?category=watches" },
  { id: 5, name: "Footwear", icon: <Footprints size={26} />, link: "/products?category=footwear" },
  { id: 6, name: "Audio", icon: <Headphones size={26} />, link: "/products?category=audio" },
];

const CategorySlider = () => {
  return (
    <section className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* MOBILE GRID */}
        <div className="grid grid-cols-3 gap-3 md:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="
                flex flex-col items-center gap-1
                bg-white rounded-xl
                py-4
                shadow
                hover:shadow-md
                transition
                group
              "
            >
              <div className="text-indigo-600 group-hover:scale-110 transition">
                {cat.icon}
              </div>

              <p className="text-xs font-medium text-gray-700 text-center">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

        {/* DESKTOP SLIDER */}
        <div
          className="
            hidden md:flex
            gap-4
            justify-center
          "
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="
                min-w-[110px]
                flex flex-col items-center gap-1.5
                bg-white rounded-xl
                px-3 py-4
                shadow
                hover:shadow-md
                transition
                group
              "
            >
              <div className="text-indigo-600 group-hover:scale-110 transition">
                {cat.icon}
              </div>

              <p className="text-sm font-medium text-gray-700 text-center">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySlider;