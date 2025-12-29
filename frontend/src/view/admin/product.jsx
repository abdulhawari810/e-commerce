import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import emptyWhislist from "../../assets/empty_whislist.webp";
import { useDebounce } from "../../js/useDebounce";
import TextInput from "../../component/TextInput";
import MemoMultiSelect from "../../component/MaterialUISelect";

function stripHTML(html) {
  if (!html) return "";

  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function Products() {
  const scrollMouse = useRef(null);
  const { user, logout } = useAuth();
  const baseAPI = import.meta.env.VITE_BASE_API;
  const [product, setProduct] = useState([]);
  const [ProductDetail, setProductDetail] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const limit = 10;
  const debounceSearch = useDebounce(search, 1000);

  const [showAddproduct, setShowAddProduct] = useState(false);
  const [showDetailProduct, setShowDetailProduct] = useState(false);

  const [colors, setColors] = useState([]);
  const [size, setSize] = useState([]);

  const [colorsName, setColorsName] = useState([]);
  const [sizeName, setSizeName] = useState([]);
  const [features, setFeatures] = useState([""]);
  const [imageDetail, setImageDetail] = useState([""]);

  const inputForm = {
    judul: "",
    tipe: "",
    thumbnail: "",
    material: "",
    model: "",
    weight: "",
    gender: "",
    sku: "",
    fit: "",
    description: "",
    diskon: 0,
    harga: 0,
    stok: 0,
  };

  const [form, setForm] = useState(inputForm);
  const [formKey, setFormKey] = useState(0);

  const handleChangeColors = (event) => {
    const {
      target: { value },
    } = event;
    setColorsName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeSize = (event) => {
    const {
      target: { value },
    } = event;
    setSizeName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleChangeInputForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageDetailChange = (index, value) => {
    const updated = [...imageDetail];
    updated[index] = value;
    setImageDetail(updated);
  };

  const addImageDetail = () => {
    setImageDetail([...imageDetail, ""]);
  };

  const removeImageDetail = (index) => {
    setImageDetail(imageDetail.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axios.get(`${baseAPI}colors`);
        setColors(res.data.colors);
      } catch (error) {
        console.log(error);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const res = await axios.get(`${baseAPI}size`);
        setSize(res.data.size);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSize();
  }, []);

  const fetch = async (url) => {
    const res = await axios.get(url);
    setProduct(res.data.product);
    setTotalPage(res.data.pagination.totalPage);
    return res.data;
  };

  const { data, isLoading, error, mutate } = useSWR(
    `${baseAPI}product?page=${page}&limit=${limit}`,
    fetch,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    const element = scrollMouse.current;

    if (!element) return;

    const onWheel = (e) => {
      e.stopPropagation();
      const el = scrollMouse.current;
      const max = el.scrollWidth - el.clientWidth;

      if (
        (e.deltaY > 0 && el.scrollLeft < max) ||
        (e.deltaY < 0 && el.scrollLeft > 0)
      ) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    element.addEventListener("wheel", onWheel, { passive: false });

    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  const fetchProductSearch = async (search) => {
    try {
      const res = await axios.get(
        `${baseAPI}product/search?search=${search}&page=${
          page || 1
        }&limit=${limit}`,
        {
          withCredentials: true,
        }
      );
      setProduct(res.data.product);
      setTotalPage(res.data.pagination.totalPage);
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan pada server");
      }
    }
  };

  useEffect(() => {
    if (!debounceSearch.trim()) {
      setPage(1);
      mutate(`${baseAPI}product?page=1&limit=${limit}`);
      return;
    }

    fetchProductSearch(debounceSearch);
  }, [debounceSearch, page]);

  useEffect(() => {
    if (!search.trim()) {
      setPage(1);
    }
  }, [search]);

  const handleDeleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${baseAPI}product/${id}`, {
        withCredentials: true,
      });
      mutate(`${baseAPI}product?page=${page}&limit=${limit}`);
      toast.success(res.data.message);
    } catch (error) {
      if (error.response.data.code !== 500) {
        toast.error(error.response.data.error);
      }
      Console.log(error);
    }
  };

  const handleAddProducts = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${baseAPI}product`,
        {
          judul: form.judul,
          harga: form.harga,
          thumbnail: form.thumbnail,
          stok: form.stok,
          diskon: form.diskon,
          desc: form.description,
          image_detail: imageDetail,
          size: sizeName,
          colors: colorsName,
          model: form.model,
          fit: form.fit,
          feature: features,
          material: form.material,
          tipe: form.tipe,
          sku: form.sku,
          weight: form.weight,
          gender: form.gender,
        },
        { withCredentials: true }
      );

      mutate(`${baseAPI}product?page=${page}&limit=${limit}`);

      toast.success(res.data.message);

      setShowAddProduct(false);

      setFormKey((prev) => prev + 1);
      setForm(inputForm);
    } catch (error) {
      if (error?.response?.data?.code) {
        return toast.error(error?.response?.data?.message);
      }
      toast.error(error.response.data.error);
      setShowAddProduct(false);
      setFormKey((prev) => prev + 1);
      setForm(inputForm);
      console.log(error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `${baseAPI}product/${ProductDetail?.id || null}`,
        {
          judul: form.judul,
          harga: form.harga,
          thumbnail: form.thumbnail,
          stok: form.stok,
          diskon: form.diskon,
          desc: form.description,
          image_detail: imageDetail,
          size: sizeName,
          colors: colorsName,
          model: form.model,
          fit: form.fit,
          feature: features,
          material: form.material,
          tipe: form.tipe,
          sku: form.sku,
          weight: form.weight,
          gender: form.gender,
        },
        { withCredentials: true }
      );

      mutate(`${baseAPI}product?page=${page}&limit=${limit}`);

      toast.success(res.data.message);

      setShowDetailProduct(false);

      setFormKey((prev) => prev + 1);
      setForm(inputForm);
      setColorsName([]);
      setSizeName([]);
      setFeatures([""]);
      setImageDetail([""]);
    } catch (error) {
      if (error?.response?.data?.code) {
        return toast.error(error?.response?.data?.message);
      }
      toast.error(error.response.data.error);
      setShowAddProduct(false);
      setFormKey((prev) => prev + 1);
      setForm(inputForm);
      setColorsName([]);
      setSizeName([]);
      setFeatures([""]);
      setImageDetail([""]);
      console.log(error);
    }
  };

  const handleExportProductCSV = async () => {
    const res = await axios.get(`${baseAPI}product/export/file`, {
      responseType: "blob",
      withCredentials: true,
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    if (ProductDetail) {
      setForm({
        judul: ProductDetail?.judul ?? "",
        tipe: ProductDetail?.tipe ?? "",
        thumbnail: ProductDetail?.thumbnail ?? "",
        material: ProductDetail?.detail?.material ?? "",
        model: ProductDetail?.detail?.model ?? "",
        weight: ProductDetail?.detail?.weight ?? "",
        gender: ProductDetail?.detail?.gender ?? "",
        sku: ProductDetail?.detail?.sku ?? "",
        fit: ProductDetail?.detail?.fit ?? "",
        description: stripHTML(ProductDetail?.detail?.desc),
        diskon: ProductDetail?.diskon ?? 0,
        harga: ProductDetail?.harga ?? 0,
        stok: ProductDetail?.stok ?? 0,
      });

      setColorsName(ProductDetail?.detail?.colors ?? []);
      setSizeName(ProductDetail?.detail?.size ?? []);
      setFeatures(ProductDetail?.detail?.feature ?? [""]);
      setImageDetail(ProductDetail?.detail?.image_detail ?? [""]);
    }
  }, [ProductDetail]);

  const getDetailProduct = async (id) => {
    setShowDetailProduct(true);

    const res = await axios.get(`${baseAPI}product/${id}`);

    return setProductDetail(res.data.product);
  };

  return (
    <>
      <div className="pl-[22%] pr-5">
        <div className="flex flex-col p-5 rounded-2xl bg-slate-100 h-[80vh]">
          <div className="flex flex-col w-full h-full overflow-y-auto overscroll-contain">
            <div className="w-full flex items-center justify-between mb-10">
              <h1 className="text-slate-900 font-bold text-2xl">
                Management Product
              </h1>
              <div className="flex items-center gap-5">
                <Button
                  variant="contained"
                  className="bg-slate-950"
                  onClick={() => setShowAddProduct(!showAddproduct)}
                >
                  Add Product
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl shadow-lg">
              <div className="w-full flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <form className="flex items-center justify-center relative">
                    <div className="flex items-center justify-center relative w-[250px] h-10 rounded-xl">
                      <input
                        type="search"
                        id="search"
                        name="search"
                        onChange={(e) => setSearch(e.target.value)}
                        autoComplete="off"
                        placeholder="Search name, price, stock, dll..."
                        className="w-full h-full text-sm px-5  rounded-xl outline outline-slate-400 focus:outline-slate-900 not-placeholder-shown:outline-slate-900 font-medium"
                      />
                    </div>
                  </form>

                  <Button
                    variant="text"
                    className="text-slate-900 w-10 h-10 rounded-lg"
                    sx={{
                      width: "unset",
                      height: "unset",
                      minWidth: "unset",
                      minHeight: "unset",
                      padding: "unset",
                    }}
                  >
                    <FilterListOutlinedIcon />
                  </Button>
                </div>
                <div className="flex items-center gap-5">
                  <Button
                    variant="outlined"
                    className="text-slate-950 border-slate-900"
                  >
                    Import data
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-slate-950"
                    onClick={handleExportProductCSV}
                  >
                    export data
                  </Button>
                </div>
              </div>
              {/* wrapper */}
              <div
                ref={scrollMouse}
                className="overflow-x-auto relative rounded-xl w-full overflow-y-hidden"
              >
                <div className="border w-full border-slate-200">
                  {/* header */}
                  <div className="grid grid-cols-10 bg-slate-100 sticky top-0 z-10 divide-x divide-slate-200">
                    {[
                      "Thumbnail",
                      "Name",
                      "Price",
                      "Stock",
                      "Type",
                      "Discount",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((item) => (
                      <h4
                        key={item}
                        className="p-3 text-xs font-semibold uppercase text-slate-700"
                      >
                        {item}
                      </h4>
                    ))}
                  </div>

                  {product?.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-10">
                      <img
                        src={emptyWhislist}
                        alt="Empty Whislist"
                        className="w-[250px] h-[250px] object-cover"
                      />
                      <h1 className="text-2xl font-bold mt-5">Produk Kosong</h1>
                      <span className="text-lg font-medium text-slate-700">
                        Tambahkan produk terlebih dahulu
                      </span>
                    </div>
                  )}

                  {/* body / rows */}
                  {Array.isArray(product) &&
                    product.map((p, i) => {
                      const formatDate = (date) => {
                        const d = new Date(date);
                        return `${d.getDate()}-${
                          d.getMonth() + 1
                        }-${d.getFullYear()}`;
                      };
                      return (
                        <div
                          className="divide-y divide-slate-200 bg-white"
                          key={i}
                        >
                          <div className="grid grid-cols-10 items-center divide-x divide-slate-200 hover:bg-slate-50 transition">
                            <div className="p-3 flex justify-center">
                              <img
                                src={p.thumbnail}
                                alt="product"
                                className="w-16 h-auto max-h-16 rounded-xl object-contain bg-slate-200"
                              />
                            </div>

                            <span className="p-3 text-sm truncate text-slate-900">
                              {p.judul}
                            </span>

                            <span className="p-3 text-sm font-semibold text-slate-900">
                              Rp{" "}
                              {Intl.NumberFormat("id-ID", {
                                maximumFractionDigits: 1,
                              }).format(p.harga) || 0}
                            </span>

                            <span className="p-3 text-sm text-slate-900">
                              {p.stok}
                            </span>

                            <span className="p-3 text-sm text-slate-900">
                              {p.tipe}
                            </span>

                            <span className="p-3 text-sm text-emerald-600 font-semibold">
                              {p.diskon}%
                            </span>

                            <div className="p-3 flex items-center justify-start w-full pl-5">
                              {p.status === "active" ? (
                                <span className=" text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 w-fit">
                                  active
                                </span>
                              ) : p.status === "draft" ? (
                                <span className=" text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 w-fit">
                                  draft
                                </span>
                              ) : (
                                <span className=" text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 w-fit">
                                  not active
                                </span>
                              )}
                            </div>

                            <span className="p-3 text-sm text-slate-500">
                              {formatDate(p.createdAt)}
                            </span>

                            <div className="p-3 flex flex-row gap-2">
                              <Button
                                variant="contained"
                                className="bg-slate-900 p-5 h-10 rounded-lg w-full flex gap-2"
                                sx={{
                                  textTransform: "unset",
                                  fontSize: "14px",
                                  minWidth: "unset",
                                  width: "unset",
                                  padding: 0,
                                }}
                                onClick={() => getDetailProduct(p.id)}
                              >
                                <ArrowOutwardOutlinedIcon className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="contained"
                                className="bg-red-500 p-5 h-10 rounded-lg w-full flex gap-2"
                                onClick={() => handleDeleteProduct(p.id)}
                                sx={{
                                  textTransform: "unset",
                                  fontSize: "14px",
                                  minWidth: "unset",
                                  width: "unset",
                                  padding: 0,
                                }}
                              >
                                <DeleteOutlineOutlinedIcon className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* pagination */}
              <div className="flex items-center justify-center w-full my-5">
                {product?.length > 0 && (
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
        </div>
      </div>

      {showAddproduct && (
        <div
          className="w-full px-20 h-screen p-5 z-45 cursor-pointer bg-slate-950/20 flex items-center justify-center fixed top-0 left-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddProduct(false);
            }
          }}
        >
          <div
            className="w-[80%] z-50 relative h-full cursor-auto flex flex-col bg-slate-50 rounded-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl text-slate-900 font-bold p-5 pb-0">
              Add Product
            </h1>
            <form
              className="w-full h-full pt-5 grid grid-cols-1 gap-5"
              onSubmit={handleAddProducts}
              key={formKey}
            >
              <div className="flex w-full h-[350px] p-5 items-center justify-between flex-wrap gap-5 overflow-y-auto overflow-x-hidden">
                <TextInput
                  name="judul"
                  label="Product Name"
                  value={form.judul}
                  onChange={handleChangeInputForm}
                />

                <TextInput
                  name="harga"
                  type="number"
                  label="Product Price"
                  value={form.harga}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="thumbnail"
                  type="text"
                  label="Product Thumbnail"
                  value={form.thumbnail}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="stok"
                  type="number"
                  label="Product Stock"
                  value={form.stok}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="diskon"
                  type="number"
                  label="Product Discount"
                  value={form.diskon}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="tipe"
                  label="Product Type"
                  value={form.tipe}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="material"
                  label="Product Material"
                  value={form.material}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="fit"
                  label="Product Fit"
                  value={form.fit}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="gender"
                  label="Product For Gender"
                  value={form.gender}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="weight"
                  label="Product Weight"
                  value={form.weight}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="model"
                  label="Product Model"
                  value={form.model}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="sku"
                  label="Product SKU"
                  value={form.sku}
                  onChange={handleChangeInputForm}
                />

                <div className="flex items-center w-[270px] h-12">
                  <MemoMultiSelect
                    label="Colors"
                    value={colorsName}
                    options={colors}
                    onChange={handleChangeColors}
                  />
                </div>

                <div className="flex items-center w-[270px] h-12">
                  <MemoMultiSelect
                    label="Size"
                    value={sizeName}
                    options={size}
                    onChange={handleChangeSize}
                  />
                </div>

                <div className="w-full flex flex-col gap-4">
                  <h2 className="font-semibold text-slate-900">
                    Product Features
                  </h2>

                  <div className="flex flex-wrap gap-2.5">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-start gap-3"
                      >
                        {/* INPUT */}
                        <div className="flex items-center w-[200px] h-12 relative rounded-lg">
                          <input
                            type="text"
                            placeholder=" "
                            value={feature}
                            id={`feature${index}`}
                            onChange={(e) =>
                              handleFeatureChange(index, e.target.value)
                            }
                            className="w-full peer h-full px-5 text-slate-900 font-medium text-md outline outline-slate-500 rounded-lg focus:outline-slate-950 not-placeholder-shown:outline-slate-950"
                          />
                          <label
                            className="absolute left-5 text-slate-500
          peer-focus:text-xs peer-focus:translate-y-[-25px]
          peer-focus:bg-slate-50 peer-focus:left-2.5
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:translate-y-[-25px]
          peer-not-placeholder-shown:bg-slate-50
          peer-not-placeholder-shown:left-2.5 px-2"
                            htmlFor={`feature${index}`}
                          >
                            Feature {index + 1}
                          </label>
                        </div>

                        {/* REMOVE BUTTON */}
                        {features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="h-12 px-4 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ADD BUTTON */}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="w-fit px-5 h-12 rounded-lg cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <h2 className="font-semibold text-slate-900">
                    Product Image Details
                  </h2>

                  <div className="flex flex-wrap gap-2.5">
                    {imageDetail.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-start gap-3"
                      >
                        {/* INPUT */}
                        <div className="flex items-center w-[200px] h-12 relative rounded-lg">
                          <input
                            type="text"
                            placeholder=" "
                            value={feature}
                            id={`imageDetails${index}`}
                            onChange={(e) =>
                              handleImageDetailChange(index, e.target.value)
                            }
                            className="w-full peer h-full px-5 text-slate-900 font-medium text-md outline outline-slate-500 rounded-lg focus:outline-slate-950 not-placeholder-shown:outline-slate-950"
                          />
                          <label
                            className="absolute left-5 text-slate-500
          peer-focus:text-xs peer-focus:translate-y-[-25px]
          peer-focus:bg-slate-50 peer-focus:left-2.5
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:translate-y-[-25px]
          peer-not-placeholder-shown:bg-slate-50
          peer-not-placeholder-shown:left-2.5 px-2"
                            htmlFor={`imageDetails${index}`}
                          >
                            Feature {index + 1}
                          </label>
                        </div>

                        {/* REMOVE BUTTON */}
                        {imageDetail.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageDetail(index)}
                            className="h-12 px-4 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ADD BUTTON */}
                  <button
                    type="button"
                    onClick={addImageDetail}
                    className="w-fit px-5 h-12 rounded-lg cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="w-full">
                  <div className="flex items-start w-full h-[140px] justify-center relative rounded-lg">
                    <textarea
                      name="description"
                      id="description"
                      placeholder=" "
                      value={form.description}
                      onChange={handleChangeInputForm}
                      className="w-full peer h-full px-5 py-4 resize-none
      text-slate-900 font-medium text-md
      outline outline-slate-500 rounded-lg
      focus:outline-slate-950
      not-placeholder-shown:outline-slate-950"
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-5 top-4 text-slate-500
      peer-focus:text-xs peer-focus:translate-y-[-18px]
      peer-focus:bg-slate-50 peer-focus:left-2.5
      peer-not-placeholder-shown:text-xs
      peer-not-placeholder-shown:translate-y-[-18px]
      peer-not-placeholder-shown:bg-slate-50
      peer-not-placeholder-shown:left-2.5 px-2"
                    >
                      Product Description
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-slate-950 w-[300px] h-16 rounded-2xl"
                >
                  Add Products
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailProduct && (
        <div
          className="w-full px-20 h-screen p-5 z-45 cursor-pointer bg-slate-950/20 flex items-center justify-center fixed top-0 left-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailProduct(false);

              setForm(inputForm);
              setColorsName([]);
              setSizeName([]);
              setFeatures([""]);
              setImageDetail([""]);
            }
          }}
        >
          <div
            className="w-[80%] z-50 relative h-full cursor-auto flex flex-col bg-slate-50 rounded-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl text-slate-900 truncate font-bold p-5 pr-10 pb-0">
              Edit Product {ProductDetail.judul}
            </h1>
            <form
              className="w-full h-full pt-5 grid grid-cols-1 gap-5"
              onSubmit={handleEditProduct}
              key={formKey}
            >
              <div className="flex w-full h-[350px] p-5 items-center justify-between flex-wrap gap-5 overflow-y-auto overflow-x-hidden">
                <TextInput
                  name="judul"
                  label="Product Name"
                  value={form.judul}
                  onChange={handleChangeInputForm}
                />

                <TextInput
                  name="harga"
                  type="number"
                  label="Product Price"
                  value={form.harga}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="thumbnail"
                  type="text"
                  label="Product Thumbnail"
                  value={form.thumbnail}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="stok"
                  type="number"
                  label="Product Stock"
                  value={form.stok}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="diskon"
                  type="number"
                  label="Product Discount"
                  value={form.diskon}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="tipe"
                  label="Product Type"
                  value={form.tipe}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="material"
                  label="Product Material"
                  value={form.material}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="fit"
                  label="Product Fit"
                  value={form.fit}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="gender"
                  label="Product For Gender"
                  value={form.gender}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="weight"
                  label="Product Weight"
                  value={form.weight}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="model"
                  label="Product Model"
                  value={form.model}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="sku"
                  label="Product SKU"
                  value={form.sku}
                  onChange={handleChangeInputForm}
                />

                <div className="flex items-center w-[270px] h-12">
                  <MemoMultiSelect
                    label="Colors"
                    value={colorsName}
                    options={colors}
                    onChange={handleChangeColors}
                  />
                </div>

                <div className="flex items-center w-[270px] h-12">
                  <MemoMultiSelect
                    label="Size"
                    value={sizeName}
                    options={size}
                    onChange={handleChangeSize}
                  />
                </div>

                <div className="w-full flex flex-col gap-4">
                  <h2 className="font-semibold text-slate-900">
                    Product Features
                  </h2>

                  <div className="flex flex-wrap gap-2.5">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-start gap-3"
                      >
                        {/* INPUT */}
                        <div className="flex items-center w-[200px] h-12 relative rounded-lg">
                          <input
                            type="text"
                            placeholder=" "
                            value={feature}
                            id={`feature${index}`}
                            onChange={(e) =>
                              handleFeatureChange(index, e.target.value)
                            }
                            className="w-full peer h-full px-5 text-slate-900 font-medium text-md outline outline-slate-500 rounded-lg focus:outline-slate-950 not-placeholder-shown:outline-slate-950"
                          />
                          <label
                            className="absolute left-5 text-slate-500
          peer-focus:text-xs peer-focus:translate-y-[-25px]
          peer-focus:bg-slate-50 peer-focus:left-2.5
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:translate-y-[-25px]
          peer-not-placeholder-shown:bg-slate-50
          peer-not-placeholder-shown:left-2.5 px-2"
                            htmlFor={`feature${index}`}
                          >
                            Feature {index + 1}
                          </label>
                        </div>

                        {/* REMOVE BUTTON */}
                        {features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="h-12 px-4 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ADD BUTTON */}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="w-fit px-5 h-12 rounded-lg cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <h2 className="font-semibold text-slate-900">
                    Product Image Details
                  </h2>

                  <div className="flex flex-wrap gap-2.5">
                    {imageDetail.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-start gap-3"
                      >
                        {/* INPUT */}
                        <div className="flex items-center w-[200px] h-12 relative rounded-lg">
                          <input
                            type="text"
                            placeholder=" "
                            value={feature}
                            id={`imageDetails${index}`}
                            onChange={(e) =>
                              handleImageDetailChange(index, e.target.value)
                            }
                            className="w-full peer h-full px-5 text-slate-900 font-medium text-md outline outline-slate-500 rounded-lg focus:outline-slate-950 not-placeholder-shown:outline-slate-950"
                          />
                          <label
                            className="absolute left-5 text-slate-500
          peer-focus:text-xs peer-focus:translate-y-[-25px]
          peer-focus:bg-slate-50 peer-focus:left-2.5
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:translate-y-[-25px]
          peer-not-placeholder-shown:bg-slate-50
          peer-not-placeholder-shown:left-2.5 px-2"
                            htmlFor={`imageDetails${index}`}
                          >
                            Feature {index + 1}
                          </label>
                        </div>

                        {/* REMOVE BUTTON */}
                        {imageDetail.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageDetail(index)}
                            className="h-12 px-4 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ADD BUTTON */}
                  <button
                    type="button"
                    onClick={addImageDetail}
                    className="w-fit px-5 h-12 rounded-lg cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="w-full">
                  <div className="flex items-start w-full h-[140px] justify-center relative rounded-lg">
                    <textarea
                      name="description"
                      id="description"
                      placeholder=" "
                      value={form.description}
                      onChange={handleChangeInputForm}
                      className="w-full peer h-full px-5 py-4 resize-none
      text-slate-900 font-medium text-md
      outline outline-slate-500 rounded-lg
      focus:outline-slate-950
      not-placeholder-shown:outline-slate-950"
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-5 top-4 text-slate-500
      peer-focus:text-xs peer-focus:translate-y-[-23px]
      peer-focus:bg-slate-50 peer-focus:left-2.5
      peer-not-placeholder-shown:text-xs
      peer-not-placeholder-shown:translate-y-[-23px]
      peer-not-placeholder-shown:bg-slate-50
      peer-not-placeholder-shown:left-2.5 px-2"
                    >
                      Product Description
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-slate-950 w-[300px] h-16 rounded-2xl"
                >
                  Edit Products
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
