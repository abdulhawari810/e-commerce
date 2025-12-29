import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Auth() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="font-tiktok bg-neutral-medium w-full lg:h-screen md:h-screen  flex items-center justify-center lg:p-20 md:p-20 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </div>
  );
}
