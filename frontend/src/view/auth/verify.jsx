import axios from "axios";
import { useState } from "react";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";
import EmailIcon from "@mui/icons-material/Email";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function formatTime(second) {
  const m = Math.floor(second / 60);
  const s = second % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Verify() {
  const [time, setTime] = useState(1500);
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { email, username, password, confPassword } = location.state || {};

  const baseAPI = import.meta.env.VITE_BASE_API;

  if (user) return <Navigate to={"/"} replace />;

  useEffect(() => {
    if (!email) {
      navigate("/Register", { replace: true });
    }
  }, []);

  useEffect(() => {
    const sendOTP = async () => {
      await axios.post(`http://localhost:5000/send/otp`, { email });
    };

    sendOTP();
  }, []);

  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Kode OTP wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${baseAPI}register`,
        {
          email,
          username,
          password,
          otp,
          confPassword,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);

      navigate("/Login");
    } catch (err) {
      const message = err.response?.data?.message || "Verifikasi gagal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <>
      <Toaster />
      <div className="w-full h-screen flex items-center justify-center">
        <form
          className="w-[50%] bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-5 px-10"
          onSubmit={handleVerify}
        >
          <div className="w-[80%] flex items-center justify-center flex-col border-b-2 border-b-slate-300 p-5">
            <EmailIcon className="w-10 h-10 text-green-500" />
            <h1 className="uppercase text-lg font-bold text-slate-500 ">
              verify your email address
            </h1>
          </div>
          <div className="w-[80%] flex items-center justify-center flex-col gap-5 py-5">
            <h1 className="text-slate-950 font-medium">
              A Verification code has been sent to
            </h1>
            <h2 className="text-lg font-bold text-slate-950">{email}</h2>

            <p className="text-slate-700 font-medium text-md">
              Please check your inbox and enter the verification code below to
              verify your email address, The code will expire in{" "}
              {formatTime(time)}
            </p>
            <input
              type="number"
              id="otp"
              name="otp"
              className="w-full h-11 p-5 rounded-lg text-slate-950 font-bold focus:outline-slate-950 outline-2 outline-slate-600"
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="w-full h-14 bg-green-600 text-slate-50 text-md font-bold"
            >
              {loading ? "Memverifikasi..." : "Verify Email"}
            </Button>
            <div className="w-full flex items-center gap-5 justify-between">
              {time > 0 ? (
                <Button disabled className="text-red-500 text-md font-bold">
                  Kirim Ulang Dalam {formatTime(time)}
                </Button>
              ) : (
                <Button className="text-green-500 text-md font-bold">
                  Resend Code
                </Button>
              )}
              <Button className="text-green-500 text-md font-bold">
                Change Email
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
