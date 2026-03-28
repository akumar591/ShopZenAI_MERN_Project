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
      "https://images.unsplash.com/photo-1555529771-7888783a18d3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Electronics & Gadgets",
    highlight: "Smart Living",
    desc: "Discover smartphones, laptops and accessories at unbeatable prices.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Watches Collection",
    highlight: "Timeless Style",
    desc: "Explore analog, digital & smart watches designed for every occasion.",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Beauty & Self Care",
    highlight: "Glow Everyday",
    desc: "Top skincare, makeup and grooming essentials curated for you.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Grocery Essentials",
    highlight: "Daily Needs",
    desc: "Fresh groceries, daily essentials and kitchen needs at best prices.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&auto=format&fit=crop",
  },
];

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const [pause, setPause] = useState(false);

  // ✅ AUTO SLIDE (pause support)
  useEffect(() => {
    if (pause) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [pause]);

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  // ✅ DOT CLICK
  const goToSlide = (index) => {
    setActive(index);
  };

  return (
    <section
      className="relative w-full h-[340px] md:h-[460px] overflow-hidden"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 text-white">

              <h1 className="text-3xl md:text-5xl font-semibold leading-snug tracking-wide">
                {slide.title}
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">
                  {slide.highlight}
                </span>
              </h1>

              <p className="mt-4 text-sm md:text-lg text-gray-300 max-w-lg leading-relaxed">
                {slide.desc}
              </p>

              <Link
                to="/products"
                className="inline-block mt-8 px-7 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
              >
                Explore Now →
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* DOTS (CLICKABLE + PRO STYLE) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              i === active
                ? "bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50"
                : "bg-gray-400 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;