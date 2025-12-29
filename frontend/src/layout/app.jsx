import { Outlet } from "react-router-dom";
<<<<<<< HEAD
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

export default function App() {
  return (
    <div className="bg-neutral-medium w-full h-screen py-16">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
=======
import { Toaster } from "react-hot-toast";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

export default function App() {
  return (
    <div className="pt-20">
      <Navbar />
      <Toaster />
>>>>>>> 2b2e8e3 (two commit)
      <Outlet />
      <Footer />
    </div>
  );
}
