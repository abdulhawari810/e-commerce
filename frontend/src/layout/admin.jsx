import { Outlet } from "react-router-dom";
<<<<<<< HEAD
=======
import Navbar from "../view/admin/component/navbar";
>>>>>>> 2b2e8e3 (two commit)
import { Toaster } from "react-hot-toast";

export default function Admin() {
  return (
    <>
<<<<<<< HEAD
      <Toaster position="top-center" reverseOrder={false} />
=======
      <Navbar />
      <Toaster />
>>>>>>> 2b2e8e3 (two commit)
      <Outlet />
    </>
  );
}
