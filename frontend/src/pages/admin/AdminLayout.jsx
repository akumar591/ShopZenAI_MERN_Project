import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="bg-slate-900 text-gray-100">

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-6 py-4">
        <h1 className="text-xl font-bold text-white">
          Admin Panel
        </h1>
      </div>

      {/* SIDEBAR */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-slate-800 border-r border-slate-700 p-6">
        <h2 className="text-2xl font-bold mb-8 text-white">
          Admin Panel
        </h2>

        <nav className="space-y-3">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-slate-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/add-product"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-slate-700"
              }`
            }
          >
            Add Product
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-slate-700"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-slate-700"
              }`
            }
          >
            Orders
          </NavLink>

        </nav>
      </aside>

      {/* PAGE CONTENT */}
      <div className="lg:ml-64 flex flex-col min-h-screen">

        {/* MAIN CONTENT */}
        <main className="flex-1 px-6 py-10">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;