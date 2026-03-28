import { Brain, Sparkles, ShieldCheck, ShoppingCart, FileText, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Brain size={28} className="text-indigo-600" />,
    title: "AI-Powered Recommendations",
    desc: "Personalized product suggestions based on user behavior and preferences.",
  },
  {
    icon: <Sparkles size={28} className="text-indigo-600" />,
    title: "Smart Search",
    desc: "Search naturally like “men shoes under 3000” with AI-ready logic.",
  },
  {
    icon: <ShoppingCart size={28} className="text-indigo-600" />,
    title: "Modern Shopping Experience",
    desc: "Clean UI, fast navigation and mobile-first design.",
  },
  {
    icon: <ShieldCheck size={28} className="text-indigo-600" />,
    title: "Secure & Scalable",
    desc: "Built with modern frontend architecture, ready for backend & AI integration.",
  },
];

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO */}
      <section className="relative h-[320px] md:h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&auto=format&fit=crop"
          alt="about hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="text-white px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              About <span className="text-indigo-400">ShopZen AI</span>
            </h1>
            <p className="mt-4 text-gray-200 max-w-2xl">
              A modern AI-powered e-commerce experience built for smart shopping.
            </p>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop"
            alt="team"
            className="rounded-xl shadow-lg"
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Who We Are
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              ShopZen AI is a modern e-commerce frontend project focused on
              delivering a smarter, faster and more personalized shopping experience.
            </p>
            <p className="mt-4 text-gray-600">
              Built with AI-first thinking and scalable architecture.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why Choose ShopZen AI?
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 LEGAL / POLICIES SECTION */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center text-gray-900">
            Legal & Policies
          </h2>

          <p className="text-center text-gray-600 mt-3">
            Transparency and trust are important to us.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-8">

            {/* Privacy */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <Lock className="text-indigo-600 mb-4" size={28} />
              <h3 className="text-lg font-semibold text-gray-900">
                Privacy Policy
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                Learn how we collect, use and protect your personal data.
              </p>

              <Link
                to="/privacy"
                className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>

            {/* Terms */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <FileText className="text-indigo-600 mb-4" size={28} />
              <h3 className="text-lg font-semibold text-gray-900">
                Terms & Conditions
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                Understand the rules and guidelines for using our platform.
              </p>

              <Link
                to="/terms"
                className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;