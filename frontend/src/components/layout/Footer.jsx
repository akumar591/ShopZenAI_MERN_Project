import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-20">
      
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
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-indigo-400">Products</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400">About</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-400">Cart</Link></li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Help
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/orders" className="hover:text-indigo-400">My Orders</Link></li>
            <li><Link to="/checkout" className="hover:text-indigo-400">Checkout</Link></li>
            <li><span className="hover:text-indigo-400 cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer">Terms & Conditions</span></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Connect With Us
          </h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-400">
              <Facebook />
            </a>
            <a href="#" className="hover:text-indigo-400">
              <Instagram />
            </a>
            <a href="#" className="hover:text-indigo-400">
              <Twitter />
            </a>
            <a href="#" className="hover:text-indigo-400">
              <Linkedin />
            </a>
          </div>
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
