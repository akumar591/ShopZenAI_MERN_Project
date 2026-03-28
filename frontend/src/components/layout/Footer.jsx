import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r mt-4 from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Shop<span className="text-indigo-400">Zen</span>AI
          </h2>
          <p className="text-sm mt-3 text-gray-400">
            Smart AI-powered shopping experience with personalized
            recommendations and seamless checkout.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-indigo-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-indigo-400">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-indigo-400">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/orders" className="hover:text-indigo-400">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-indigo-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-indigo-400">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact With Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/contact" className="hover:text-indigo-400">
                Contact Page
              </Link>
            </li>
            <li className="text-gray-400">📧 support@shopzen.ai</li>
            <li className="text-gray-400">📞 +91 6200790591</li>
            <li className="text-gray-400">📍 Bangalore, India</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ShopZen AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
