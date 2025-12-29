import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ForumIcon from "@mui/icons-material/Forum";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import notDataFound from "../../assets/not_data.png";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import axios from "axios";

function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000); // detik

  if (diff < 60) return `${diff} seconds ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} weeks ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(days / 365);
  return `${years} years ago`;
}

export default function Dashboard() {
  const ProductAnalyst = useRef(null);
  const stok1 = useRef(null);
  const stok2 = useRef(null);
  const cardSlider = useRef(null);
  const [activityLogs, setActivityLogs] = useState([]);

  const baseAPI = import.meta.env.VITE_BASE_API;

  const scrollRight = (ref, tipe) => {
    if (tipe === "product_analytic") {
      ref.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    } else if (tipe === "stok1" || tipe === "stok2") {
      ref.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    } else {
      ref.current.scrollBy({
        left: -220,
        behavior: "smooth",
      });
    }
  };
  const scrollLeft = (ref, tipe) => {
    if (tipe === "product_analytic") {
      ref.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    } else if (tipe === "stok1" || tipe === "stok2") {
      ref.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    } else {
      ref.current.scrollBy({
        left: 220,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const res = await axios.get(`${baseAPI}logs`, {
          withCredentials: true,
        });

        setActivityLogs(res.data.logs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchActivityLogs();
  }, []);

  console.log(activityLogs);

  return (
    <div className="pl-[22%] pr-5 ">
      <div className="flex flex-col p-5 rounded-2xl bg-slate-100 h-[80vh]">
        <div className="flex flex-col w-full h-full overflow-y-scroll">
          <h1 className="text-slate-900 font-bold text-2xl">Dashboard</h1>
          <p className="text-slate-600 text-lg mt-2.5 mb-5">
            Monitor your store data and analyze this year's data
          </p>
          {/* card monitoring */}
          <div className="grid grid-cols-3 w-full gap-5">
            <Button
              variant="contained"
              sx={{ textTransform: "unset" }}
              className="bg-slate-50 relative text-slate-950 flex items-start justify-start flex-col w-[300px] rounded-2xl p-5"
            >
              <h1 className="text-lg">Total Revenue</h1>
              <h2 className="font-bold text-4xl mb-2.5">20</h2>
              <div className="flex flex-row items-center gap-2.5">
                <div className="flex items-center outline-1 justify-center p-1 text-green-700 outline-green-700 rounded-sm">
                  <span>5</span>
                  <ArrowDropUpOutlinedIcon className="w-4 h-4" />
                </div>
                <span className="text-green-700 text-sm">
                  Increased from last month
                </span>
              </div>
              <span className="absolute top-0 right-0 p-5 rounded-full">
                <ArrowOutwardOutlinedIcon className="w-8 h-8" />
              </span>
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "unset" }}
              className="bg-slate-50 relative text-slate-950 flex items-start justify-start flex-col w-[300px] rounded-2xl p-5"
            >
              <h1 className="text-lg">Total Products</h1>
              <h2 className="font-bold text-4xl mb-2.5">20</h2>
              <div className="flex flex-row items-center gap-2.5">
                <div className="flex items-center outline-1 justify-center p-1 text-green-700 outline-green-700 rounded-sm">
                  <span>5</span>
                  <ArrowDropUpOutlinedIcon className="w-4 h-4" />
                </div>
                <span className="text-green-700 text-sm">
                  Increased from last month
                </span>
              </div>
              <span className="absolute top-0 right-0 p-5 rounded-full">
                <ArrowOutwardOutlinedIcon className="w-8 h-8" />
              </span>
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "unset" }}
              className="bg-slate-50 relative text-slate-950 flex items-start justify-start flex-col w-[300px] rounded-2xl p-5"
            >
              <h1 className="text-lg">Total Users</h1>
              <h2 className="font-bold text-4xl mb-2.5">20</h2>
              <div className="flex flex-row items-center gap-2.5">
                <div className="flex items-center outline-1 justify-center p-1 text-green-700 outline-green-700 rounded-sm">
                  <span>5</span>
                  <ArrowDropUpOutlinedIcon className="w-4 h-4" />
                </div>
                <span className="text-green-700 text-sm">
                  Increased from last month
                </span>
              </div>
              <span className="absolute top-0 right-0 p-5 rounded-full">
                <ArrowOutwardOutlinedIcon className="w-8 h-8" />
              </span>
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "unset" }}
              className="bg-slate-50 relative text-slate-950 flex items-start justify-start flex-col w-[300px] rounded-2xl p-5"
            >
              <h1 className="text-lg">Total Orders</h1>
              <h2 className="font-bold text-4xl mb-2.5">20</h2>
              <div className="flex flex-row items-center gap-2.5">
                <div className="flex items-center outline-1 justify-center p-1 text-green-700 outline-green-700 rounded-sm">
                  <span>5</span>
                  <ArrowDropUpOutlinedIcon className="w-4 h-4" />
                </div>
                <span className="text-green-700 text-sm">
                  Increased from last month
                </span>
              </div>
              <span className="absolute top-0 right-0 p-5 rounded-full">
                <ArrowOutwardOutlinedIcon className="w-8 h-8" />
              </span>
            </Button>
          </div>
          {/* grafik chart */}
          <div className="grid grid-cols-2 gap-5 my-5">
            <div className="flex flex-col bg-slate-50 shadow-lg p-5 rounded-2xl">
              <h1 className="text-slate-900 font-bold text-2xl mb-5">
                Product Analytics
              </h1>

              <div className="relative peer flex items-center justify-center">
                <Button
                  variant="text"
                  onClick={() =>
                    scrollRight(ProductAnalyst, "product_analytic")
                  }
                  className="z-10 text-slate-950 absolute bg-slate-100/50 left-0"
                >
                  <ArrowBackIosNewOutlinedIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="text"
                  onClick={() => scrollLeft(ProductAnalyst, "product_analytic")}
                  className="z-10 text-slate-950 absolute right-0 bg-slate-100/50"
                >
                  <ArrowBackIosNewOutlinedIcon className="w-5 h-5 rotate-180" />
                </Button>

                <div
                  ref={ProductAnalyst}
                  className="flex relative flex-row overflow-x-scroll overflow-y-hidden items-end gap-5"
                >
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      40%
                    </span>
                    <div className="w-[50px] h-[100px] bg-green-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      January
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[200px] bg-green-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      February
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      Maret
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      April
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      Mei
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      Juny
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      July
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      August
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      September
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      October
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      November
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <span className="p-2 text-sm bg-green-700/20 text-green-700">
                      100%
                    </span>
                    <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                    <span className="text-slate-600 font-medium text-sm">
                      December
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-slate-50 shadow-lg p-5 rounded-2xl">
              <h1 className="text-slate-900 font-bold text-2xl mb-5">
                Orders Analytics
              </h1>

              <div className="flex relative flex-row overflow-x-scroll overflow-y-hidden items-end gap-5">
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <span className="p-2 text-sm bg-green-700/20 text-green-700">
                    40%
                  </span>
                  <div className="w-[50px] h-[100px] bg-green-700/80 rounded-full"></div>
                  <span className="text-slate-600 font-medium text-md">
                    Pending
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <span className="p-2 text-sm bg-green-700/20 text-green-700">
                    100%
                  </span>
                  <div className="w-[50px] h-[200px] bg-green-700/80 rounded-full"></div>
                  <span className="text-slate-600 font-medium text-md">
                    Paid
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <span className="p-2 text-sm bg-green-700/20 text-green-700">
                    100%
                  </span>
                  <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                  <span className="text-slate-600 font-medium text-md">
                    Shipped
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <span className="p-2 text-sm bg-green-700/20 text-green-700">
                    100%
                  </span>
                  <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                  <span className="text-slate-600 font-medium text-md">
                    Completed
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <span className="p-2 text-sm bg-green-700/20 text-green-700">
                    100%
                  </span>
                  <div className="w-[50px] h-[170px] bg-amber-700/80 rounded-full"></div>
                  <span className="text-slate-600 font-medium text-md">
                    Cancelled
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* table orders */}
          <div className="flex flex-col bg-slate-50 p-5 rounded-2xl shadow-lg">
            <h1 className="text-slate-900 font-bold text-2xl mb-6">
              Order Recents
            </h1>

            {/* TABLE WRAPPER */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* HEADER */}
              <div className="grid grid-cols-7 bg-slate-100 divide-x divide-slate-200">
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Order ID
                </h4>
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Customers
                </h4>
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Total Price
                </h4>
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Status
                </h4>
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Payments
                </h4>
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Date
                </h4>
                <h4 className="p-4 text-slate-800 font-semibold uppercase">
                  Actions
                </h4>
              </div>

              {/* BODY */}
              <div className="divide-y divide-slate-200">
                {/* ROW */}
                <div className="grid grid-cols-7 items-center divide-x divide-slate-200">
                  <h3 className="p-4 uppercase text-slate-900">Order-5</h3>
                  <h3 className="p-4 uppercase text-slate-900">saqahayang</h3>
                  <h3 className="p-4 uppercase text-slate-900">5.000.000</h3>
                  <h3 className="p-4 uppercase text-slate-900">Pending</h3>
                  <h3 className="p-4 uppercase text-slate-900">
                    Transfer Bank
                  </h3>
                  <h3 className="p-4 uppercase text-slate-900">2025-17-12</h3>
                  <div className="p-4">
                    <Button
                      variant="contained"
                      sx={{ fontSize: "unset", textTransform: "unset" }}
                      className="bg-slate-900 h-12 rounded-lg w-full flex gap-2"
                    >
                      <span>Details</span>
                      <ArrowOutwardOutlinedIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* ROW */}
                <div className="grid grid-cols-7 items-center divide-x divide-slate-200">
                  <h3 className="p-4 uppercase text-slate-900">Order-6</h3>
                  <h3 className="p-4 uppercase text-slate-900">andika</h3>
                  <h3 className="p-4 uppercase text-slate-900">2.500.000</h3>
                  <h3 className="p-4 uppercase text-slate-900">Success</h3>
                  <h3 className="p-4 uppercase text-slate-900">E-Wallet</h3>
                  <h3 className="p-4 uppercase text-slate-900">2025-18-12</h3>
                  <div className="p-4">
                    <Button
                      variant="contained"
                      sx={{ fontSize: "unset", textTransform: "unset" }}
                      className="bg-slate-900 h-12 rounded-lg w-full flex gap-2"
                    >
                      <span>Details</span>
                      <ArrowOutwardOutlinedIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full my-5">
              <Stack spacing={2}>
                <Pagination count={20} page={1} shape="rounded" size="large" />
              </Stack>
            </div>
          </div>
          {/* product & stock monitoring */}
          <div className="flex flex-col bg-slate-50 shadow-lg rounded-2xl my-5">
            <h1 className="text-slate-900 px-5 font-bold text-2xl mt-5 mb-10">
              Product & Stock
            </h1>
            <div className="grid grid-cols-2 px-5">
              <div className="flex w-full items-center justify-center relative">
                <Button
                  variant="text"
                  onClick={() => scrollRight(stok1, "stok1")}
                  sx={{
                    width: "fit-content",
                    minWidth: "unset",
                    padding: 0,
                  }}
                  className="z-10 w-[30px] h-[30px] text-slate-950 absolute rounded-e-full bg-slate-50 left-0"
                >
                  <ArrowBackIosNewOutlinedIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="text"
                  onClick={() => scrollLeft(stok1, "stok1")}
                  sx={{
                    width: "fit-content",
                    minWidth: "unset",
                    padding: 0,
                  }}
                  className="z-10 w-[30px] h-[30px] text-slate-950 absolute rounded-l-full bg-slate-50 right-0"
                >
                  <ArrowBackIosNewOutlinedIcon className="w-5 h-5 rotate-180" />
                </Button>

                <div className="w-[440px] flex flex-col items-center justify-center rounded-2xl gap-5 p-10 bg-slate-900">
                  <h1 className="text-slate-100 text-lg font-bold">
                    stock is almost out
                  </h1>

                  <div
                    ref={stok1}
                    className="flex flex-nowrap w-full overflow-x-scroll overflow-y-hidden snap-mandatory"
                  >
                    <div className="flex w-full items-center gap-2.5 shrink-0 snap-center">
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-orange-600 font-medium">
                          20 Stock Available
                        </span>
                      </div>
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-orange-600 font-medium">
                          20 Stock Available
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-2.5 shrink-0 snap-center">
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-orange-600 font-medium">
                          20 Stock Available
                        </span>
                      </div>
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-orange-600 font-medium">
                          20 Stock Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <NavLink>
                    <Button
                      className="bg-slate-50 text-slate-950 rounded-2xl flex items-center justify-center"
                      variant="contained"
                    >
                      <span>Details</span>
                      <ArrowOutwardOutlinedIcon className="w-4 h-4" />
                    </Button>
                  </NavLink>
                </div>
              </div>

              <div className="flex w-full items-center justify-center relative">
                <Button
                  variant="text"
                  onClick={() => scrollRight(stok2, "stok2")}
                  sx={{
                    width: "fit-content",
                    minWidth: "unset",
                    padding: 0,
                  }}
                  className="z-10 w-[30px] h-[30px] text-slate-950 absolute rounded-e-full bg-slate-50 left-0"
                >
                  <ArrowBackIosNewOutlinedIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="text"
                  onClick={() => scrollLeft(stok2, "stok2")}
                  sx={{
                    width: "fit-content",
                    minWidth: "unset",
                    padding: 0,
                  }}
                  className="z-10 w-[30px] h-[30px] text-slate-950 absolute rounded-l-full bg-slate-50 right-0"
                >
                  <ArrowBackIosNewOutlinedIcon className="w-5 h-5 rotate-180" />
                </Button>

                <div className="w-[440px] flex flex-col items-center justify-center rounded-2xl gap-5 p-10 bg-slate-900">
                  <h1 className="text-slate-100 text-lg font-bold">
                    out of stock
                  </h1>

                  <div
                    ref={stok2}
                    className="flex flex-nowrap w-full overflow-x-scroll overflow-y-hidden snap-mandatory"
                  >
                    <div className="flex w-full items-center gap-2.5 shrink-0 snap-center">
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-red-700 font-medium">
                          0 Stock Available
                        </span>
                      </div>
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-red-700 font-medium">
                          0 Stock Available
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-2.5 shrink-0 snap-center">
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-red-700 font-medium">
                          0 Stock Available
                        </span>
                      </div>
                      <div className="flex flex-col shrink-0 p-5 rounded-2xl bg-slate-50 items-center justify-center shadow">
                        <img
                          src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                          alt="Product 1"
                          className="w-[100px] h-[100px] object-cover rounded-lg"
                        />
                        <h1 className="text-slate-900 font-bold">Product 1</h1>
                        <span className="text-red-700 font-medium">
                          0 Stock Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <NavLink>
                    <Button
                      className="bg-slate-50 text-slate-950 rounded-2xl flex items-center justify-center"
                      variant="contained"
                    >
                      <span>Details</span>
                      <ArrowOutwardOutlinedIcon className="w-4 h-4" />
                    </Button>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-10 px-5">
              <h1 className="text-slate-900 font-bold text-xl">New Product</h1>
              <Button
                component={NavLink}
                variant="text"
                className="text-slate-600 font-medium"
              >
                <span>See more</span>
                <ArrowOutwardOutlinedIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center relative">
              <Button
                variant="text"
                onClick={() => scrollRight(cardSlider, "card_slider")}
                className="z-10 text-slate-950 absolute bg-slate-100/50 left-0"
              >
                <ArrowBackIosNewOutlinedIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="text"
                onClick={() => scrollLeft(cardSlider, "card_slider")}
                className="z-10 text-slate-950 absolute right-0 bg-slate-100/50"
              >
                <ArrowBackIosNewOutlinedIcon className="w-5 h-5 rotate-180" />
              </Button>
              <div
                ref={cardSlider}
                className="flex items-center justify-between overflow-x-scroll overflow-y-hidden snap-mandatory gap-5 w-full flex-nowrap py-10 px-5"
              >
                <Button
                  variant="contained"
                  component={NavLink}
                  sx={{ textTransform: "unset" }}
                  className="flex flex-col shrink-0 snap-center bg-slate-50 text-slate-900 shadow-xl relative rounded-3xl p-2.5 overflow-hidden"
                >
                  <img
                    src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                    alt="Produk"
                    className="w-full h-[200px] rounded-2xl"
                  />
                  <span className="uppercase text-slate-50 rounded-br-2xl text-xs bg-red-500 absolute top-0 left-0 p-2.5">
                    New
                  </span>
                  <span className="uppercase text-slate-950 rounded-bl-2xl text-xs bg-amber-500 absolute top-0 right-0 p-2.5">
                    draft
                  </span>
                  <span className="text-md font-medium text-slate-800 mt-2">
                    sepatu
                  </span>
                  <div className="flex flex-col items-start px-2.5 w-full">
                    <h1 className="text-lg font-medium">Produk 1</h1>
                    <span className=" text-red-500 line-through">
                      Rp 25.000
                    </span>
                    <span className="text-lg font-bold">Rp 25.000</span>
                  </div>
                  <div className="flex w-full px-2.5 flex-row justify-between items-center">
                    <span>2025-17-12</span>
                    <span className="font-bold">200 Stock</span>
                  </div>
                </Button>
                <Button
                  variant="contained"
                  component={NavLink}
                  sx={{ textTransform: "unset" }}
                  className="flex flex-col shrink-0 snap-center bg-slate-50 text-slate-900 shadow-xl relative rounded-3xl p-2.5 overflow-hidden"
                >
                  <img
                    src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                    alt="Produk"
                    className="w-full h-[200px] rounded-2xl"
                  />
                  <span className="uppercase text-slate-50 rounded-br-2xl text-xs bg-red-500 absolute top-0 left-0 p-2.5">
                    New
                  </span>
                  <span className="uppercase text-slate-950 rounded-bl-2xl text-xs bg-amber-500 absolute top-0 right-0 p-2.5">
                    draft
                  </span>
                  <span className="text-md font-medium text-slate-800 mt-2">
                    sepatu
                  </span>
                  <div className="flex flex-col items-start px-2.5 w-full">
                    <h1 className="text-lg font-medium">Produk 1</h1>
                    <span className=" text-red-500 line-through">
                      Rp 25.000
                    </span>
                    <span className="text-lg font-bold">Rp 25.000</span>
                  </div>
                  <div className="flex w-full px-2.5 flex-row justify-between items-center">
                    <span>2025-17-12</span>
                    <span className="font-bold">200 Stock</span>
                  </div>
                </Button>
                <Button
                  variant="contained"
                  component={NavLink}
                  sx={{ textTransform: "unset" }}
                  className="flex flex-col shrink-0 snap-center bg-slate-50 text-slate-900 shadow-xl relative rounded-3xl p-2.5 overflow-hidden"
                >
                  <img
                    src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                    alt="Produk"
                    className="w-full h-[200px] rounded-2xl"
                  />
                  <span className="uppercase text-slate-50 rounded-br-2xl text-xs bg-red-500 absolute top-0 left-0 p-2.5">
                    New
                  </span>
                  <span className="uppercase text-slate-950 rounded-bl-2xl text-xs bg-amber-500 absolute top-0 right-0 p-2.5">
                    draft
                  </span>
                  <span className="text-md font-medium text-slate-800 mt-2">
                    sepatu
                  </span>
                  <div className="flex flex-col items-start px-2.5 w-full">
                    <h1 className="text-lg font-medium">Produk 1</h1>
                    <span className=" text-red-500 line-through">
                      Rp 25.000
                    </span>
                    <span className="text-lg font-bold">Rp 25.000</span>
                  </div>
                  <div className="flex w-full px-2.5 flex-row justify-between items-center">
                    <span>2025-17-12</span>
                    <span className="font-bold">200 Stock</span>
                  </div>
                </Button>
                <Button
                  variant="contained"
                  component={NavLink}
                  sx={{ textTransform: "unset" }}
                  className="flex flex-col shrink-0 snap-center bg-slate-50 text-slate-900 shadow-xl relative rounded-3xl p-2.5 overflow-hidden"
                >
                  <img
                    src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                    alt="Produk"
                    className="w-full h-[200px] rounded-2xl"
                  />
                  <span className="uppercase text-slate-50 rounded-br-2xl text-xs bg-red-500 absolute top-0 left-0 p-2.5">
                    New
                  </span>
                  <span className="uppercase text-slate-950 rounded-bl-2xl text-xs bg-amber-500 absolute top-0 right-0 p-2.5">
                    draft
                  </span>
                  <span className="text-md font-medium text-slate-800 mt-2">
                    sepatu
                  </span>
                  <div className="flex flex-col items-start px-2.5 w-full">
                    <h1 className="text-lg font-medium">Produk 1</h1>
                    <span className=" text-red-500 line-through">
                      Rp 25.000
                    </span>
                    <span className="text-lg font-bold">Rp 25.000</span>
                  </div>
                  <div className="flex w-full px-2.5 flex-row justify-between items-center">
                    <span>2025-17-12</span>
                    <span className="font-bold">200 Stock</span>
                  </div>
                </Button>
                <Button
                  variant="contained"
                  component={NavLink}
                  sx={{ textTransform: "unset" }}
                  className="flex flex-col shrink-0 snap-center bg-slate-50 text-slate-900 shadow-xl relative rounded-3xl p-2.5 overflow-hidden"
                >
                  <img
                    src="https://down-id.img.susercontent.com/file/6fdc20da041396d4edeced44d0d0795c"
                    alt="Produk"
                    className="w-full h-[200px] rounded-2xl"
                  />
                  <span className="uppercase text-slate-50 rounded-br-2xl text-xs bg-red-500 absolute top-0 left-0 p-2.5">
                    New
                  </span>
                  <span className="uppercase text-slate-950 rounded-bl-2xl text-xs bg-amber-500 absolute top-0 right-0 p-2.5">
                    draft
                  </span>
                  <span className="text-md font-medium text-slate-800 mt-2">
                    sepatu
                  </span>
                  <div className="flex flex-col items-start px-2.5 w-full">
                    <h1 className="text-lg font-medium">Produk 1</h1>
                    <span className=" text-red-500 line-through">
                      Rp 25.000
                    </span>
                    <span className="text-lg font-bold">Rp 25.000</span>
                  </div>
                  <div className="flex w-full px-2.5 flex-row justify-between items-center">
                    <span>2025-17-12</span>
                    <span className="font-bold">200 Stock</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          {/* activity recent / log */}
          <div className="flex flex-col bg-slate-50 shadow-lg rounded-2xl pb-5 my-5">
            <div className="flex px-5 items-center justify-between mt-5 mb-2.5">
              <h1 className="text-slate-900 font-bold text-2xl">
                Activity Recents
              </h1>
            </div>
            <Divider className="border-b-2 my-2" />
            <div
              className={`w-full h-${
                activityLogs?.length !== 0 ? "[400px]" : "[300px]"
              } flex p-5 flex-col gap-5 overflow-y-scroll overflow-x-hidden`}
            >
              {activityLogs?.length !== 0 && (
                <div className="flex flex-col justify-center items-center gap-5 relative my-5">
                  <h1 className="flex items-center justify-center text-md bg-slate-50 px-5 absolute font-bold text-slate-800">
                    Today
                  </h1>
                  <Divider className="border-b-2 w-[70%]" />
                </div>
              )}

              {activityLogs?.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center">
                  <img
                    src={notDataFound}
                    alt="Not Data Found"
                    className="w-[150px] h-[150px] object-cover rounded-2xl"
                  />
                  <h1 className="text-slate-900 font-bold text-2xl">
                    No Activity Logs Found
                  </h1>
                  <span>no activity logs found today</span>
                </div>
              )}

              {Array.isArray(activityLogs) &&
                activityLogs.map((logs, i) => {
                  return (
                    <div
                      className="flex items-center justify-start gap-5 bg-slate-50 p-5 rounded-2xl shadow-lg w-full"
                      key={i}
                    >
                      <div
                        className={`flex items-center justify-center relative rounded-full bg-${
                          logs.status === "success"
                            ? "green"
                            : logs.status === "pending"
                            ? "amber"
                            : "red"
                        }-700 p-2.5 text-slate-50`}
                      >
                        {logs.tipe === "products" ? (
                          <ShoppingBagIcon className="w-8 h-8" />
                        ) : logs.tipe === "sale" ? (
                          <LocalOfferIcon className="w-8 h-8" />
                        ) : logs.tipe === "reviews" ? (
                          <RateReviewIcon className="w-8 h-8" />
                        ) : logs.tipe === "orders" ? (
                          <ShoppingCartCheckoutIcon className="w-8 h-8" />
                        ) : logs.tipe === "shippings" ? (
                          <LocalShippingIcon className="w-8 h-8" />
                        ) : (
                          <ForumIcon className="w-8 h-8" />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2.5 text-slate-700 text-md">
                          <h1>{logs.title}</h1>
                          <div className="flex flex-row gap-2 items-center">
                            <AccessTimeOutlinedIcon className="w-4 h-4" />
                            <span>{timeAgo(logs.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-lg font-medium text-slate-900">
                          {logs.description}
                        </p>
                      </div>
                      {logs.status === "success" ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                      ) : logs.status === "pending" ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
