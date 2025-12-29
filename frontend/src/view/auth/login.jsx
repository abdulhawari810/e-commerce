import { useState } from "react";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/authContext";

export default function Register() {
  const [userOrEmail, setuserOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userOrEmailError, setuserOrEmailError] = useState(null);
  const [PasswordError, setPasswordError] = useState(null);
  const { user, login } = useAuth();

  const nav = useNavigate();

  if (user) return <Navigate to={"/"} replace />;

  const handleForm = async (e) => {
    e.preventDefault();

    setuserOrEmailError(null);
    setPasswordError(null);

    try {
      await login({
        userOrEmail,
        password,
      });

      toast.success("Login Success");

      nav("/");
    } catch (err) {
      const message = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="w-full h-screen flex items-center justify-center p-10">
        <form
          className="grid grid-cols-2 w-full h-auto bg-slate-50 rounded-2xl overflow-hidden shadow-2xl"
          onSubmit={handleForm}
        >
          <div className="p-10 gap-5 bg-linear-to-bl from-slate-950 text-slate-50 to-slate-800 flex items-center justify-center flex-col">
            <h1 className="text-2xl font-bold mb-5">Login Your Account</h1>
            <p className="text-sm font-medium">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div className="p-10 flex flex-col gap-5 justify-center items-center">
            <h1 className="text-2xl font-bold">Login to Account</h1>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-center relative rounded-md">
                <input
                  type="text"
                  className="peer w-[250px] h-11 outline outline-slate-500 rounded-md px-5 text-lg text-slate-500 focus:outline-slate-950 not-placeholder-shown:outline-slate-950 focus:text-slate-950 not-placeholder-shown:text-slate-950 hover:outline-slate-950"
                  name="userOrEmail"
                  id="userOrEmail"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;
                    setuserOrEmail(value);
                  }}
                />
                <label
                  className="absolute left-5 text-lg text-slate-500 translate-y-0 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-slate-950 peer-focus:bg-slate-50 peer-focus:left-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-slate-950 peer-not-placeholder-shown:bg-slate-50 px-1"
                  htmlFor="userOrEmail"
                >
                  Username Or Email
                </label>
              </div>
              <div className="flex items-center justify-center relative rounded-md">
                <input
                  type={showPassword ? "text" : "password"}
                  className="peer w-[250px] h-11 outline outline-slate-500 rounded-md px-5 text-lg text-slate-500 focus:outline-slate-950 not-placeholder-shown:outline-slate-950 focus:text-slate-950 not-placeholder-shown:text-slate-950 hover:outline-slate-950 "
                  name="password"
                  id="password"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                  }}
                />
                <label
                  className="absolute left-5 text-lg text-slate-500 translate-y-0 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-slate-950 peer-focus:bg-slate-50 peer-focus:left-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-slate-950 peer-not-placeholder-shown:bg-slate-50 px-1"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
            </div>

            <ul className="flex flex-col w-full pl-5">
              {Array.isArray(userOrEmailError) &&
                userOrEmailError.map((item, i) => {
                  return (
                    <li className="text-md text-red-600 list-disc" key={i}>
                      {item}
                    </li>
                  );
                })}
              {Array.isArray(PasswordError) &&
                PasswordError.map((item, i) => {
                  return (
                    <li className="text-md text-red-600 list-disc" key={i}>
                      {item}
                    </li>
                  );
                })}
            </ul>
            <Button
              variant="contained"
              type="submit"
              className="w-full text-md h-14 rounded-lg font-bold bg-slate-950"
            >
              Login
            </Button>

            <NavLink
              className="text-lg font-medium hover:underline  text-slate-500 hover:text-slate-950"
              to={"/Register"}
            >
              Don't have an account?Register
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}
