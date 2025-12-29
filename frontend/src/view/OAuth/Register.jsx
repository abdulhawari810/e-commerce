import { Asterisk, EyeIcon } from "lucide-react";
import logo from "../../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confPasswordError, setConfPasswordError] = useState(null);
  const [type, setType] = useState(false);
  const baseAPI = import.meta.env.VITE_BASE_API;
  const timerRef = useRef(null);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const nav = useNavigate();

  const handleUsername = (e) => {
    const value = e.target.value;
    setusername(value);

    setUsernameStatus(null);
    setUsernameError(null);
    clearTimeout(timerRef.current);

    if (value.trim() === "") {
      setUsernameError(null);
      return;
    }

    if (value.length < 8) {
      setUsernameError("Username minimal 8 karakter!");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      setUsernameError("Username harus memiliki huruf besar dan kecil");
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${baseAPI}check-users?username=${value}`);
        if (res.data.exists) {
          setUsernameStatus("Username sudah digunakan!");
        } else {
          setUsernameStatus("Username bisa digunakan!");
        }
      } catch (err) {
        setUsernameError("Gagal memeriksa username!");
      }
    }, 600);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        baseAPI + "register",
        {
          email,
          username,
          password,
          confPassword: confPassword,
        },
        {
          withCredentials: true,
        },
      );
      toast.success("Registrasi berhasil! Silakan login.");
      return nav("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(`Registrasi gagal: ${error.response.data.error}`);
      } else {
        console.log("Registration error:", error);
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
        onSubmit={handleRegister}
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
              Register Your Account
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
            Create New Account
          </h1>
          <div className="w-full lg:px-20 md:px-20 px-5 gap-10 flex lg:grid md:grid lg:grid-cols-2 md:grid-cols-2 flex-col items-center justify-center">
            <div className="form-group flex relative items-center lg:justify-none md:justify-none justify-center rounded-lg">
              <input
                type="text"
                name="username"
                id="username"
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
                htmlFor="username"
                className={`text-md text-primary-light font-medium absolute left-5 peer-focus:left-2.5 peer-focus:translate-y-[-23px] peer-focus:bg-neutral-light peer-focus:text-sm peer-focus:font-normal peer-not-placeholder-shown:left-2.5 peer-not-placeholder-shown:translate-y-[-23px] peer-not-placeholder-shown:bg-neutral-light px-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:font-normal ${
                  usernameError ||
                  usernameStatus === "Username sudah digunakan!"
                    ? "peer-not-placeholder-shown:text-state-danger peer-focus:text-state-danger"
                    : "peer-not-placeholder-shown:text-primary-dark peer-focus:text-primary-dark"
                }`}
              >
                Username
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
            <div className="form-group flex relative items-center lg:justify-none md:justify-none justify-center rouded-lg">
              <input
                type="text"
                name="email"
                id="email"
                placeholder=" "
                onChange={(e) => {
                  const v = e.target.value;
                  setemail(v);
                  setEmailError(null);

                  if (v.trim() === "") {
                    return;
                  }

                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                    setEmailError("Ini bukan alamat email yang valid!");
                  }
                }}
                className={`peer w-[250px] h-11 rounded-lg px-5 text-primary-light outline-2  outline-primary-light/20 ${
                  emailError
                    ? "not-placeholder-shown:outline-state-danger focus:outline-state-danger"
                    : "not-placeholder-shown:outline-primary-dark focus:outline-primary-dark"
                }`}
              />

              <label
                htmlFor="email"
                className={`text-md text-primary-light font-medium absolute left-5 peer-focus:left-2.5 peer-focus:translate-y-[-23px] peer-focus:bg-neutral-light peer-focus:text-sm peer-focus:font-normal peer-not-placeholder-shown:left-2.5 peer-not-placeholder-shown:translate-y-[-23px] peer-not-placeholder-shown:bg-neutral-light px-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:font-normal ${
                  emailError
                    ? "peer-not-placeholder-shown:text-state-danger peer-focus:text-state-danger"
                    : "peer-not-placeholder-shown:text-primary-dark peer-focus:text-primary-dark"
                }`}
              >
                Email Address
              </label>
            </div>
            <div className="form-group flex relative items-center lg:justify-none md:justify-none justify-center rouded-lg">
              <input
                type={type ? "text" : "password"}
                name="password"
                id="password"
                placeholder=" "
                onChange={(e) => {
                  const v = e.target.value;
                  setpassword(v);
                  setPasswordError(null);

                  if (v.trim() === "") return;

                  if (!/^.{8,}$/.test(v)) {
                    setPasswordError("Password minimal 8 karakter!");
                    return;
                  }

                  if (!/(?=.*\d)/.test(v)) {
                    setPasswordError("Password harus berisi angka!");
                    return;
                  }

                  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(v)) {
                    setPasswordError("Password harus ada huruf besar & kecil!");
                    return;
                  }

                  if (!/(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~])/.test(v)) {
                    setPasswordError(
                      "Password harus memiliki karakter spesial!",
                    );
                    return;
                  }
                }}
                className={`peer w-[250px] h-11 rounded-lg px-5 text-primary-light outline-2 outline-primary-light/20 ${
                  passwordError
                    ? "not-placeholder-shown:outline-state-danger focus:outline-state-danger"
                    : "not-placeholder-shown:outline-primary-dark focus:outline-primary-dark"
                }`}
              />

              <label
                htmlFor="password"
                className={`text-md text-primary-light font-medium absolute left-5 peer-focus:left-2.5 peer-focus:translate-y-[-23px] peer-focus:bg-neutral-light peer-focus:text-sm peer-focus:font-normal peer-not-placeholder-shown:left-2.5 peer-not-placeholder-shown:translate-y-[-23px] peer-not-placeholder-shown:bg-neutral-light px-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:font-normal ${
                  passwordError
                    ? "peer-not-placeholder-shown:text-state-danger peer-focus:text-state-danger"
                    : "peer-not-placeholder-shown:text-primary-dark peer-focus:text-primary-dark"
                }`}
              >
                Password
              </label>
            </div>
            <div className="form-group flex relative items-center lg:justify-none md:justify-none justify-center rounded-lg">
              <input
                type={type ? "text" : "password"}
                name="confPassword"
                id="confPassword"
                placeholder=" "
                onChange={(e) => {
                  setconfPassword(e.target.value);

                  if (e.target.value.trim() === "") {
                    setConfPasswordError(null);
                    return;
                  }

                  if (password !== e.target.value) {
                    setConfPasswordError(
                      "Password dan konfirmasi password tidak sama!",
                    );
                    return;
                  }

                  setConfPasswordError(null);
                  return;
                }}
                className={`peer w-60 h-11 rounded-lg pl-5 pr-12 text-primary-light  outline-2  outline-primary-light/20 ${
                  confPasswordError
                    ? "not-placeholder-shown:outline-state-danger focus:outline-state-danger"
                    : "not-placeholder-shown:outline-primary-dark focus:outline-primary-dark"
                }`}
              />

              <label
                htmlFor="confPassword"
                className={`text-md text-primary-light font-medium absolute left-5 peer-focus:left-2.5 peer-focus:translate-y-[-23px] peer-focus:bg-neutral-light peer-focus:text-sm peer-focus:font-normal  peer-not-placeholder-shown:left-2.5 peer-not-placeholder-shown:translate-y-[-23px] peer-not-placeholder-shown:bg-neutral-light px-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:font-normal ${
                  confPasswordError
                    ? "peer-not-placeholder-shown:text-state-danger peer-focus:text-state-danger"
                    : "peer-not-placeholder-shown:text-primary-dark peer-focus:text-primary-dark"
                }`}
              >
                Confirm Password
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
            {emailError && (
              <div
                className={`w-full flex flex-row lg:items-center md:items-center items-start ${
                  !emailError
                    ? "text-state-success"
                    : emailError
                      ? "text-state-danger"
                      : "text-primary-light"
                }`}
              >
                <Asterisk className="lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 " />
                <span className="lg:text-sm md:text-sm text-xs">
                  {emailError}
                </span>
              </div>
            )}
            {passwordError && (
              <div
                className={`w-full flex flex-row lg:items-center md:items-center items-start ${
                  !passwordError
                    ? "text-state-success"
                    : passwordError
                      ? "text-state-danger"
                      : "text-primary-light"
                }`}
              >
                <Asterisk className="lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 " />
                <span className="lg:text-sm md:text-sm text-xs">
                  {passwordError}
                </span>
              </div>
            )}
            {confPasswordError && (
              <div
                className={`w-full flex flex-row lg:items-center md:items-center items-start ${
                  !confPasswordError
                    ? "text-state-success"
                    : confPasswordError
                      ? "text-state-danger"
                      : "text-primary-light"
                }`}
              >
                <Asterisk className="lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 " />
                <span className="lg:text-sm md:text-sm text-xs">
                  {confPasswordError}
                </span>
              </div>
            )}
          </div>
          <button className="w-[250px] h-14 rounded-lg bg-accent-orange flex items-center justify-center text-lg font-black text-primary-dark hover:bg-orange-600 hover:text-neutral-light">
            <span>Create Account</span>
          </button>
          <NavLink
            className={`lg:text-md md:text-md text-sm font-medium text-primary-light/50 hover:underline hover:text-primary-dark`}
            to={"/login"}
          >
            <span>Have an Account?Login</span>
          </NavLink>
        </div>
      </form>
    </div>
  );
}
