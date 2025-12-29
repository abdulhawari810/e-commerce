import { useAuth } from "../../context/authContext";
import Carousel from "../../component/carousel";
import Card from "../../component/card";
import axios from "axios";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useState, useEffect, useRef } from "react";

import Menu from "../../component/Menu";
import banner from "../../assets/banner.png";
import percent from "../../assets/percent.png";

export default function Home() {
  const [bestSeller, setBestSeller] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const flashsaleRef = useRef(null);
  const bestsellerRef = useRef(null);
  const newarrivalRef = useRef(null);
  const baseAPI = import.meta.env.VITE_BASE_API;

  const fetch = async (url) => {
    const res = await axios.get(url);

    return res.data.product;
  };

  const { data, isLoading, error } = useSWR(`${baseAPI}product`, fetch);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const res = await axios.get(`${baseAPI}product/tags/1`);
        setBestSeller(res.data.product[0].products);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFlashSale = async () => {
      try {
        const res = await axios.get(`${baseAPI}product/tags/2`);
        setFlashSale(res.data.product[0].products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBestSeller();
    fetchFlashSale();
  }, []);

  const scrollLeft = (ref) => {
    ref.current.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Carousel />
      <Menu />
      <div className=" py-20 bg-slate-50">
        <div className="flex w-full items-start justify-center py-10 relative">
          <img src={banner} alt="Banner" className=" h-[300px] " />
          <img
            src={percent}
            alt="percent"
            className="absolute h-[100px] translate-x-5 "
          />
          <img
            src={percent}
            alt="percent"
            className="absolute h-[100px] top-[200px]"
          />
          <img
            src={percent}
            alt="percent"
            className="absolute h-[100px] right-[100px] rotate-90 -translate-y-5"
          />
          <img
            src={percent}
            alt="percent"
            className="absolute h-[100px] right-[200px] rotate-90 translate-y-32"
          />

          <div className="flex flex-col">
            <h1 className="uppercase text-slate-950 font-bold text-2xl">
              buy one get one
            </h1>
            <h1 className="uppercase text-slate-950 font-bold text-2xl">
              Free!
            </h1>
            <h2 className="uppercase text-slate-950 font-bold text-2xl">
              Only Happen in December
            </h2>
            <NavLink>
              <Button
                variant="contained"
                className="text-slate-50 bg-slate-950 mt-5"
              >
                Shop Now
              </Button>
            </NavLink>
          </div>
        </div>

        <div className="flex px-10 w-full items-center justify-between py-10">
          <h1 className="text-3xl font-bold">Recomended For You</h1>
          <NavLink className="">
            <Button
              className="text-slate-800 flex items-center justify-end"
              variant="text"
            >
              <span>Lainnya</span>
              <ArrowForwardOutlinedIcon className="w-5 h-5" />
            </Button>
          </NavLink>
        </div>

        <div className="relative flex">
          {/* BUTTON PREV */}
          {bestSeller.length > 5 && (
            <Button
              onClick={() => scrollLeft(bestsellerRef)}
              variant="contained"
              className={`bg-slate-950 cursor-pointer absolute left-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowBackIosOutlinedIcon fontSize="small" />
            </Button>
          )}
          {/* BUTTON NEXT */}

          {bestSeller.length > 5 && (
            <Button
              onClick={() => scrollRight(bestsellerRef)}
              variant="contained"
              className={` bg-slate-950 cursor-pointer absolute right-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowForwardIosOutlinedIcon fontSize="small" />
            </Button>
          )}

          <Card
            ref={bestsellerRef}
            styles="flex items-start px-10 jusify-between gap-5 py-10 flex-nowrap overflow-scroll"
            data={bestSeller}
          />
        </div>

        <div className="flex px-10 w-full items-center justify-between py-10">
          <h1 className="text-3xl font-bold">Best Seller</h1>
          <NavLink>
            <Button className="text-slate-800" variant="text">
              <span>Lainnya</span>
              <ArrowForwardOutlinedIcon className="w-5 h-5" />
            </Button>
          </NavLink>
        </div>

        <div className="relative flex">
          {/* BUTTON PREV */}
          {bestSeller.length > 5 && (
            <Button
              onClick={() => scrollLeft(bestsellerRef)}
              variant="contained"
              className={`bg-slate-950 cursor-pointer absolute left-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowBackIosOutlinedIcon fontSize="small" />
            </Button>
          )}
          {/* BUTTON NEXT */}

          {bestSeller.length > 5 && (
            <Button
              onClick={() => scrollRight(bestsellerRef)}
              variant="contained"
              className={` bg-slate-950 cursor-pointer absolute right-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowForwardIosOutlinedIcon fontSize="small" />
            </Button>
          )}

          <Card
            ref={bestsellerRef}
            styles="flex items-start px-10 jusify-between gap-5 py-10 flex-nowrap overflow-scroll"
            data={bestSeller}
          />
        </div>

        <div className="flex px-10 w-full items-center justify-between py-10">
          <h1 className="text-3xl font-bold">Flash Sale</h1>
          <NavLink>
            <Button className="text-slate-800" variant="text">
              <span>Lainnya</span>
              <ArrowForwardOutlinedIcon className="w-5 h-5" />
            </Button>
          </NavLink>
        </div>
        <div className="relative flex items-center justify-center">
          {/* BUTTON PREV */}
          {flashSale.length > 4 && (
            <Button
              onClick={() => {
                if (flashSale.length <= 4) return;
                scrollLeft(flashsaleRef);
              }}
              variant="contained"
              className="bg-slate-950 absolute left-10 top-[50%] -translate-y-1/2 z-10 shadow rounded-full p-2"
            >
              <ArrowBackIosOutlinedIcon fontSize="small" />
            </Button>
          )}
          {/* BUTTON NEXT */}

          {flashSale.length > 4 && (
            <Button
              onClick={() => scrollRight(flashsaleRef)}
              variant="contained"
              className={` bg-slate-950 absolute right-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowForwardIosOutlinedIcon fontSize="small" />
            </Button>
          )}

          <Card
            ref={flashsaleRef}
            styles="flex items-start px-10 jusify-between gap-5 py-10 flex-nowrap overflow-scroll"
            data={flashSale}
          />
        </div>

        <div className="flex px-10 w-full items-center justify-between py-10">
          <h1 className="text-3xl font-bold">New Arrival</h1>
          <NavLink>
            <Button className="text-slate-800" variant="text">
              <span>Lainnya</span>
              <ArrowForwardOutlinedIcon className="w-5 h-5" />
            </Button>
          </NavLink>
        </div>
        <div className="relative flex items-center justify-center">
          {/* BUTTON PREV */}
          {data?.length > 4 && (
            <Button
              onClick={() => scrollLeft(newarrivalRef)}
              variant="contained"
              className={`bg-slate-950 cursor-pointer absolute left-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowBackIosOutlinedIcon fontSize="small" />
            </Button>
          )}
          {/* BUTTON NEXT */}

          {data?.length > 4 && (
            <Button
              onClick={() => scrollRight(newarrivalRef)}
              variant="contained"
              className={` bg-slate-950 cursor-pointer absolute right-10 top-[50%] translate-y-[-50%] z-10 shadow rounded-full p-2`}
            >
              <ArrowForwardIosOutlinedIcon fontSize="small" />
            </Button>
          )}

          <Card
            ref={newarrivalRef}
            styles="flex items-start px-10 jusify-between gap-5 py-10 flex-nowrap overflow-scroll"
            data={data}
          />
        </div>
      </div>
    </>
  );
}
