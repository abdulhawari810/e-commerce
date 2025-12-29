import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, isAdmin, isUser, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (role === "admin" && !isAdmin) return <Navigate to="/" replace />;

  if (role === "users" && !isUser) return <Navigate to="/" replace />;

  return children;
}
