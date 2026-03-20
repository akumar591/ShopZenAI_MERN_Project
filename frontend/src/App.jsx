import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop"; // 🔥 ADD THIS

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

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>

          {/* 🔥 GLOBAL SCROLL FIX */}
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

                  <Footer />
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

        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;