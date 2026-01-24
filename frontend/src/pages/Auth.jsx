import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Shield, AlertTriangle } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const { login, register, adminLogin, loading } = useAuth();
  const navigate = useNavigate();

  // 🔐 ADMIN SESSION CHECK
  const adminSession =
    localStorage.getItem("adminSession") === "true";

  // 🚫 AUTO BLOCK USER MODE IF ADMIN ACTIVE
  useEffect(() => {
    if (adminSession) {
      setRole("admin");
      setIsLogin(true);
    }
  }, [adminSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    // ❌ USER BLOCK IF ADMIN LOGGED IN
    if (adminSession && role === "user") {
      setError(
        "Admin is logged in on this system. User access is disabled."
      );
      return;
    }

    let res;

    // 👑 ADMIN LOGIN
    if (isLogin && role === "admin") {
      res = await adminLogin(form.email, form.password);

      if (res.success) {
        setMsg(res.message);
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } else {
        setError(res.message);
      }
      return;
    }

    // 👤 USER LOGIN / REGISTER
    if (isLogin) {
      res = await login(form.email, form.password);
    } else {
      res = await register(form.name, form.email, form.password);
    }

    if (res.success) {
      setMsg(res.message);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">

      {/* LEFT IMAGE */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1200&auto=format&fit=crop"
          alt="shopping"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70 flex items-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-extrabold leading-tight">
              Welcome to <br />
              <span className="text-cyan-300">ShopZen AI</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-sm">
              Secure MERN e-commerce with user & admin access
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT AUTH */}
      <div className="relative flex items-center justify-center px-6">
        <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">

          <h2 className="text-3xl font-bold text-center text-white mb-2">
            {role === "admin"
              ? "Admin Login"
              : isLogin
              ? "User Login"
              : "Create Account"}
          </h2>

          <p className="text-center text-gray-300 mb-4">
            {role === "admin"
              ? "Authorized admin access only"
              : "Login to continue"}
          </p>

          {/* 🔐 ADMIN LOCK WARNING */}
          {adminSession && role === "user" && (
            <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-200 p-3 rounded mb-4 text-sm">
              <AlertTriangle size={16} />
              Admin is logged in. User access disabled.
            </div>
          )}

          {/* SUCCESS / ERROR */}
          {msg && (
            <p className="bg-emerald-500/20 text-emerald-100 p-2 rounded text-sm mb-3 text-center">
              {msg}
            </p>
          )}

          {error && (
            <p className="bg-rose-500/20 text-rose-100 p-2 rounded text-sm mb-3 text-center">
              {error}
            </p>
          )}

          {/* ROLE SWITCH */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6">
            <button
              type="button"
              disabled={adminSession}
              onClick={() => setRole("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition ${
                role === "user"
                  ? "bg-white text-slate-900"
                  : "text-white"
              } ${adminSession ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <User size={16} /> User
            </button>

            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition ${
                role === "admin"
                  ? "bg-white text-slate-900"
                  : "text-white"
              }`}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && role === "user" && (
              <input
                type="text"
                placeholder="Full Name"
                required
                disabled={adminSession}
                className="auth-input"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            )}

            <input
              type="email"
              placeholder="Email"
              required
              className="auth-input"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="auth-input"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading || (adminSession && role === "user")}
              className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : role === "admin"
                ? "Login as Admin"
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          {/* TOGGLE LOGIN / REGISTER */}
          {role === "user" && !adminSession && (
            <p className="text-center text-gray-300 text-sm mt-6">
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold underline"
              >
                {isLogin ? "Create account" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* INPUT STYLES */}
      <style>
        {`
          .auth-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            background: rgba(255,255,255,0.15);
            color: white;
            border: 1px solid rgba(255,255,255,0.25);
            outline: none;
          }
          .auth-input::placeholder {
            color: rgba(255,255,255,0.6);
          }
          .auth-input:focus {
            border-color: #22d3ee;
          }
        `}
      </style>
    </div>
  );
};

export default Auth;
