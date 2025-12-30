import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

export default function App() {
  return (
    <div className="pt-20">
      <Navbar />
      <Toaster />
      <Outlet />
      <Footer />
    </div>
  );
}
