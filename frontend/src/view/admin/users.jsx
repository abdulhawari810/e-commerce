import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import MenuItem from "@mui/material/MenuItem";

import Male from "../../assets/default_male.svg";
import Female from "../../assets/default_female.svg";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import emptyWhislist from "../../assets/empty_whislist.webp";
import { useDebounce } from "../../js/useDebounce";
import TextInput from "../../component/TextInput";
import MemoSelect from "../../component/MaterialUISelect";

function stripHTML(html) {
  if (!html) return "";

  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function Users() {
  const scrollMouse = useRef(null);
  const { user, logout } = useAuth();
  const baseAPI = import.meta.env.VITE_BASE_API;
  const [users, setUsers] = useState([]);
  const [UsersDetail, setUsersDetail] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const limit = 10;
  const debounceSearch = useDebounce(search, 1000);

  const [showAddUsers, setShowAddUsers] = useState(false);
  const [showDetailUsers, setShowDetailUsers] = useState(false);

  const [roles, setRoles] = useState("users");
  const [verified, setVerified] = useState(false);
  const [actived, setActived] = useState(false);
  const [gender, setGender] = useState("male");

  const inputForm = {
    username: "",
    email: "",
    password: "",
    address: "",
    city: "",
    phone: "",
    profile: "",
  };

  const [form, setForm] = useState(inputForm);
  const [formKey, setFormKey] = useState(0);

  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(value);
  };

  const handleChangeVerified = (event) => {
    const {
      target: { value },
    } = event;
    setVerified(value);
  };

  const handleChangeActived = (event) => {
    const {
      target: { value },
    } = event;
    setActived(value);
  };

  const handleChangeGender = (event) => {
    const {
      target: { value },
    } = event;
    setGender(value);
  };

  const handleChangeInputForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetch = async (url) => {
    const res = await axios.get(url, {
      withCredentials: true,
    });
    setUsers(res.data.users);
    setTotalPage(res.data.pagination.totalPage);
    return res.data;
  };

  const { data, isLoading, error, mutate } = useSWR(
    `${baseAPI}users?page=${page}&limit=${limit}`,
    fetch,
    {
      keepPreviousData: true,
      withCredentials: true,
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
      setUsers(res.data.product);
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
      mutate(`${baseAPI}users?page=1&limit=${limit}`);
      return;
    }

    fetchProductSearch(debounceSearch);
  }, [debounceSearch, page]);

  useEffect(() => {
    if (!search.trim()) {
      setPage(1);
    }
  }, [search]);

  const handleDeleteUsers = async (id) => {
    try {
      const res = await axios.delete(`${baseAPI}users/${id}`, {
        withCredentials: true,
      });
      mutate(`${baseAPI}users?page=${page}&limit=${limit}`);
      toast.success(res.data.message);
    } catch (error) {
      if (error?.response?.data?.code <= 500) {
        return toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  const handleAddUsers = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${baseAPI}users`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: roles,
          gender: gender,
          is_active: actived,
          is_verified: verified,
          address: form.address,
          city: form.city,
          profile: form.profile,
        },
        { withCredentials: true }
      );

      mutate(`${baseAPI}users?page=${page}&limit=${limit}`);

      toast.success(res.data.message);

      setShowAddUsers(false);

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

  const handleEditUsers = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `${baseAPI}users/${UsersDetail?.id || null}`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: roles,
          gender: gender,
          is_active: actived,
          is_verified: verified,
          address: form.address,
          city: form.city,
          profile: form.profile,
        },
        { withCredentials: true }
      );

      mutate(`${baseAPI}users?page=${page}&limit=${limit}`);

      toast.success(res.data.message);

      setShowDetailUsers(false);

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
    if (UsersDetail) {
      setForm({
        username: UsersDetail?.username ?? "",
        email: UsersDetail?.email ?? "",
        phone: UsersDetail?.phone ?? "",
        profile: UsersDetail?.profile ?? "",
        city: UsersDetail?.city ?? "",
        address: UsersDetail?.address ?? "",
      });

      setRoles(UsersDetail?.role ?? "users");
      setVerified(UsersDetail?.is_verified ?? false);
      setActived(UsersDetail?.is_active ?? false);
    }
  }, [UsersDetail]);

  const getDetailUsers = async (id) => {
    setShowDetailUsers(true);

    const res = await axios.get(`${baseAPI}users/${id}`, {
      withCredentials: true,
    });

    return setUsersDetail(res.data.users);
  };

  return (
    <>
      <div className="pl-[22%] pr-5">
        <div className="flex flex-col p-5 rounded-2xl bg-slate-100 h-[80vh]">
          <div className="flex flex-col w-full h-full overflow-y-auto overscroll-contain">
            <div className="w-full flex items-center justify-between mb-10">
              <h1 className="text-slate-900 font-bold text-2xl">
                Management Customers
              </h1>
              <div className="flex items-center gap-5">
                <Button
                  variant="contained"
                  className="bg-slate-950"
                  onClick={() => setShowAddUsers(!showAddUsers)}
                >
                  Add Customers
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
                        id="search1"
                        name="search1"
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
                      "profile",
                      "username",
                      "email",
                      "phone",
                      "role",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((item) => (
                      <h4
                        key={item}
                        className={`${
                          item === "email"
                            ? "col-span-2"
                            : item === "Actions"
                            ? "col-span-2"
                            : "col-span-1"
                        } p-3 text-xs font-semibold uppercase text-slate-700`}
                      >
                        {item}
                      </h4>
                    ))}
                  </div>

                  {users?.length === 0 && (
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
                  {Array.isArray(users) &&
                    users.map((p, i) => {
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
                                src={`${
                                  p.profile === "default.png" &&
                                  p.gender === "male"
                                    ? Male
                                    : Female
                                }`}
                                alt="product"
                                className="w-16 h-auto max-h-16 rounded-full object-contain bg-slate-200"
                              />
                            </div>

                            <span className="p-3 text-sm text-slate-900 break-all">
                              {p.username}
                            </span>

                            <span className="p-3 text-sm text-slate-900 col-span-2 break-all">
                              {p.email}
                            </span>

                            <span className="p-3 text-sm text-slate-900 break-all">
                              {p.phone}
                            </span>

                            <span className="p-3 text-sm text-slate-900">
                              {p.role}
                            </span>

                            <div className="p-3 flex items-center justify-center w-full">
                              {p.is_active === true ? (
                                <span className=" text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 w-fit">
                                  active
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

                            <div className="p-3 flex flex-row gap-2 col-span-2 break-all">
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
                                onClick={() => getDetailUsers(p.id)}
                              >
                                <ArrowOutwardOutlinedIcon className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="contained"
                                className="bg-red-500 p-5 h-10 rounded-lg w-full flex gap-2"
                                onClick={() => handleDeleteUsers(p.id)}
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
                {users?.length > 0 && (
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

      {showAddUsers && (
        <div
          className="w-full px-20 h-screen p-5 z-45 cursor-pointer bg-slate-950/20 flex items-center justify-center fixed top-0 left-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddUsers(false);
            }
          }}
        >
          <div
            className="w-[80%] z-50 relative h-full cursor-auto flex flex-col bg-slate-50 rounded-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl text-slate-900 truncate font-bold p-5 pr-10 pb-0">
              Add Users
            </h1>
            <form
              className="w-full h-full pt-5 grid grid-cols-1 gap-5"
              onSubmit={handleAddUsers}
              key={formKey}
            >
              <div className="flex w-full h-[350px] p-5 items-center justify-between flex-wrap gap-5 overflow-y-auto overflow-x-hidden">
                <TextInput
                  name="username"
                  label="Username"
                  value={form.username}
                  onChange={handleChangeInputForm}
                />

                <TextInput
                  name="email"
                  type="email"
                  label=" Email Address"
                  value={form.email}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="password"
                  label=" password"
                  value={form.password}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="profile"
                  label=" Profile"
                  value={form.profile}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="phone"
                  type="number"
                  label=" Phhone Number"
                  value={form.phone}
                  onChange={handleChangeInputForm}
                />

                <div className="flex items-center justify-between w-[270px]  h-12">
                  <MemoSelect
                    label="Role"
                    value={roles}
                    onChange={handleChangeRole}
                  >
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"users"}>Users</MenuItem>
                  </MemoSelect>
                  <MemoSelect
                    label="Verified"
                    value={verified}
                    onChange={handleChangeVerified}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </MemoSelect>
                </div>

                <div className="flex items-center justify-between w-[270px]  h-12">
                  <MemoSelect
                    label="Status"
                    value={actived}
                    onChange={handleChangeActived}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </MemoSelect>
                  <MemoSelect
                    label="Gender"
                    value={gender}
                    onChange={handleChangeGender}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </MemoSelect>
                </div>

                <div className="w-full">
                  <div className="flex items-start w-full h-[140px] justify-center relative rounded-lg">
                    <textarea
                      name="address"
                      id="address"
                      placeholder=" "
                      value={form.address}
                      onChange={handleChangeInputForm}
                      className="w-full peer h-full px-5 py-4 resize-none
      text-slate-900 font-medium text-md
      outline outline-slate-500 rounded-lg
      focus:outline-slate-950
      not-placeholder-shown:outline-slate-950"
                    />
                    <label
                      htmlFor="address"
                      className="absolute left-5 top-4 text-slate-500
      peer-focus:text-xs peer-focus:translate-y-[-23px]
      peer-focus:bg-slate-50 peer-focus:left-2.5
      peer-not-placeholder-shown:text-xs
      peer-not-placeholder-shown:translate-y-[-23px]
      peer-not-placeholder-shown:bg-slate-50
      peer-not-placeholder-shown:left-2.5 px-2"
                    >
                      Address
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
                  Add Users
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailUsers && (
        <div
          className="w-full px-20 h-screen p-5 z-45 cursor-pointer bg-slate-950/20 flex items-center justify-center fixed top-0 left-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailUsers(false);

              setForm(inputForm);
              setRoles("");
              setVerified(false);
            }
          }}
        >
          <div
            className="w-[80%] z-50 relative h-full cursor-auto flex flex-col bg-slate-50 rounded-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl text-slate-900 truncate font-bold p-5 pr-10 pb-0">
              Edit Users {UsersDetail.username}
            </h1>
            <form
              className="w-full h-full pt-5 grid grid-cols-1 gap-5"
              onSubmit={handleEditUsers}
              key={formKey}
            >
              <div className="flex w-full h-[350px] p-5 items-center justify-between flex-wrap gap-5 overflow-y-auto overflow-x-hidden">
                <TextInput
                  name="username"
                  label="Username"
                  value={form.username}
                  onChange={handleChangeInputForm}
                />

                <TextInput
                  name="email"
                  type="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="password"
                  type="text"
                  label="Password"
                  value={form.password}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="profile"
                  type="text"
                  label="Profile"
                  value={form.profile}
                  onChange={handleChangeInputForm}
                />
                <TextInput
                  name="phone"
                  type="number"
                  label="Phone Number"
                  value={+62 + form.phone}
                  onChange={handleChangeInputForm}
                />

                <div className="flex items-center justify-between w-[270px]  h-12">
                  <MemoSelect
                    label="Role"
                    value={roles}
                    onChange={handleChangeRole}
                  >
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"users"}>Users</MenuItem>
                  </MemoSelect>
                  <MemoSelect
                    label="Verified"
                    value={verified}
                    onChange={handleChangeVerified}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </MemoSelect>
                </div>

                <div className="flex items-center justify-between w-[270px]  h-12">
                  <MemoSelect
                    label="Status"
                    value={actived}
                    onChange={handleChangeActived}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </MemoSelect>
                  <MemoSelect
                    label="Gender"
                    value={gender}
                    onChange={handleChangeGender}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </MemoSelect>
                </div>

                <div className="w-full">
                  <div className="flex items-start w-full h-[140px] justify-center relative rounded-lg">
                    <textarea
                      name="address"
                      id="address"
                      placeholder=" "
                      value={form.address}
                      onChange={handleChangeInputForm}
                      className="w-full peer h-full px-5 py-4 resize-none
      text-slate-900 font-medium text-md
      outline outline-slate-500 rounded-lg
      focus:outline-slate-950
      not-placeholder-shown:outline-slate-950"
                    />
                    <label
                      htmlFor="address"
                      className="absolute left-5 top-4 text-slate-500
      peer-focus:text-xs peer-focus:translate-y-[-23px]
      peer-focus:bg-slate-50 peer-focus:left-2.5
      peer-not-placeholder-shown:text-xs
      peer-not-placeholder-shown:translate-y-[-23px]
      peer-not-placeholder-shown:bg-slate-50
      peer-not-placeholder-shown:left-2.5 px-2"
                    >
                      Address
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
