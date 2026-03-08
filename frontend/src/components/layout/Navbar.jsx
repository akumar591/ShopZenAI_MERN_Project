import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Package,
  LogOut,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [adminMenu, setAdminMenu] = useState(false);

  const { cartItems } = useCart();
  const { logout, adminLogout } = useAuth();
  const navigate = useNavigate();

  // 🔐 SESSION CHECKS
  const token = localStorage.getItem("token");
  const adminSession = localStorage.getItem("adminSession") === "true";

  // 🧠 Cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  /* ================= LOGOUT ================= */

  const handleUserLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleAdminLogout = () => {
    adminLogout();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-16">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 tracking-wide"
          >
            Shop<span className="text-gray-900">Zen</span>
            <span className="text-sm text-indigo-500 ml-1">AI</span>
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>

            <Link to="/about" className="hover:text-indigo-600">
              About
            </Link>

            <Link to="/products" className="hover:text-indigo-600">
              Products
            </Link>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden md:flex items-center gap-6 relative">

            {/* ================= ADMIN MODE ================= */}
            {adminSession && (
              <>
                {/* ADMIN DROPDOWN */}
                <div className="relative">

                  <button
                    onClick={() => setAdminMenu(!adminMenu)}
                    className="flex items-center gap-2 text-indigo-600 font-semibold"
                  >
                    <ShieldCheck size={18} />
                    Admin
                    <ChevronDown size={16} />
                  </button>

                  {adminMenu && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg border rounded-lg overflow-hidden">

                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setAdminMenu(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/admin/add-product"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setAdminMenu(false)}
                      >
                        Add Product
                      </Link>

                      <Link
                        to="/admin/products"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setAdminMenu(false)}
                      >
                        Products List
                      </Link>

                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setAdminMenu(false)}
                      >
                        Orders List
                      </Link>

                    </div>
                  )}
                </div>

                {/* ADMIN LOGOUT ICON */}
                <button onClick={handleAdminLogout}>
                  <LogOut className="hover:text-red-500" />
                </button>
              </>
            )}

            {/* ================= USER MODE ================= */}
            {!adminSession && (
              <>
                {/* CART */}
                <Link to="/cart" className="relative">
                  <ShoppingCart className="hover:text-indigo-600" />

                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* ORDERS */}
                {token && (
                  <Link to="/orders">
                    <Package className="hover:text-indigo-600" />
                  </Link>
                )}

                {/* PROFILE */}
                <Link to={token ? "/profile" : "/auth"}>
                  <User className="hover:text-indigo-600" />
                </Link>

                {/* LOGOUT */}
                {token && (
                  <button onClick={handleUserLogout}>
                    <LogOut className="hover:text-red-500" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-white shadow-lg border-t">

          <div className="flex flex-col px-6 py-4 gap-4 text-lg">

            <Link onClick={() => setOpen(false)} to="/">
              Home
            </Link>

            <Link onClick={() => setOpen(false)} to="/about">
              About
            </Link>

            <Link onClick={() => setOpen(false)} to="/products">
              Products
            </Link>

            {/* ADMIN MOBILE MENU */}
            {adminSession && (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  to="/admin/dashboard"
                >
                  Dashboard
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  to="/admin/add-product"
                >
                  Add Product
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  to="/admin/products"
                >
                  Products List
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  to="/admin/orders"
                >
                  Orders List
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    handleAdminLogout();
                  }}
                  className="text-left text-red-500"
                >
                  Admin Logout
                </button>
              </>
            )}

            {/* USER MOBILE MENU */}
            {!adminSession && (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  to="/cart"
                  className="flex justify-between"
                >
                  Cart

                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {token && (
                  <Link
                    onClick={() => setOpen(false)}
                    to="/orders"
                  >
                    Orders
                  </Link>
                )}

                <Link
                  onClick={() => setOpen(false)}
                  to={token ? "/profile" : "/auth"}
                >
                  Profile
                </Link>

                {token && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleUserLogout();
                    }}
                    className="text-left text-red-500"
                  >
                    Logout
                  </button>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;