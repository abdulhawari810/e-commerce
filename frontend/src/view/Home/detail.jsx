import { useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Divider from "@mui/material/Divider";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Pagination from "@mui/material/Pagination";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";

import { useRef } from "react";
import {
  getGuestCart,
  getGuestCount,
  setGuestCart,
} from "../../utils/cartGuest.utils";
import { useCart } from "../../context/cartCountext";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";

export default function Detail() {
  const productId = useParams();
  const baseAPI = import.meta.env.VITE_BASE_API;
  const { user } = useAuth();

  const fetch = async (url) => {
    const res = await axios.get(url);

    return res.data.product;
  };

  const { data, isLoading, error } = useSWR(
    `${baseAPI}product/${productId.productId}`,
    fetch
  );

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Home
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/Product">
      All Product
    </Link>,
    <Typography key="3" sx={{ color: "text.primary" }}>
      {data?.judul}
    </Typography>,
  ];

  let colors = [];
  let imgDetail = [];
  let size = [];
  let feature = [];
  try {
    if (data?.detail.colors && typeof data.detail.colors === "string") {
      colors = JSON.parse(data.detail.colors);
    } else if (Array.isArray(data?.detail.colors)) {
      colors = data.detail.colors;
    }

    if (
      data?.detail.image_detail &&
      typeof data.detail.image_detail === "string"
    ) {
      imgDetail = JSON.parse(data.detail.image_detail);
    } else if (Array.isArray(data?.detail.image_detail)) {
      imgDetail = data.detail.image_detail;
    }

    if (data?.detail.size && typeof data.detail.size === "string") {
      size = JSON.parse(data.detail.size);
    } else if (Array.isArray(data?.detail.size)) {
      size = data.detail.size;
    }

    if (data?.detail.feature && typeof data.detail.feature === "string") {
      feature = JSON.parse(data.detail.feature);
    } else if (Array.isArray(data?.detail.feature)) {
      feature = data.detail.feature;
    }
  } catch (err) {
    console.error("Gagal parse data:", err);
    imgDetail = [];
    size = [];
    colors = [];
    feature = [];
  }

  const harga = data?.harga;
  const diskon = data?.diskon;

  const disk = harga - (harga * diskon) / 100;
  const total = harga - disk;

  const totals = harga - total;

  const [alignment, setAlignment] = useState("");

  const [colorsMap, setColorsMap] = useState([]);

  useEffect(() => {
    const getColors = async () => {
      const res = await axios.get(`${baseAPI}colors`);

      setColorsMap(res.data.colors);
    };

    getColors();
  }, []);

  useEffect(() => {
    if (Array.isArray(size) && size.length > 0 && alignment === "") {
      setAlignment(size[0]);
    }
  }, [size, alignment]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedSize");
    if (saved) setAlignment(saved);
  }, []);

  useEffect(() => {
    if (alignment) {
      localStorage.setItem("selectedSize", alignment);
    }
  }, [alignment]);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const [selectedValue, setSelectedValue] = useState(() => {
    const colors = localStorage.getItem("selectedColor");
    return colors;
  });
  const [filterRatingValue, setFilterRatingValue] = useState(5);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    localStorage.setItem("selectedColor", event.target.value);
  };

  useEffect(() => {
    if (selectedValue) {
      localStorage.setItem("selectedColor", selectedValue);
    }
  }, [selectedValue]);

  const handleFilterRating = (e) => {
    setFilterRatingValue(Number(e.target.value));
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const [age, setAge] = useState("newest");

  const handleSelect = (event) => {
    setAge(event.target.value);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#0f172a",
      },
    },
  });

  const [showReplies, setShowReplies] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const toDetailRef = useRef(null);
  const toReviewRef = useRef(null);
  const toDiscusRef = useRef(null);
  const sliderRef = useRef(null);
  const sectionRef = [toDetailRef, toReviewRef, toDiscusRef];
  const [activeTab, setActiveTabs] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderHeight, setSliderHeight] = useState("auto");
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showProductShipping, setShowProductShipping] = useState(false);

  const thumbWrapperRef = useRef(null);
  const images = [
    data?.thumbnail,
    ...(Array.isArray(imgDetail) ? imgDetail : []).filter(Boolean),
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const scrollSliderRef = (containerRef, targetEl) => {
    if (!containerRef.current || !targetEl) return;

    containerRef.current.scrollTo({
      left: targetEl.offsetLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const activeEl = sectionRef[activeTab]?.current;

    if (!activeEl) return;

    const resizeObserver = new ResizeObserver(() => {
      setSliderHeight(activeEl.scrollHeight);
    });
    resizeObserver.observe(activeEl);
    return () => resizeObserver.disconnect();
  }, [activeTab]);

  useEffect(() => {
    if (!thumbWrapperRef.current) return;

    const wrapper = thumbWrapperRef.current;
    const thumbWidth = 90 + 20;

    const targetScroll =
      activeIndex * thumbWidth - wrapper.clientWidth / 2 + thumbWidth / 2;

    wrapper.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const { countCart, setCountCart, dataCart, setDataCart } = useCart();

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
      }
    );

    toast.success(res.data.message);
  };

  const [qtyCart, setQtyCart] = useState(() => {
    const saveQty = localStorage.getItem("qtyCart");

    return saveQty ? Number(saveQty) : 1;
  });

  useEffect(() => {
    localStorage.setItem("qtyCart", qtyCart);
  }, [qtyCart]);

  return (
    <>
      <div className="p-10 bg-slate-50 flex flex-col">
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>

        <div className="flex flex-row my-10 items-start gap-5">
          <div className="flex flex-col w-[40%]">
            <div className="flex flex-nowrap justify-center items-center overflow-hidden w-full relative h-[400px] py-5 gap-2.5">
              <img
                src={images[activeIndex]}
                alt={data?.judul}
                className="w-full h-auto max-h-full object-contain shrink-0"
              />
              <Button
                variant="contained"
                className="absolute left-0 bg-slate-950"
                onClick={handlePrev}
              >
                <ArrowBackIosNewOutlinedIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="contained"
                className="absolute right-0 bg-slate-950"
                onClick={handleNext}
              >
                <ArrowForwardIosOutlinedIcon className="w-5 h-5" />
              </Button>
            </div>
            <div
              ref={thumbWrapperRef}
              className="flex flex-nowrap overflow-hidden w-full py-5 gap-5"
            >
              {Array.isArray(images) &&
                images.map((img, i) => {
                  return (
                    <img
                      src={img}
                      alt={data?.judul}
                      onClick={() => setActiveIndex(i)}
                      className={`w-[90px] ${
                        activeIndex === i
                          ? "border border-slate-950"
                          : "border-none"
                      } cursor-pointer h-auto max-h-[90px] object-contain  rounded-2xl`}
                      key={i}
                    />
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col w-[50%]">
            <h1 className="text-2xl font-bold">{data?.judul}</h1>
            <span className="mt-2.5 mb-5">
              <StarIcon className="w-5 h-5 text-amber-500" />
              <StarIcon className="w-5 h-5 text-amber-500" />
              <StarIcon className="w-5 h-5 text-amber-500" />
              <StarIcon className="w-5 h-5 text-amber-500" />
              <StarHalfIcon className="w-5 h-5 text-amber-500" />
              <span className="ml-5">( 4.9 )</span>
            </span>
            <div className="flex flex-row gap-2.5 items-center">
              <span className="text-2xl font-bold">
                Rp{" "}
                {Intl.NumberFormat("id-ID", {
                  maximumFractionDigits: 1,
                }).format(totals * qtyCart) || 0}
              </span>
              <span className="text-red-500/80 text-md font-bold line-through">
                Rp{" "}
                {Intl.NumberFormat("id-ID", {
                  maximumFractionDigits: 1,
                }).format(data?.harga) || 0}
              </span>
            </div>
            <Divider className="bg-slate-300 my-5" />
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2.5">
                <h2 className="text-md font-bold">Available Size</h2>
                <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  aria-label="Available size"
                  size="small"
                >
                  {Array.isArray(size) &&
                    size.map((s, i) => {
                      const isActive = alignment === s;
                      return (
                        <ToggleButton
                          value={s}
                          aria-label="left aligned"
                          key={i}
                          className={`
                                      border!
                                      border-gray-300!
                                      text-gray-700!
                                      ${
                                        isActive
                                          ? "bg-black! text-white! border-black!"
                                          : "hover:bg-gray-100!"
                                      }
                                    `}
                        >
                          {s}
                        </ToggleButton>
                      );
                    })}
                </ToggleButtonGroup>
              </div>
              <div className="flex flex-col gap-2.5">
                <h2 className="text-md font-bold">Available Colors</h2>
                <div>
                  {Array.isArray(colors) &&
                    colors.map((c, i) => {
                      const colorObj = colorsMap.find((cm) => cm.name === c);
                      return (
                        <Radio
                          {...controlProps(c)}
                          sx={{
                            color:
                              colorObj?.name === "white"
                                ? "oklch(66.6% 0.179 58.318)"
                                : colorObj?.code,

                            "&.Mui-checked": {
                              color:
                                colorObj?.name === "white"
                                  ? "oklch(66.6% 0.179 58.318)"
                                  : colorObj?.code,
                            },
                          }}
                          key={i}
                        />
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-10">
              <span className="text-lg font-bold">
                Stock: <span className="text-md font-medium">{data?.stok}</span>
              </span>
            </div>
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  display: "flex",
                  alignContent: "center",
                  gap: 4,
                  mt: "20px",
                }}
              >
                <div className="relative flex flex-row gap-5 ">
                  <Button
                    variant="contained"
                    className="bg-slate-950"
                    onClick={() => {
                      if (qtyCart === 1) return;
                      setQtyCart(qtyCart - 1);
                    }}
                  >
                    <RemoveOutlinedIcon className="w-5 h-5" />
                  </Button>

                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": {
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyItems: "center",
                      },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="outlined-basic"
                      value={qtyCart}
                      variant="outlined"
                      onChange={(e) => {
                        setQtyCart(e.target.value);
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    className="bg-slate-950"
                    onClick={() => {
                      setQtyCart(qtyCart + 1);
                    }}
                  >
                    <AddOutlinedIcon className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  variant="outlined"
                  className="text-slate-950"
                  onClick={() => {
                    handleAddToCart(data?.id, qtyCart);
                    setQtyCart(1);
                  }}
                >
                  Add To Cart
                </Button>
                <Button variant="contained" className="bg-slate-950">
                  Buy now
                </Button>
              </Box>
            </ThemeProvider>
          </div>
        </div>

        <div className="grid grid-cols-3">
          <Button
            variant="text"
            className={`h-14 ${
              activeTab === 0
                ? "border-b-2 border-slate-950 text-slate-950"
                : "text-slate-500 border-none"
            } gap-2.5  rounded-none`}
            onClick={() => {
              setActiveTabs(0);
              scrollSliderRef(sliderRef, toDetailRef.current);
            }}
          >
            The Detail
          </Button>
          <Button
            variant="text"
            className={`h-14 ${
              activeTab === 1
                ? "border-b-2 border-slate-950 text-slate-950"
                : "text-slate-500 border-none"
            } gap-2.5  rounded-none`}
            onClick={() => {
              setActiveTabs(1);
              scrollSliderRef(sliderRef, toReviewRef.current);
            }}
          >
            <span>Rating & Reviews</span>{" "}
            <span className="font-bold">( 8 )</span>
          </Button>
          <Button
            variant="text"
            className={`h-14 ${
              activeTab === 2
                ? "border-b-2 border-slate-950 text-slate-950"
                : "text-slate-500 border-none"
            } gap-2.5  rounded-none`}
            onClick={() => {
              setActiveTabs(2);
              scrollSliderRef(sliderRef, toDiscusRef.current);
            }}
          >
            <span>Discussion</span> <span className="font-bold">( 8 )</span>
          </Button>
        </div>

        <div
          ref={sliderRef}
          style={{ height: sliderHeight }}
          className=" items-start justify-between flex
              w-full
              overflow-x-auto
              overflow-y-hidden
              scroll-smooth
              transition-[height]
              duration-300 snap-x snap-mandatory"
        >
          <div
            ref={toDetailRef}
            className="flex flex-col w-full shrink-0 snap-center"
          >
            <h1 className="mt-10 mb-5 text-2xl font-medium">Descriptions</h1>
            <div
              className="text-lg text-slate-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data?.detail.desc),
              }}
            />

            <div className="grid grid-cols-2 mt-10">
              <div className="flex flex-col">
                <Button
                  variant="text"
                  className={`${
                    showProductDetail
                      ? "border-b border-slate-500"
                      : "border-none"
                  } text-slate-800 h-12 flex items-center justify-between mb-2 rounded-none`}
                  onClick={() => setShowProductDetail(!showProductDetail)}
                >
                  <h1>Product Details</h1>
                  <KeyboardArrowDownOutlinedIcon
                    className={`${
                      showProductDetail ? "rotate-180" : "rotate-0"
                    } w-5 h-5`}
                  />
                </Button>
                <div
                  className={`
                grid transition-[grid-template-rows] duration-300 ease-in-out
                ${showProductDetail ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
                >
                  <div className="flex overflow-hidden">
                    <div className="bg-slate-100 p-5 w-full">
                      <ul className="px-5  grid grid-cols-2">
                        <li className="list-disc font-normal">
                          Code Name:{" "}
                          <span className="font-light">
                            {data?.detail?.sku}
                          </span>
                        </li>
                        <li className="list-disc font-normal">
                          Material:{" "}
                          <span className="font-light">
                            {data?.detail?.material}
                          </span>
                        </li>
                        <li className="list-disc font-normal">
                          Weight:{" "}
                          <span className="font-light">
                            {data?.detail?.weight}
                          </span>
                        </li>
                        <li className="list-disc font-normal">
                          Fit:{" "}
                          <span className="font-light">
                            {data?.detail?.fit}
                          </span>
                        </li>
                        <li className="list-disc font-normal">
                          Gender:{" "}
                          <span className="font-light">
                            {data?.detail?.gender}
                          </span>
                        </li>
                        <li className="list-disc font-normal">
                          Feature:{" "}
                          <span className="font-light flex gap-2 flex-wrap">
                            {Array.isArray(feature) &&
                              feature.map((f, i) => {
                                return <span key={i}>{f},</span>;
                              })}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <Button
                  variant="text"
                  className={`${
                    showProductShipping
                      ? "border-b border-slate-500"
                      : "border-none"
                  } text-slate-800 h-12 flex items-center justify-between mb-2 rounded-none`}
                  onClick={() => setShowProductShipping(!showProductShipping)}
                >
                  <h1>Shipping Details</h1>
                  <KeyboardArrowDownOutlinedIcon
                    className={`${
                      showProductShipping ? "rotate-180" : "rotate-0"
                    } w-5 h-5`}
                  />
                </Button>
                <div
                  className={`
                grid transition-[grid-template-rows] duration-300 ease-in-out
                ${showProductShipping ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
                >
                  <div className="flex overflow-hidden">
                    <div className="bg-slate-100 w-full p-5">
                      <ul className="px-5  grid grid-cols-2">
                        <li className="list-disc font-normal">
                          Dikirim dari:{" "}
                          <span className="font-light">Jakarta</span>
                        </li>
                        <li className="list-disc font-normal">
                          Estimasi:{" "}
                          <span className="font-light">3 - 4 Hari</span>
                        </li>

                        <li className="list-disc font-normal">
                          Retur:{" "}
                          <span className="font-light">7 Hari Retur</span>
                        </li>
                        <li className="list-disc font-normal">
                          Garansi: <span className="font-light">1 bulan</span>
                        </li>
                        <li className="list-disc font-normal">
                          Pembayaran:{" "}
                          <span className="font-light flex flex-wrap gap-[3px]">
                            <span>Transfer Bank,</span>
                            <span>E-wallet,</span>
                            <span>Virtual Account,</span>
                            <span>Kartu Kredit / Debit Card,</span>
                            <span>Paylater,</span>
                            <span>COD</span>
                          </span>
                        </li>
                        <li className="list-disc font-normal">
                          Pengiriman Via:{" "}
                          <span className="font-light flex flex-wrap gap-[3px]">
                            <span>JNE,</span>
                            <span>J&T,</span>
                            <span>Sicepat,</span>
                            <span>AnterAja,</span>
                            <span>Pos Indonesia</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            ref={toReviewRef}
            className="flex flex-col w-full shrink-0 snap-center"
          >
            <h1 className="my-10 text-2xl font-medium">Rating & Review</h1>

            <div className="flex flex-col mb-10">
              <div className="flex flex-col">
                <div className="flex items-center flex-row">
                  <StarIcon className="w-10 h-10 text-slate-950" />
                  <StarIcon className="w-10 h-10 text-slate-950" />
                  <StarIcon className="w-10 h-10 text-slate-950" />
                  <StarIcon className="w-10 h-10 text-slate-950" />
                  <StarHalfIcon className="w-10 h-10 text-slate-950" />
                </div>
                <div className="flex flex-row items-center mt-5 gap-2">
                  <span className="text-slate-700 text-lg">4.9</span>
                  <span className="w-[5px] h-[5px] rounded-full bg-slate-700"></span>
                  <span className="list-disc text-slate-700 text-lg">
                    500 Reviews
                  </span>
                </div>

                <div className="flex flex-col w-[500px] my-5">
                  <div className="flex items-center gap-2.5 flex-row">
                    <ThemeProvider theme={theme}>
                      <Radio
                        checked={filterRatingValue === 5}
                        onChange={handleFilterRating}
                        value={5}
                        name="radio-buttons"
                        inputProps={{ "aria-label": 5 }}
                      />
                    </ThemeProvider>

                    <div className="flex items-center flex-row">
                      <span className="text-lg font-medium">5</span>
                      <StarIcon className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full"></div>
                    <span>500</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-row">
                    <ThemeProvider theme={theme}>
                      <Radio
                        checked={filterRatingValue === 4}
                        onChange={handleFilterRating}
                        value={4}
                        name="radio-buttons"
                        inputProps={{ "aria-label": 4 }}
                      />
                    </ThemeProvider>

                    <div className="flex items-center flex-row">
                      <span className="text-lg font-medium">4</span>
                      <StarIcon className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="w-[200px] h-2.5 bg-slate-950 rounded-full"></div>
                    <span>200</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-row">
                    <ThemeProvider theme={theme}>
                      <Radio
                        checked={filterRatingValue === 3}
                        onChange={handleFilterRating}
                        value={3}
                        name="radio-buttons"
                        inputProps={{ "aria-label": 3 }}
                      />
                    </ThemeProvider>

                    <div className="flex items-center flex-row">
                      <span className="text-lg font-medium">3</span>
                      <StarIcon className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="w-[150px] h-2.5 bg-slate-950 rounded-full"></div>
                    <span>100</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-row">
                    <ThemeProvider theme={theme}>
                      <Radio
                        checked={filterRatingValue === 2}
                        onChange={handleFilterRating}
                        value={2}
                        name="radio-buttons"
                        inputProps={{ "aria-label": 2 }}
                      />
                    </ThemeProvider>

                    <div className="flex items-center flex-row">
                      <span className="text-lg font-medium">2</span>
                      <StarIcon className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="w-[300px] h-2.5 bg-slate-950 rounded-full"></div>
                    <span>300</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-row">
                    <ThemeProvider theme={theme}>
                      <Radio
                        checked={filterRatingValue === 1}
                        onChange={handleFilterRating}
                        value={1}
                        name="radio-buttons"
                        inputProps={{ "aria-label": 1 }}
                      />
                    </ThemeProvider>

                    <div className="flex items-center flex-row">
                      <span className="text-lg font-medium">1</span>
                      <StarIcon className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="w-[100px] h-2.5 bg-slate-950 rounded-full"></div>
                    <span>20</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span>Sort By</span>
              <ThemeProvider theme={theme}>
                <Select value={age} onChange={handleSelect}>
                  <MenuItem value={"newest"}>Newest</MenuItem>
                  <MenuItem value={"relevant"}>Relevant</MenuItem>
                  <MenuItem value={"oldest"}>Oldest</MenuItem>
                </Select>
              </ThemeProvider>
            </div>
            <div className="flex flex-col my-5 gap-5 border border-slate-200 p-10 rounded-2xl">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <StarHalfIcon className="w-5 h-5 text-amber-500" />
                        <span className="ml-2.5">( 4.9 )</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>

              <div className="w-full flex items-center justify-center">
                <Stack spacing={2}>
                  <Pagination
                    count={5}
                    page={1}
                    // onChange={(e, value) => setPage(value)}
                    shape="rounded"
                    size="large"
                  />
                </Stack>
              </div>
            </div>
          </div>
          <div
            ref={toDiscusRef}
            className="flex flex-col w-full shrink-0 snap-center"
          >
            <h1 className="my-10 text-2xl font-medium">Discussion</h1>
            <div className="flex items-center gap-2.5">
              <span>Sort By</span>
              <ThemeProvider theme={theme}>
                <Select value={age} onChange={handleSelect}>
                  <MenuItem value={"newest"}>Newest</MenuItem>
                  <MenuItem value={"relevant"}>Relevant</MenuItem>
                  <MenuItem value={"oldest"}>Oldest</MenuItem>
                </Select>
              </ThemeProvider>
            </div>
            <div className="flex flex-col my-5 gap-5 border border-slate-200 p-10 rounded-2xl">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <img
                    src={data?.thumbnail}
                    alt="profile"
                    className="w-[100px] h-[100px] rounded-full z-10"
                  />
                  <div className="flex flex-col relative">
                    <div className="flex flex-col z-10">
                      <h1 className="text-lg font-bold">Abdul hawari</h1>
                      <p className="mb-5 text-md text-slate-800">
                        The fit is perpect, and the quality is top-notch
                      </p>
                      <div className="flex flex-row items-center gap-2.5">
                        <Button
                          variant="text"
                          className="text-slate-600 text-sm gap-2"
                        >
                          <FavoriteBorderOutlinedIcon className="w-5 h-5" />
                          <span>Like</span>
                        </Button>
                        <Button
                          variant={showReply ? "contained" : "text"}
                          className={`${
                            showReply
                              ? "bg-slate-950 text-slate-50"
                              : "text-slate-600"
                          } text-sm gap-2`}
                          onClick={() => setShowReply(!showReply)}
                        >
                          <ReplyOutlinedIcon className="w-5 h-5" />
                          <span>Reply</span>
                        </Button>
                        <span className="text-slate-600 text-sm">100 Like</span>
                        <span className="text-slate-600 text-sm">5 Reply</span>
                      </div>

                      <div
                        className={`
                        grid transition-[grid-template-rows] duration-300 ease-in-out
                        ${showReply ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                      `}
                      >
                        <div
                          className={`flex overflow-hidden flex-col gap-5 mt-5`}
                        >
                          <textarea
                            className="w-full border outline-0 border-slate-200 h-[150px] p-5 text-slate-900 text-lg font-medium"
                            placeholder="Enter Your Reply"
                          ></textarea>
                          <Button
                            type="submit"
                            variant="contained"
                            className="bg-slate-950 font-medium w-[150px] h-12"
                          >
                            Send Reply
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant={showReplies ? "contained" : "text"}
                        className={`${
                          showReplies
                            ? "text-slate-50 bg-slate-950"
                            : "text-slate-950"
                        } w-[150px] h-11 my-5`}
                        onClick={() => setShowReplies(!showReplies)}
                      >
                        {showReplies ? "Hide Replies" : "Show Replies"}
                      </Button>
                    </div>

                    <div
                      className={`
                        grid transition-[grid-template-rows] duration-300 ease-in-out
                        ${showReplies ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                      `}
                    >
                      <div
                        className={`overflow-hidden ${
                          showReplies
                            ? "before:content-[''] before:absolute before:left-[-70px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200"
                            : ""
                        }`}
                      >
                        <div className={` gap-5 z-0 relative`}>
                          <div className="flex flex-row gap-5 items-start">
                            <img
                              src={data?.thumbnail}
                              className="w-[70px] h-[70px] rounded-full"
                            />
                            <div className="flex flex-col">
                              <h2 className="text-md font-medium">Kingmrx</h2>
                              <p className="mb-5 text-md text-slate-800">
                                The fit is perpect, and the quality is top-notch
                              </p>
                              <div className="flex flex-row items-center gap-2.5">
                                <Button
                                  variant="text"
                                  className="text-slate-600 text-sm gap-2"
                                >
                                  <FavoriteBorderOutlinedIcon className="w-4 h-4" />
                                  <span>Like</span>
                                </Button>
                                <Button
                                  variant="text"
                                  className="text-slate-600 text-sm gap-2"
                                >
                                  <ReplyOutlinedIcon className="w-4 h-4" />
                                  <span>Reply</span>
                                </Button>
                                <span className="text-slate-600 text-sm">
                                  100 Like
                                </span>
                                <span className="text-slate-600 text-sm">
                                  5 Reply
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row gap-5 items-start">
                            <img
                              src={data?.thumbnail}
                              className="w-[70px] h-[70px] rounded-full"
                            />
                            <div className="flex flex-col">
                              <h2 className="text-md font-medium">Kingmrx</h2>
                              <p className="mb-5 text-md text-slate-800">
                                The fit is perpect, and the quality is top-notch
                              </p>
                              <div className="flex flex-row items-center gap-2.5">
                                <Button
                                  variant="text"
                                  className="text-slate-600 text-sm gap-2"
                                >
                                  <FavoriteBorderOutlinedIcon className="w-4 h-4" />
                                  <span>Like</span>
                                </Button>
                                <Button
                                  variant="text"
                                  className="text-slate-600 text-sm gap-2"
                                >
                                  <ReplyOutlinedIcon className="w-4 h-4" />
                                  <span>Reply</span>
                                </Button>
                                <span className="text-slate-600 text-sm">
                                  100 Like
                                </span>
                                <span className="text-slate-600 text-sm">
                                  5 Reply
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-lg text-slate-600">2 weeks ago</span>
              </div>
              <div className="w-full flex items-center justify-center">
                <Stack spacing={2}>
                  <Pagination
                    count={5}
                    page={1}
                    // onChange={(e, value) => setPage(value)}
                    shape="rounded"
                    size="large"
                  />
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
