import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Smart Shopping",
    highlight: "Powered by AI",
    desc: "Personalized recommendations, smart search and better deals.",
    image:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Trending Products",
    highlight: "Picked for You",
    desc: "Discover trending fashion, gadgets and essentials curated by AI.",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Fast & Secure",
    highlight: "Online Shopping",
    desc: "Secure payments, fast delivery and smooth checkout experience.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&auto=format&fit=crop",
  },
];

const HeroSlider = () => {
  const [active, setActive] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setActive(active === 0 ? slides.length - 1 : active - 1);
  };

  const nextSlide = () => {
    setActive((active + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[420px] md:h-[560px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 text-white">
              <h1 className="text-3xl md:text-6xl font-extrabold leading-tight">
                {slide.title}
                <br />
                <span className="text-indigo-400">
                  {slide.highlight}
                </span>
              </h1>

              <p className="mt-4 text-base md:text-xl text-gray-200 max-w-xl">
                {slide.desc}
              </p>

              <Link
                to="/products"
                className="inline-block mt-8 px-8 py-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 transition"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow (hidden on small screens) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow (hidden on small screens) */}
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === active
                ? "bg-indigo-500 scale-110"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
