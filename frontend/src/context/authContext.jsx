import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { socket } from "../js/socket";
import { useCart } from "./cartCountext";
// buat context
const AuthContext = createContext();

// provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // data user dari backend
  const [loading, setLoading] = useState(true); // status fetch awal
  const [error, setError] = useState(null);
  const baseAPI = import.meta.env.VITE_BASE_API;
  const { setCountCart } = useCart();

  // konfigurasi axios agar kirim cookie otomatis
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    withCredentials: true, // penting: kirim cookie httpOnly
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Hindari tampilkan 404 di console
      if (error.response && error.response.status === 404) {
        // tidak log ke console
        return Promise.reject(error);
      }

      // selain 404 tetap tampil untuk debugging
      console.error(error);
      return Promise.reject(error);
    }
  );

  // ambil data user dari backend
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/Me", {
        validateStatus: (status) => status < 500, // anggap 404 bukan error
      });
      setUser(res.data.users);
    } catch (err) {
      if (err.response?.status === 404) {
        // jangan tampilkan apa pun, cukup handle state
        console.log("Login terlebih dahulu!");
        setUser(null);
      } else {
        // tampilkan error lain (bukan 404)
        console.error(err);
      }
      setError(err.response?.data?.message || "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async (userId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart || cart.length === 0) return;

    await axios.post(
      `${baseAPI}cart/sync`,
      {
        cart,
      },
      {
        withCredentials: true,
      }
    );
    localStorage.removeItem("cart");
  };

  // logout
  const logout = async () => {
    try {
      await axiosInstance.post("/logout", {
        validateStatus: (status) => status < 500, // anggap 404 bukan error
      });
      socket.emit("user:logout");
      setUser(null);
      setCountCart(0);
      toast.success("Logout Berhasil!");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  const login = async (credentials) => {
    const res = await axiosInstance.post("/login", credentials);
    await fetchUser();

    await syncCart(res.data.user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      socket.emit("join", user.id);
    }
  }, [user]);

  // hitung role
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        login,
        isAdmin,
        isUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook biar mudah dipanggil di komponen
export const useAuth = () => useContext(AuthContext);
