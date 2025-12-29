import { forwardRef } from "react";
import { Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { NavLink } from "react-router-dom";

import notDataFound from "../assets/not_data.png";

import {
  getGuestCart,
  getGuestCount,
  setGuestCart,
} from "../utils/cartGuest.utils";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Card = forwardRef(({ children, styles, data }, ref) => {
  const { user } = useAuth();
  const baseAPI = import.meta.env.VITE_BASE_API;

  const handleAddToCart = async (productId, qty) => {
    if (!user) {
      const cart = getGuestCart();

      const index = cart.findIndex((i) => i.productId === productId);

      if (index !== -1) {
        cart[index].qty += qty;
      } else {
        cart.push({ productId, qty });
      }

      setGuestCart(cart);
      setCountCart(getGuestCount());

      const res = await axios.post(`${baseAPI}cart/guest`, { parsing: cart });

      setDataCart(res.data.data);

      toast.success("Produk Berhasil ditambahkan ke keranjang");
      return;
    }
    const res = await axios.post(
      `${baseAPI}cart`,
      {
        productId,
        qty,
      },
      {
        withCredentials: true,
      }
    );

    toast.success(res.data.message);
  };

  const handleWhislist = async (productId) => {
    if (!user) {
      toast.error("Login terlebih dahulu!");
      return;
    }

    try {
      const res = await axios.post(
        `${baseAPI}whislist`,
        { productId },
        { withCredentials: true }
      );

      toast.success(res.data.message);
    } catch (err) {
      if (err?.response?.data?.code === 404) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  return (
    <>
      {data?.length === 0 && (
        <div className="w-full py-10 gap-2.5 flex flex-col items-center justify-center">
          <img
            src={notDataFound}
            alt="Not Data Found"
            className="w-[150px] h-[150px] object-cover rounded-2xl"
          />
          <h1 className="text-slate-900 font-bold text-2xl">No Data Found</h1>
          <span>no Product found today</span>
        </div>
      )}
      <div ref={ref} className={styles}>
        {Array.isArray(data) &&
          data.map((prod, i) => {
            const harga = prod.harga;
            const diskon = prod.diskon;

            const disk = harga - (harga * diskon) / 100;
            const total = harga - disk;

            const totals = harga - total;
            return (
              <div
                className="w-[250px] shrink-0 relative overflow-hidden items-center justify-center flex flex-col rounded-4xl p-2.5 bg-slate-50 shadow-2xl"
                key={i}
              >
                {prod.diskon !== 0 && (
                  <span className="absolute flex items-center justify-center top-0 left-0 rounded-br-2xl bg-red-500 p-2.5 text-lg font-bold text-slate-50">
                    {prod.diskon}%
                  </span>
                )}
                <Button
                  className="absolute top-0 right-0 bg-slate-950 h-12"
                  variant="contained"
                  onClick={() => handleWhislist(prod.id)}
                >
                  <FavoriteBorderIcon />
                </Button>
                <NavLink className="p-2.5 w-full" to={`/Detail/${prod.id}`}>
                  <img
                    src={prod.thumbnail}
                    alt={prod.judul}
                    className="w-full h-auto max-h-[200px] object-contain rounded-2xl shadow-md"
                  />
                  <div className="w-full p-2.5 flex flex-col">
                    <span className="text-slate-950 font-medium">
                      {prod.tipe}
                    </span>
                    <h1 className="text-lg font-bold truncate mb-2.5">
                      {prod.judul}
                    </h1>
                    <div className="flex flex-col-reverse">
                      <span className="text-2xl text-slate-950 font-bold">
                        Rp{" "}
                        {Intl.NumberFormat("id-ID", {
                          maximumFractionDigits: 1,
                        }).format(totals) || 0}
                      </span>
                      {prod.diskon !== 0 && (
                        <span className="text-red-500/80 font-bold line-through">
                          Rp{" "}
                          {Intl.NumberFormat("id-ID", {
                            maximumFractionDigits: 1,
                          }).format(prod.harga) || 0}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full p-2.5 flex flex-row items-center justify-between">
                    <span className="text-sm font-medium">2rb terjual</span>
                    <span className="text-sm font-medium">500 Ulasan</span>
                  </div>
                </NavLink>
                <Button
                  className="w-full bg-slate-950 rounded-2xl h-12"
                  variant="contained"
                  onClick={() => handleAddToCart(prod.id, 1)}
                >
                  Add to cart
                </Button>
              </div>
            );
          })}
      </div>
    </>
  );
});

export default Card;
