import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // ❌ user login nahi hai
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ user login hai
  return children;
};

export default ProtectedRoute;
