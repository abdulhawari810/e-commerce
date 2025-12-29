import {
  User,
  Search,
  Bell,
  ShoppingCart,
  Menu,
  ChevronDown,
  ShoppingBag,
  House,
  Settings,
  CirclePlus,
  CircleMinus,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import useCartSocket from "../hooks/useCartSocket";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import emptyCart from "../assets/empty-cart.jpg";

export default function Navbar() {
  const [side, setSide] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [showDelIndex, setShowDelIndex] = useState(null);
  const [showCarts, setShowCarts] = useState(false);
  const baseAPI = import.meta.env.VITE_BASE_API;

  const fetchCart = async () => {
    const res = await axios.get(`${baseAPI}carts/userId?user_id=${user?.id}`);
    setCart(res.data.items);
    setTotal(res.data.total);
  };

  const fetchCount = async () => {
    const res = await axios.get(`${baseAPI}cart/count?userId=${user?.id}`);
    setCount(res.data.count);
  };

  useEffect(() => {
    if (!user?.id) {
      setCount(0);
      return;
    }
    fetchCart();
    fetchCount();
  }, [user?.id]);

  useCartSocket(user?.id, () => {
    fetchCart();
    fetchCount();
  });

  const updateCarts = async (userId, productId, qty) => {
    try {
      await axios.post(
        `${baseAPI}carts/updated`,
        {
          userId: userId,
          productId,
          qty: qty,
        },
        {
          withCredentials: true,
        },
      );

      fetchCart();
      fetchCount();
    } catch (err) {
      console.log(err);
    }
  };

  const decrease = (id) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item,
      );

      const itemData = updated.find((i) => i.id === id);
      updateCarts(user?.id, itemData.product_id, itemData.qty);

      return updated;
    });
  };

  const increase = (id) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      );

      const itemData = updated.find((i) => i.id === id);
      updateCarts(user?.id, itemData.product_id, itemData.qty);

      return updated;
    });
  };

  const handleInputQty = (id, value) => {
    const qty = Number(value);

    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, qty } : item,
      );
      const itemData = updated.find((i) => i.id === id);

      updateCarts(user?.id, itemData.product_id, qty);

      return updated;
    });
  };

  const deleteCarts = async (userId, cartId) => {
    try {
      const res = await axios.post(
        `${baseAPI}carts/deleted`,
        {
          userId,
          cartItemId: cartId,
        },
        {
          withCredentials: true,
        },
      );
      setShowDelIndex(null);
      toast.success(res.data.message);
      fetchCart();
      fetchCount();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <nav className="bg-neutral-light fixed top-0 left-0 w-full h-16 flex items-center justify-between px-5 lg:px-10 md:px-10 z-50 shadow-sm">
        {/* LOGO */}
        <div className="flex items-center">
          <h1 className="text-primary text-3xl font-semibold tracking-wide">
            E-commerce
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2.5">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "bg-accent-orange text-primary-dark p-5 font-medium transition"
                : "bg-neutral-light text-primary-light/70 p-5 transition"
            }
            to={"/"}
          >
            Homepage
          </NavLink>
          <NavLink className="p-5 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange transition">
            New Arrival
          </NavLink>
          <NavLink
            className="p-5 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange transition"
            to={"/Product"}
          >
            All Products
          </NavLink>
          {/* CATEGORIES DROPDOWN (DESKTOP) */}
          <div className="relative p-5 group cursor-pointer text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange z-30">
            <div className="flex items-center gap-1 text-neutral-dark text-base group-hover:text-primary-dark transition">
              Categories
              <ChevronDown className="w-4 h-4" />
            </div>

            <div className="absolute top-20 left-0 w-48 bg-neutral-light shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange z-30">
                Clothes
              </NavLink>
              <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange">
                Shoes
              </NavLink>
              <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange">
                Accessories
              </NavLink>
            </div>
          </div>
          {/* SEARCH DESKTOP */}
          <form className="relative hidden lg:flex items-center justify-center">
            <input
              type="search"
              placeholder=" "
              id="search"
              className="peer w-[260px] h-11 pl-4 pr-10 bg-neutral-light rounded-lg border border-neutral-medium/40 focus:border-primary-dark outline-none transition"
            />
            <label
              className="absolute left-4 text-neutral-dark/60  peer-focus:-translate-y-[22px] peer-not-placeholder-shown:-translate-y-[22px] peer-focus:text-sm peer-not-placeholder-shown:text-sm peer-focus:text-primary-dark peer-not-placeholder-shown:text-primary-dark bg-neutral-light px-1 transition-all"
              htmlFor="search"
            >
              Search Product
            </label>
            <Search className="absolute right-3 text-neutral-dark/60 peer-focus:text-primary-dark w-5 h-5" />
          </form>
          <button className="p-2 rounded-lg text-neutral-dark cursor-pointer hover:bg-accent-orange hover:text-primary-dark transition">
            <Bell className="w-6 h-6" />
          </button>
          <button
            className={`p-2 rounded-lg text-neutral-dark cursor-pointer hover:bg-accent-orange hover:text-primary-dark transition relative ${showCarts ? "bg-accent-orange" : "bg-neutral-light"}`}
            onClick={() => setShowCarts(!showCarts)}
          >
            <ShoppingCart className="w-6 h-6" />

            <span className="absolute top-0 right-0 bg-state-danger text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {count}
            </span>
          </button>
          {/* modal for cart start*/}
          {showCarts && (
            <Modal
              styles={
                "w-[30%] h-auto flex flex-col fixed top-[80px] p-5 right-10 rounded-lg bg-neutral-light"
              }
            >
              <h1 className="text-2xl text-primary-dark font-black mb-2.5">
                Carts Items
              </h1>

              <div className="flex flex-col w-full h-72 overflow-auto bg-neutral-light rounded-2xl">
                {Array.isArray(cart) &&
                  cart.map((carts, i) => {
                    return (
                      <div
                        className="w-full flex flex-row items-center justify-center cursor-pointer relative"
                        key={i}
                      >
                        <div
                          className={`flex flex-row shadow-md p-5 rounded-2xl z-10 relative`}
                        >
                          <div
                            onClick={() =>
                              setShowDelIndex(showDelIndex === i ? null : i)
                            }
                          >
                            <img
                              src="../../src/assets/carousel1.png"
                              alt="Product 1"
                              className="w-full h-[150px] object-contain"
                            />
                          </div>
                          <div className="flex flex-col relative">
                            <h1 className="text-lg font-medium text-primary-dark">
                              {carts.product.title.length > 40
                                ? carts.product.title.substring(0, 40) + "..."
                                : carts.product.title}
                            </h1>
                            <div className="flex flex-row items-center gap-2.5">
                              <span className="text-xl font-medium text-primary-dark">
                                Rp
                                {Intl.NumberFormat("id-ID", {
                                  notation: "standard",
                                  maximumFractionDigits: 1,
                                }).format(
                                  carts.product.price -
                                    (carts.product.price *
                                      carts.product.details[0].discount) /
                                      100,
                                ) || 0}
                              </span>
                              <span className="text-sm font-medium text-state-danger/80 line-through">
                                Rp
                                {Intl.NumberFormat("id-ID", {
                                  notation: "standard",
                                  maximumFractionDigits: 1,
                                }).format(carts.product.price) || 0}
                              </span>
                            </div>
                            <div className="w-full z-20 absolute bottom-0 flex items-center justify-between">
                              <div className="flex items-center justify-center ">
                                <span className="text-lg text-primary mr-5">
                                  qty:
                                </span>
                                <button
                                  className="w-5 h-5 rounded-full bg-state-danger text-neutral-light"
                                  onClick={() => decrease(carts.id)}
                                >
                                  <CircleMinus className="w-5 h-5" />
                                </button>
                                <input
                                  className="w-[90px] h-8 bg-neutral-light text-center outline-none border-none shadow-md mx-1 px-1.5"
                                  type="number"
                                  min={1}
                                  value={carts.qty}
                                  onChange={(e) =>
                                    handleInputQty(carts.id, e.target.value)
                                  }
                                />

                                <button
                                  className="w-5 h-5 rounded-full bg-state-success text-neutral-light"
                                  onClick={() => increase(carts.id)}
                                >
                                  <CirclePlus className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {showDelIndex === i && (
                          <button
                            className="w-20 h-10 ml-5 flex items-center justify-center text-neutral-light bg-state-danger rounded-lg cursor-pointer"
                            onClick={() => deleteCarts(user?.id, carts.id)}
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                {cart?.length === 0 && (
                  <div className="flex items-center justify-center flex-col">
                    <img
                      src={emptyCart}
                      alt="Empty Carts"
                      className="w-[50%] h-[200px] mb-2.5 object-cover rounded-lg"
                    />
                    <h1 className="text-primary-dark text-lg font-medium">
                      Keranjang kosong
                    </h1>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>
                    Total Price: Rp
                    {Intl.NumberFormat("id-ID", {
                      notation: "standard",
                      maximumFractionDigits: 1,
                    }).format(total)}
                  </span>
                </div>
                <div>
                  <button className="w-[100px] h-11 flex items-center justify-center bg-accent-orange text-primary-dark text-md rounded-md">
                    Order Now
                  </button>
                </div>
              </div>
            </Modal>
          )}
          {/* modal for cart end*/}
          {/* PROFILE */}
          <div className="relative group cursor-pointer">
            <div className="p-2 rounded-lg text-neutral-dark hover:bg-accent-orange hover:text-primary-dark transition flex items-center">
              <User className="w-6 h-6" />
            </div>

            <div className="absolute right-0 top-16 w-48 bg-neutral-light rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange">
                Profile
              </NavLink>
              <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange">
                Whislist
              </NavLink>
              {user?.role === "admin" && (
                <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange">
                  Dashboard
                </NavLink>
              )}
              <NavLink className="block px-4 py-3 text-primary-light/70 hover:text-primary-dark hover:bg-accent-orange">
                Settings
              </NavLink>
              {user !== null && user !== undefined ? (
                <div
                  className="block px-4 py-3 hover:bg-red-500  text-red-600 hover:text-neutral-light"
                  onClick={logout}
                >
                  Logout
                </div>
              ) : (
                <NavLink
                  className="block px-4 py-3 hover:bg-primary-dark  text-primary-dark hover:text-neutral-light"
                  to={"/login"}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setSide(!side)}
          className={`md:hidden p-2 rounded-lg transition ${
            side ? "bg-neutral-medium text-primary-dark" : "text-neutral-dark"
          }`}
        >
          <Menu className={`w-8 h-8 ${side ? "rotate-90" : "rotate-0"}`} />
        </button>

        {/* MOBILE DRAWER */}
        <div
          className={`
      fixed top-16 left-0 w-[80%] h-screen bg-neutral-light shadow-lg
      lg:hidden md:hidden flex flex-col gap-4 p-5 overflow-y-auto transition-all duration-300
      ${side ? "translate-x-0" : "-translate-x-full"}
    `}
        >
          <NavLink className="text-neutral-dark text-lg py-3 px-5 rounded-md hover:bg-neutral-medium">
            New Arrival
          </NavLink>

          <NavLink className="text-neutral-dark text-lg py-3 px-5 rounded-md hover:bg-neutral-medium">
            All Products
          </NavLink>

          {/* MOBILE CATEGORIES */}
          <div
            onClick={() => setDropdown(!dropdown)}
            className="text-neutral-dark text-lg flex justify-between items-center py-3 px-5 rounded-md hover:bg-neutral-medium cursor-pointer"
          >
            <span>Categories</span>
            <ChevronDown
              className={`w-5 h-5 transition ${dropdown ? "rotate-180" : ""}`}
            />
          </div>

          {dropdown && (
            <div className="flex flex-col ml-2 border-l border-neutral-medium/40">
              <NavLink className="py-2 px-8 text-neutral-dark/80 hover:bg-neutral-medium hover:text-primary-dark">
                Clothes
              </NavLink>
              <NavLink className="py-2 px-8 text-neutral-dark/80 hover:bg-neutral-medium hover:text-primary-dark">
                Shoes
              </NavLink>
              <NavLink className="py-2 px-8 text-neutral-dark/80 hover:bg-neutral-medium hover:text-primary-dark">
                Accessories
              </NavLink>
            </div>
          )}

          {/* MOBILE SEARCH */}
          <form className="relative w-full flex items-center justify-center">
            <input
              type="search"
              placeholder=" "
              className="peer w-full h-11 pl-4 pr-10 bg-neutral-light rounded-lg border border-neutral-medium/40 focus:border-primary-dark outline-none transition"
            />
            <label className="absolute left-4 text-neutral-dark/60  peer-focus:-translate-y-[22px] peer-not-placeholder-shown:-translate-y-[22px] peer-focus:text-sm peer-not-placeholder-shown:text-sm peer-focus:text-primary-dark peer-not-placeholder-shown:text-primary-dark bg-neutral-light px-1 transition-all">
              Search Product
            </label>
            <Search className="absolute right-3 text-neutral-dark/60 peer-focus:text-primary-dark w-5 h-5" />
          </form>

          {/* PROFILE MOBILE */}
          <NavLink className="py-3 px-5 rounded-md text-lg text-neutral-light bg-primary-dark">
            Login
          </NavLink>
        </div>
      </nav>
      {/* Navbar bottom MOBILE */}
      <nav className="w-full bg-neutral-light z-50 h-16 fixed left-0 bottom-0 lg:hidden md:hidden flex items-center justify-between px-5 gap-5">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "flex items-center justify-center text-lg text-primary-dark p-2.5 relative group"
              : "flex items-center justify-center text-lg text-primary-dark/30 p-2.5 relative group"
          }
          to={`/Product`}
        >
          <ShoppingBag className="w-[30px] h-[30px]" />
          <div className=" items-center justify-center text-lg bg-accent-orange text-neutral-light font-medium group-hover:flex hidden top-0 -translate-y-10 absolute">
            <span>Home</span>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "flex items-center justify-center text-lg text-primary-dark p-2.5 "
              : "flex items-center justify-center text-lg text-primary-dark/30 p-2.5"
          }
          to={`/`}
        >
          <House className="w-[30px] h-[30px]" />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "flex items-center justify-center text-lg text-primary-dark p-2.5 "
              : "flex items-center justify-center text-lg text-primary-dark/30 p-2.5"
          }
          to={`/Cart`}
        >
          <ShoppingCart className="w-[30px] h-[30px]" />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "flex items-center justify-center text-lg text-primary-dark p-2.5 "
              : "flex items-center justify-center text-lg text-primary-dark/30 p-2.5"
          }
          to={`/Settings`}
        >
          <Settings className="w-[30px] h-[30px]" />
        </NavLink>
      </nav>
    </>
  );
}
