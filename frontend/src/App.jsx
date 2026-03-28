import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

// 🆕 Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import ProductList from "./pages/admin/ProductList";
import AdminOrders from "./pages/admin/AdminOrders";

import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AuthProvider } from "./context/AuthContext";

// 🔐 Guards
import UserProtectedRoute from "./routes/UserProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms&Conditions";
import Contact from "./pages/Contact";

// ✅ TOAST IMPORT (ADDED)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContent = () => {
  const location = useLocation();

  const hideFooter = location.pathname.startsWith("/products/");

  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* ================= USER SITE ================= */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />

              <div className="pt-16 min-h-screen">
                <Routes>

                  {/* PUBLIC */}
                  <Route path="/" element={<Home />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                  />

                  {/* USER */}
                  <Route
                    path="/cart"
                    element={
                      <UserProtectedRoute>
                        <Cart />
                      </UserProtectedRoute>
                    }
                  />

                  <Route
                    path="/checkout"
                    element={
                      <UserProtectedRoute>
                        <Checkout />
                      </UserProtectedRoute>
                    }
                  />

                  <Route
                    path="/orders"
                    element={
                      <UserProtectedRoute>
                        <Orders />
                      </UserProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <UserProtectedRoute>
                        <Profile />
                      </UserProtectedRoute>
                    }
                  />

                </Routes>
              </div>

              {!hideFooter && <Footer />}
            </>
          }
        />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin/*"
          element={
            <>
              <Navbar />

              <div className="pt-16 min-h-screen">
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              </div>
            </>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

      </Routes>

      {/* ✅ TOAST CONTAINER (ADDED) */}
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;