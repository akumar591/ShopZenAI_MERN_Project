import { Link } from "react-router-dom";
import { PlusSquare, Boxes, ShoppingBag } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pt-16">

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* HEADER */}
          <div className="hidden sm:flex mb-10">
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Manage products and control your store
            </p>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* ADD PRODUCT */}
            <Link
              to="/admin/add-product"
              className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition">
                  <PlusSquare className="text-cyan-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Add Product
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Upload new products to store
                  </p>
                </div>
              </div>
            </Link>

            {/* PRODUCT LIST */}
            <Link
              to="/admin/products"
              className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition">
                  <Boxes className="text-blue-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Products
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    View, manage & delete products
                  </p>
                </div>
              </div>
            </Link>

            {/* ORDERS */}
            <Link
              to="/admin/orders"
              className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition">
                  <ShoppingBag className="text-green-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Orders
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    View & manage customer orders
                  </p>
                </div>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;