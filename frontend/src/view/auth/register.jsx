import { useState } from "react";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPasword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [EmailError, setEmailError] = useState(null);
  const [PasswordError, setPasswordError] = useState(null);
  const [ConfPasswordError, setConfPasswordError] = useState(null);
  const { user } = useAuth();

  const nav = useNavigate();
  
  if (user) return <Navigate to={"/"} replace />;

  const handleForm = async (e) => {
    e.preventDefault();

    // reset error
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfPasswordError(null);

    const Char8 = /.{8,}/;
    const a_z = /(?=.*[a-z])/;
    const A_Z = /(?=.*[A-Z])/;
    const special_char = /(?=.*[!@#$^&*(),.?":{}|<>_\-])/;
    const angka = /(?=.*\d)/;
    const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let hasError = false;

    // EMAIL
    if (email.trim() === "") {
      setEmailError(["Alamat Email wajib diisi"]);
      hasError = true;
    } else if (!regexp.test(email)) {
      setEmailError(["Alamat Email tidak valid"]);
      hasError = true;
    }

    // PASSWORD
    if (password.trim() === "") {
      setPasswordError(["Password wajib diisi"]);
      hasError = true;
    } else if (!Char8.test(password)) {
      setPasswordError(["Password Minimal 8"]);
      hasError = true;
    } else if (!A_Z.test(password)) {
      setPasswordError(["Password memiliki huruf besar"]);
      hasError = true;
    } else if (!a_z.test(password)) {
      setPasswordError(["Password memiliki huruf kecil"]);
      hasError = true;
    } else if (!special_char.test(password)) {
      setPasswordError([
        "Password harus memiliki setidaknya 1 special karakter",
      ]);
      hasError = true;
    } else if (!angka.test(password)) {
      setPasswordError(["Password wajib diisi angka"]);
      hasError = true;
    }

    // USERNAME
    if (username.trim() === "") {
      setUsernameError(["Username wajib diisi"]);
      hasError = true;
    } else if (!Char8.test(username)) {
      setUsernameError(["Username Minimal 8"]);
      hasError = true;
    } else if (!A_Z.test(username)) {
      setUsernameError(["Username memiliki huruf besar"]);
      hasError = true;
    } else if (!a_z.test(username)) {
      setUsernameError(["Username memiliki huruf kecil"]);
      hasError = true;
    }

    // CONFIRM PASSWORD
    if (confPassword.trim() === "") {
      setConfPasswordError(["Konfirmasi Password wajib diisi"]);
      hasError = true;
    } else if (confPassword !== password) {
      setConfPasswordError(["Confirm Password tidak sama"]);
      hasError = true;
    }

    if (hasError) return;

    try {
      nav("/Verify", {
        state: {
          email,
          username,
          password,
          confPassword,
        },
      });
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
            <h1 className="text-2xl font-bold mb-5">Create Your Account</h1>
            <p className="text-sm font-medium">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div className="p-10 flex flex-col gap-5 justify-center items-center">
            <h1 className="text-2xl font-bold">Register</h1>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-center relative rounded-md">
                <input
                  type="text"
                  className="peer w-[250px] h-11 outline outline-slate-500 rounded-md px-5 text-lg text-slate-500 focus:outline-slate-950 not-placeholder-shown:outline-slate-950 focus:text-slate-950 not-placeholder-shown:text-slate-950 hover:outline-slate-950"
                  name="username"
                  id="username"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;

                    const Char8 = /.{8,}/;
                    const a_z = /(?=.*[a-z])/;
                    const A_Z = /(?=.*[A-Z])/;

                    if (!Char8.test(value))
                      return setUsernameError(["Username Minimal 8"]);

                    if (!A_Z.test(value))
                      return setUsernameError([
                        "Username memiliki huruf besar",
                      ]);
                    if (!a_z.test(value))
                      return setUsernameError([
                        "Username memiliki huruf Kecil",
                      ]);

                    setUsername(value);
                    setUsernameError(null);
                  }}
                />
                <label
                  className="absolute left-5 text-lg text-slate-500 translate-y-0 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-slate-950 peer-focus:bg-slate-50 peer-focus:left-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-slate-950 peer-not-placeholder-shown:bg-slate-50 px-1"
                  htmlFor="username"
                >
                  Username
                </label>
              </div>
              <div className="flex items-center justify-center relative rounded-md">
                <input
                  type="email"
                  className="peer w-[250px] h-11 outline outline-slate-500 rounded-md px-5 text-lg text-slate-500 focus:outline-slate-950 not-placeholder-shown:outline-slate-950 focus:text-slate-950 not-placeholder-shown:text-slate-950 hover:outline-slate-950"
                  name="email"
                  id="email"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;

                    const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

                    if (value.trim() === "")
                      return setEmailError(["Alamat Email wajib diisi"]);

                    if (!regexp.test(value))
                      return setEmailError(["Alamat Email tidak valid"]);
                    setEmail(value);
                    setEmailError(null);
                  }}
                />
                <label
                  className="absolute left-5 text-lg text-slate-500 translate-y-0 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-slate-950 peer-focus:bg-slate-50 peer-focus:left-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-slate-950 peer-not-placeholder-shown:bg-slate-50 px-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
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

                    const Char8 = /.{8,}/;
                    const a_z = /(?=.*[a-z])/;
                    const A_Z = /(?=.*[A-Z])/;
                    const special_char = /(?=.*[!@#$^&*(),.?":{}|<>_\-])/;
                    const angka = /(?=.*\d)/;

                    if (!Char8.test(value))
                      return setPasswordError(["Password Minimal 8"]);

                    if (!A_Z.test(value))
                      return setPasswordError([
                        "Password memiliki huruf besar",
                      ]);
                    if (!a_z.test(value))
                      return setPasswordError([
                        "Password memiliki huruf Kecil",
                      ]);
                    if (!special_char.test(value))
                      return setPasswordError([
                        "Password harus memiliki setidak nya special karakter",
                      ]);
                    if (!angka.test(value))
                      return setPasswordError(["Password wajib diisi angka"]);

                    setPassword(value);
                    setPasswordError(null);
                  }}
                />
                <label
                  className="absolute left-5 text-lg text-slate-500 translate-y-0 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-slate-950 peer-focus:bg-slate-50 peer-focus:left-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-slate-950 peer-not-placeholder-shown:bg-slate-50 px-1"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="flex items-center justify-center relative rounded-md">
                <input
                  type={showPassword ? "text" : "password"}
                  className="peer w-[250px] h-11 outline outline-slate-500 rounded-md px-5 text-lg text-slate-500 focus:outline-slate-950 not-placeholder-shown:outline-slate-950 focus:text-slate-950 not-placeholder-shown:text-slate-950 hover:outline-slate-950"
                  name="confPassword"
                  id="confPassword"
                  placeholder=" "
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.value !== password)
                      return setConfPasswordError([
                        "Confirm Passowrd not Matches",
                      ]);

                    setConfPasword(e.target.value);
                    setConfPasswordError(null);
                  }}
                />
                <label
                  className="absolute left-5 text-lg text-slate-500 translate-y-0 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-slate-950 peer-focus:bg-slate-50 peer-focus:left-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-slate-950 peer-not-placeholder-shown:bg-slate-50 px-1"
                  htmlFor="confPassword"
                >
                  Confirm Password
                </label>
                <RemoveRedEyeIcon
                  className={`w-5 h-5 ${
                    showPassword ? "text-slate-950" : "text-slate-400"
                  } absolute right-2.5`}
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              </div>
            </div>

            <ul className="flex flex-col w-full pl-5">
              {Array.isArray(usernameError) &&
                usernameError.map((item, i) => {
                  return (
                    <li className="text-md text-red-600 list-disc" key={i}>
                      {item}
                    </li>
                  );
                })}
              {Array.isArray(EmailError) &&
                EmailError.map((item, i) => {
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
              {Array.isArray(ConfPasswordError) &&
                ConfPasswordError.map((item, i) => {
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
              Create Account
            </Button>
            <NavLink
              className="text-lg font-medium hover:underline text-slate-500 hover:text-slate-950"
              to={"/Login"}
            >
              Do you have an account?Login
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}
