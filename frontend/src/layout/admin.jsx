import { Outlet } from "react-router-dom";
import Navbar from "../view/admin/component/navbar";
import { Toaster } from "react-hot-toast";

export default function Admin() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Outlet />
    </>
  );
}
