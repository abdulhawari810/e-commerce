import { Asterisk, EyeIcon } from "lucide-react";
import logo from "../../assets/logo.png";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [userOrEmail, setUserOrEmail] = useState("");
  const [password, setpassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [type, setType] = useState(false);
  const baseAPI = import.meta.env.VITE_BASE_API;
  const timerRef = useRef(null);
  const [usernameStatus, setUsernameStatus] = useState(null);

  const { user, login, loading } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const nav = useNavigate();

  const handleUsername = (e) => {
    const value = e.target.value;
    setUserOrEmail(value);

    setUsernameStatus(null);
    setUsernameError(null);
    clearTimeout(timerRef.current);

    if (value.trim() === "") {
      setUsernameError(null);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${baseAPI}check-users?username=${value}`);

        if (!res.data.exists) {
          setUsernameStatus("Username tidak ditemukan!");
        } else {
          setUsernameStatus(null); // valid, tapi tidak perlu kasih pesan
        }
      } catch (err) {
        setUsernameError("Gagal memeriksa username!");
      }
    }, 600);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ userOrEmail, password });
      toast.success("Login berhasil!");
      return nav("/");
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(`Login gagal: ${error.response.data.error}`);
      } else {
        console.error("Login error:", error);
        toast.error(
          error.response?.data?.message || "Terjadi kesalahan saat registrasi.",
        );
      }
    }
  };
  return (
    <div className="font-tiktok bg-neutral-medium w-full lg:h-screen md:h-screen  flex items-center justify-center lg:p-20 md:p-20 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      <form
        className={`w-full h-auto flex flex-col lg:flex-row md:flex-row bg-neutral-light overflow-hidden rounded-4xl lg:shadow-2xl md:shadow-2xl shadow-md`}
        onSubmit={handleLogin}
      >
        <div className="lg:w-[40%] md:w-[40%] w-full flex flex-col lg:bg-accent-soft-blue/40 md:bg-accent-soft-blue/40 bg-neutral-light">
          <div className="w-full bg-accent-orange flex items-center justify-center pt-5">
            <img
              src={logo}
              alt="Logo"
              className="object-cover bg-primary-dark rounded-full w-20 h-20"
            />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#FF8E3C"
              fill-opacity="1"
              d="M0,288L60,293.3C120,299,240,309,360,272C480,235,600,149,720,138.7C840,128,960,192,1080,224C1200,256,1320,256,1380,256L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
          <div className="p-5 hidden lg:flex md:flex flex-col gap-2.5">
            <h1 className="font-black text-primary-dark text-2xl">
              Login Your Account
            </h1>
            <p className="font-medium text-primary-light text-md">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores,
              qui soluta eum quos exercitationem dolor quasi rem iure libero
              laudantium quo molestias expedita omnis nulla dignissimos,
              consequuntur harum repudiandae fugit!
            </p>
          </div>
        </div>
        <div className="lg:w-[60%] md:w-[60%] w-full flex flex-col items-center justify-center gap-5 py-5">
          <h1 className="font-black text-primary-dark text-2xl mb-5">
            Login to Account
          </h1>
          <div className="w-full lg:px-20 md:px-20 px-5 gap-10 flex flex-col items-center justify-center">
            <div className="form-group flex relative items-center lg:justify-none md:justify-none justify-center rounded-lg">
              <input
                type="text"
                name="userOrEmail"
                id="userOrEmail"
                placeholder=" "
                onChange={(e) => handleUsername(e)}
                className={`peer w-[250px] h-11 rounded-lg px-5 text-primary-light outline-2 ${
                  usernameError ||
                  usernameStatus === "Username sudah digunakan!"
                    ? "not-placeholder-shown:outline-state-danger focus:outline-state-danger"
                    : "not-placeholder-shown:outline-primary-dark focus:outline-primary-dark"
                } outline-primary-light/20`}
              />

              <label
                htmlFor="userOrEmail"
                className={`text-md text-primary-light font-medium absolute left-5 peer-focus:left-2.5 peer-focus:translate-y-[-23px] peer-focus:bg-neutral-light peer-focus:text-sm peer-focus:font-normal peer-not-placeholder-shown:left-2.5 peer-not-placeholder-shown:translate-y-[-23px] peer-not-placeholder-shown:bg-neutral-light px-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:font-normal ${
                  usernameError ||
                  usernameStatus === "Username sudah digunakan!"
                    ? "peer-not-placeholder-shown:text-state-danger peer-focus:text-state-danger"
                    : "peer-not-placeholder-shown:text-primary-dark peer-focus:text-primary-dark"
                }`}
              >
                Username Or Email
              </label>
              {usernameStatus && (
                <span
                  className={`absolute left-0 top-12 text-sm font-medium ${
                    usernameStatus === "Username bisa digunakan!"
                      ? "text-state-success"
                      : "text-state-danger"
                  }`}
                >
                  {usernameStatus}
                </span>
              )}
            </div>
            <div className="form-group flex relative items-center lg:justify-none md:justify-none justify-center rounded-lg">
              <input
                type={type ? "text" : "password"}
                name="password"
                id="password"
                placeholder=" "
                onChange={(e) => {
                  const v = e.target.value;
                  setpassword(v);
                }}
                className={`peer w-[250px] h-11 rounded-lg px-5 text-primary-light outline-2 outline-primary-light/20 not-placeholder-shown:outline-primary-dark focus:outline-primary-dark`}
              />

              <label
                htmlFor="password"
                className={`text-md text-primary-light font-medium absolute left-5 peer-focus:left-2.5 peer-focus:translate-y-[-23px] peer-focus:bg-neutral-light peer-focus:text-sm peer-focus:font-normal peer-not-placeholder-shown:left-2.5 peer-not-placeholder-shown:translate-y-[-23px] peer-not-placeholder-shown:bg-neutral-light px-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:font-normal peer-not-placeholder-shown:text-primary-dark peer-focus:text-primary-dark`}
              >
                Password
              </label>
              <EyeIcon
                onClick={() => setType(!type)}
                className={`w-5 h-5 absolute right-5 cursor-pointer bg ${
                  type ? "text-primary-dark" : "text-primary-light/70"
                }`}
              />
            </div>
          </div>

          <div className="w-full lg:px-20 px-5 md:px-20 flex flex-col items-center justify-center">
            {usernameError && (
              <div
                className={`w-full flex flex-row lg:items-center md:items-center items-start ${
                  !usernameError
                    ? "text-state-success"
                    : usernameError
                      ? "text-state-danger"
                      : "text-primary-light"
                }`}
              >
                <Asterisk className="lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 " />
                <span className="lg:text-sm md:text-sm text-xs">
                  {usernameError}
                </span>
              </div>
            )}
          </div>
          <button className="w-[250px] h-14 rounded-lg bg-accent-orange flex items-center justify-center text-lg font-black text-primary-dark hover:bg-orange-600 hover:text-neutral-light">
            <span>Login</span>
          </button>
          <NavLink
            className={`lg:text-md md:text-md text-sm font-medium text-primary-light/50 hover:underline hover:text-primary-dark`}
            to={"/register"}
          >
            <span>Don't Have an Account?Register</span>
          </NavLink>
        </div>
      </form>
    </div>
  );
}
