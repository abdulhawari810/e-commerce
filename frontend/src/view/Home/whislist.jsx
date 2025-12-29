import axios from "axios";
import useSWR from "swr";
import { useAuth } from "../../context/authContext";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  getGuestCart,
  getGuestCount,
  setGuestCart,
} from "../../utils/cartGuest.utils";
import { useCart } from "../../context/cartCountext";
import toast from "react-hot-toast";
import emptyWhislist from "../../assets/empty_whislist.webp";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState } from "react";

export default function Whislist() {
  const { user } = useAuth();
  const baseAPI = import.meta.env.VITE_BASE_API;
  const { dataCart, setDataCart } = useCart();
  const { countCart, setCountCart } = useCart();
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetch = async (url) => {
    const res = await axios.get(url, { withCredentials: true });

    return res.data;
  };

  const { data, isLoading, error, mutate } = useSWR(
    `${baseAPI}whislist?page=${page}&limit=${limit}`,
    fetch,
    {
      keepPreviousData: true,
    },
  );

  const whislist = data?.data || [];
  const totalPage = data?.pagination?.totalPage || 0;

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
      setCountCart(getGuestCount);

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
      },
    );

    toast.success(res.data.message);
  };

  const handleDeleteWhislist = async (productId) => {
    await mutate(
      async (currentData) => {
        // hapus di backend
        await axios.delete(`${baseAPI}whislist/${productId}`, {
          withCredentials: true,
        });

        return {
          ...currentData,
          data: currentData.data.filter((item) => item.productId !== productId),
        };
      },
      {
        optimisticData: {
          ...data,
          data: data.data.filter((item) => item.productId !== productId),
        },
        rollbackOnError: true,
        revalidate: false,
      },
    );

    toast.success("Wishlist berhasil dihapus");
  };

  return (
    <>
      <div className="w-full flex items-center p-10 justify-center">
        <div className="bg-slate-50 w-full p-10 rounded-4xl flex flex-col">
          <h1 className="text-lg font-bold mb-10">My Whislist</h1>
          <div className="grid grid-cols-6 gap-10">
            <div className="flex items-center justify-center w-[150px]"></div>
            <div className="text-lg font-semibold text-slate-900">
              Product Name
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Unit Price
            </div>
            <div className="text-lg font-semibold text-slate-900">Discount</div>
            <div className="text-lg font-semibold text-slate-900">
              Stock Status
            </div>
            <div className="text-lg font-semibold text-slate-900">Action</div>
          </div>
          <Divider className="my-5 bg-slate-200" />

          {whislist?.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10">
              <img
                src={emptyWhislist}
                alt="Empty Whislist"
                className="w-[250px] h-[250px] object-cover"
              />
              <h1 className="text-2xl font-bold mt-5">Whislist Kosong</h1>
              <span className="text-lg font-medium text-slate-700">
                Tambahkan produk ke Whislist
              </span>
            </div>
          )}

          {Array.isArray(whislist) &&
            whislist?.map((item, i) => {
              const harga = item.whislist_product.harga;
              const diskon = item.whislist_product.diskon;

              const disk = harga - (harga * diskon) / 100;
              const total = harga - disk;

              const totals = harga - total;
              return (
                <>
                  <div
                    className="grid items-center grid-cols-6 gap-10 mt-5"
                    key={i}
                  >
                    <img
                      src={item.whislist_product.thumbnail}
                      alt={item.whislist_product.judul}
                      className="w-[100px] h-[100px] object-cover"
                    />
                    <h1 className="text-lg ">{item.whislist_product.judul}</h1>
                    <span className="text-lg ">
                      Rp{" "}
                      {Intl.NumberFormat("id-ID", {
                        maximumFractionDigits: 1,
                      }).format(totals) || 0}
                    </span>
                    <span className="text-lg ">
                      {item.whislist_product.diskon}%
                    </span>
                    <span className="text-lg ">
                      {item.whislist_product.stok}
                    </span>
                    <div className="grid grid-cols-2 gap-5">
                      <Button
                        variant="contained"
                        className="bg-slate-950"
                        onClick={() =>
                          handleAddToCart(item.whislist_product.id, 1)
                        }
                      >
                        <ShoppingCartOutlinedIcon />
                      </Button>
                      <Button
                        variant="contained"
                        className="bg-red-500/80"
                        onClick={() =>
                          handleDeleteWhislist(item.whislist_product.id)
                        }
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Button>
                    </div>
                  </div>
                  <Divider className="my-5 bg-slate-200" />
                </>
              );
            })}

          <div className="flex items-center justify-center w-full">
            {whislist.length > 0 && (
              <Stack spacing={2}>
                <Pagination
                  count={totalPage}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  shape="rounded"
                  size="large"
                />
              </Stack>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
