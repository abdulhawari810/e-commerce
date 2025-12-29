import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import emptyCart from "../assets/empty_cart.svg";

import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartCountext";
import {
  getGuestCart,
  getGuestCount,
  setGuestCart,
} from "../utils/cartGuest.utils";
import { socket } from "../js/socket";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [anchorEl, setAnchorEl] = useState(null);
  const opens = Boolean(anchorEl);
  const [cartQty, setCartQty] = useState({});
  const [tempQty, setTempQty] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isQtyEditing, setIsQtyEditing] = useState(false);
  const [activeTrashId, setActiveTrashId] = useState(null);
  const avatarRef = useRef(null);
  const { user, logout } = useAuth();
  const { countCart, setCountCart } = useCart();
  const { dataCart, setDataCart } = useCart();
  const baseAPI = import.meta.env.VITE_BASE_API;
  const nav = useNavigate();
  const hargaQTY = useMemo(() => {
    return dataCart.reduce((total, item, i) => {
      if (!item?.product) return total;

      const qty = tempQty[i] ?? item.qty;

      const harga = item?.product.harga;
      const diskon = item?.product.diskon;

      const totalHarga = harga - (harga * diskon) / 100;

      const hargaDiskon = harga - totalHarga;

      const hargaAsli = harga - hargaDiskon;

      return total + Number(hargaAsli) * qty;
    }, 0);
  }, [dataCart, tempQty]);

  useEffect(() => {
    const initCart = async () => {
      if (!user) {
        const cart = getGuestCart();
        setCountCart(getGuestCount);

        if (cart.length === 0) {
          setDataCart([]);
          return;
        }

        const res = await axios.post(`${baseAPI}cart/guest`, {
          parsing: cart,
        });

        setDataCart(res.data.data);

        return;
      }

      if (user) {
        axios
          .get(`${baseAPI}cart/count`, { withCredentials: true })
          .then((res) => {
            setCountCart(res.data.countCart);
          });
      } else {
        setCountCart(0);
      }
    };

    initCart();
  }, [user]);

  useEffect(() => {
    socket.on("cart:count:update", (total) => {
      setCountCart(total);
    });
    return () => {
      socket.off("cart:count:update");
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCartQty(tempQty);
    }, 500);

    return () => clearTimeout(timer);
  }, [tempQty]);

  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
    avatarRef.current?.focus();
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    avatarRef.current?.focus();
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const toggleMenu = (menu) => {
    setShowMenu((prev) => (prev === menu ? null : menu));
  };
  const handleDropdown = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        const cart = localStorage.getItem("carts");

        if (!cart) {
          setDataCart([]);
          return;
        }

        const parsing = JSON.parse(cart);

        const res = await axios.post(`${baseAPI}cart/guest`, { parsing });

        setDataCart(res.data.data);
        return;
      }

      const res = await axios.get(`${baseAPI}cart`, {
        withCredentials: true,
      });

      setDataCart(res.data.cart);
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    socket.on("cart:data:update", (cart) => {
      setDataCart(cart);
    });
    return () => {
      socket.off("cart:data:update");
    };
  }, []);

  const handleDeleteCart = async (productId) => {
    if (!user) {
      const cart = JSON.parse(localStorage.getItem("carts")) || [];

      const newCart = cart.filter((item) => item.productId !== productId);

      localStorage.setItem("carts", JSON.stringify(newCart));

      const res = await axios.post(`${baseAPI}cart/guest`, {
        parsing: newCart,
      });

      setDataCart(res.data.data);

      setCountCart(getGuestCount);

      return;
    }

    localStorage.removeItem("qtyCart");
    setTempQty(0);

    const res = await axios.delete(`${baseAPI}cart/${productId}`, {
      withCredentials: true,
    });

    toast.success(res.data.message);
  };

  const handleQTY = async (productId, qty) => {
    if (qty < 1) return;

    if (!user) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!cart) {
        setDataCart([]);
        return;
      }
      if (cart) {
        const index = cart.findIndex((item) => item.productId === productId);

        if (index !== -1) {
          cart[index].qty = qty;
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        const parsing = JSON.parse(cart);

        const res = await axios.post(`${baseAPI}cart/guest`, { parsing });

        setDataCart(res.data.data);

        setCountCart(getGuestCount);

        toast.success("Produk Berhasil ditambahkan ke keranjang");
        return;
      }
    } else {
      await axios.patch(
        `${baseAPI}cart/${productId}`,
        { qty },
        { withCredentials: true }
      );
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    nav("/Checkout");
  };
  return (
    <>
      <nav className="flex items-center justify-between fixed top-0 left-0 z-50 bg-slate-50 w-full h-20 p-10">
        <div className="flex items-center justify-center">
          <h1 className="font-black text-2xl text-slate-950">Morphy</h1>
        </div>
        <div className="flex items-center justify-center gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-slate-950" : "text-slate-500"
            }
          >
            <Button variant="text" className="text-inherit! font-bold">
              Beranda
            </Button>
          </NavLink>
          <div className="flex flex-col relative">
            <Button
              variant="text"
              className={
                showMenu === "kategori"
                  ? "text-slate-950 font-bold"
                  : "text-slate-500 font-medium"
              }
              onClick={() => toggleMenu("kategori")}
            >
              Kategori Produk
            </Button>
            {showMenu === "kategori" && (
              <Paper
                sx={{ width: 220, maxWidth: "100%" }}
                className="fixed top-20"
              >
                <MenuList>
                  <MenuItem className="w-full px-0">
                    <Accordion
                      className="w-full"
                      disableGutters
                      elevation={0}
                      square
                      sx={{
                        border: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                      expanded={expanded === "baju"}
                      onChange={handleDropdown("baju")}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Typography component="span">Baju</Typography>
                      </AccordionSummary>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Kaos</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Kemeja</Typography>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Blouse</Typography>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Tunik</Typography>
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                  <MenuItem className="w-full px-0">
                    <Accordion
                      className="w-full"
                      disableGutters
                      elevation={0}
                      square
                      expanded={expanded === "celana"}
                      onChange={handleDropdown("celana")}
                      sx={{
                        border: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Typography component="span">Celana</Typography>
                      </AccordionSummary>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Jeans</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Chino</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Kulot</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Legging</Typography>
                        </NavLink>
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                  <MenuItem className="w-full px-0">
                    <Accordion
                      className="w-full"
                      disableGutters
                      elevation={0}
                      square
                      expanded={expanded === "jaket"}
                      onChange={handleDropdown("jaket")}
                      sx={{
                        border: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Typography component="span">Jaket</Typography>
                      </AccordionSummary>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Hoodie</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Sweater</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Jaket Jeans</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">
                            Jaket Parasut
                          </Typography>
                        </NavLink>
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                  <MenuItem className="w-full px-0">
                    <Accordion
                      className="w-full"
                      disableGutters
                      elevation={0}
                      square
                      expanded={expanded === "hijab"}
                      onChange={handleDropdown("hijab")}
                      sx={{
                        border: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Typography component="span">Hijab</Typography>
                      </AccordionSummary>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">
                            Hijab Instant
                          </Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Pashmina</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Segi Empat</Typography>
                        </NavLink>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <NavLink>
                          <Typography component="span">Bergo</Typography>
                        </NavLink>
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                  <MenuItem className="w-full px-0">
                    <Accordion
                      className="w-full"
                      disableGutters
                      elevation={0}
                      square
                      expanded={expanded === "koleksi"}
                      onChange={handleDropdown("koleksi")}
                      sx={{
                        border: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                      >
                        <Typography component="span">
                          Akessoris & Pelengkap
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Tas</Typography>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Sepatu</Typography>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Kecamata</Typography>
                      </AccordionDetails>
                      <AccordionDetails className="px-8 hover:bg-slate-200">
                        <Typography component="span">Aksesoris</Typography>
                      </AccordionDetails>
                    </Accordion>
                  </MenuItem>
                </MenuList>
              </Paper>
            )}
          </div>
          <div className="flex flex-col relative">
            <Button
              variant="text"
              className={
                showMenu === "promo"
                  ? "text-slate-950 font-bold"
                  : "text-slate-500 font-medium"
              }
              onClick={() => toggleMenu("promo")}
            >
              Promo
            </Button>
            {showMenu === "promo" && (
              <Paper
                sx={{ width: 220, maxWidth: "100%" }}
                className="fixed top-20"
              >
                <MenuList>
                  <MenuItem>
                    <ListItemText>Diskon</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Flash Sale</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Bundling</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Voucher</ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            )}
          </div>
          <div className="flex flex-col relative">
            <Button
              variant="text"
              className={
                showMenu === "koleksi"
                  ? "text-slate-950 font-bold"
                  : "text-slate-500 font-medium"
              }
              onClick={() => toggleMenu("koleksi")}
            >
              Koleksi
            </Button>
            {showMenu === "koleksi" && (
              <Paper
                sx={{ width: 220, maxWidth: "100%" }}
                className="fixed top-20"
              >
                <MenuList>
                  <MenuItem>
                    <ListItemText>New Arrival</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Best Seller</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Limited Edition</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Pre-order</ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Button
            variant="text"
            className="text-slate-500 relative rounded-full"
            onClick={handleClickOpen("paper")}
          >
            <LocalMallOutlinedIcon className="w-8 h-8" />
            <div className="p-[5px] flex items-center justify-center bg-slate-950 text-slate-50 rounded-full absolute top-0 right-0 -translate-y-2.5 text-sm">
              {countCart}
            </div>
          </Button>

          <Avatar
            className="text-slate-500 cursor-pointer w-10 h-10 relative rounded-full"
            onClick={handleProfile}
            ref={avatarRef}
            alt="Remy Sharp"
            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          />
        </div>
      </nav>

      <Menu
        ref={avatarRef}
        anchorEl={anchorEl}
        id="account-menu"
        open={opens}
        className="cursor-pointer"
        onClose={() => {
          setAnchorEl(null);
          avatarRef.current?.focus();
        }}
        onClick={() => {
          setAnchorEl(null);
          avatarRef.current?.focus();
        }}
        disableAutoFocusItem
        disableScrollLock
        disableRestoreFocus
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "fixed",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem ref={avatarRef} onClick={handleProfileClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          My account
        </MenuItem>
        <NavLink
          to={user === null || user === undefined ? "/Login" : "/Whislist"}
        >
          <MenuItem ref={avatarRef} onClick={handleProfileClose}>
            <ListItemIcon>
              <FavoriteIcon fontSize="small" />
            </ListItemIcon>
            Whislist
          </MenuItem>
        </NavLink>
        <MenuItem ref={avatarRef} onClick={handleProfileClose}>
          <ListItemIcon>
            <LocalShippingIcon fontSize="small" />
          </ListItemIcon>
          Order
        </MenuItem>
        <Divider />
        <MenuItem ref={avatarRef} onClick={handleProfileClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        {user?.role === "admin" && (
          <NavLink to={"/Admin/Dashboard"}>
            <MenuItem ref={avatarRef} onClick={handleProfileClose}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
          </NavLink>
        )}
        {user === null || user === undefined ? (
          <NavLink to={"/login"}>
            <MenuItem
              ref={avatarRef}
              onClick={handleProfileClose}
              className="group hover:bg-slate-950 hover:text-slate-50!"
            >
              <ListItemIcon className="text-inherit">
                <Logout fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          </NavLink>
        ) : (
          <MenuItem
            ref={avatarRef}
            onClick={logout}
            className="group hover:bg-red-400 hover:text-slate-50!"
          >
            <ListItemIcon className="text-inherit">
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={open}
        onClose={handleClose}
        component={"form"}
        scroll={scroll}
        onSubmit={handleOrder}
        disableScrollLock
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="scroll-dialog-title"
          className="text-slate-950 rounded-t-2xl font-bold text-2xl w-full"
        >
          My Cart
        </DialogTitle>
        <DialogContent
          dividers={scroll === "paper"}
          className="w-[600px] text-slate-950 flex flex-col gap-5"
        >
          {dataCart?.length === 0 && (
            <div className="flex flex-col p-20 items-center justify-center">
              <img
                src={emptyCart}
                alt="Empty Cart"
                className="w-[150px] h-[150px] object-cover"
              />
              <h1 className="text-lg font-bold mt-5">
                Yah Keranjang kamu masih kosong
              </h1>
              <span>tambahkan produk ke keranjang sebelum order</span>
            </div>
          )}

          {Array.isArray(dataCart) &&
            dataCart?.map((item, i) => {
              const showTrash = activeTrashId === i;

              const harga = item.product?.harga;
              const diskon = item.product?.diskon;

              const disk = harga - (harga * diskon) / 100;
              const total = harga - disk;

              const totals = harga - total;
              const qtyy = tempQty[i] ?? item.qty;
              const totalHarga = totals * qtyy;

              return (
                <div className="relative w-full h-[250px]" key={i}>
                  <div
                    className={`
                        relative z-10 bg-white shadow-xl rounded-4xl p-5
                        flex gap-5 items-center cursor-pointer
                        transition-transform duration-300 h-full
                        ${showTrash ? "translate-x-[-100px]" : "translate-x-0"}
                      `}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTrashId(showTrash ? null : i);
                    }}
                  >
                    <img
                      src={item.product?.thumbnail}
                      className="w-[150px] h-[150px] rounded-3xl"
                    />
                    <div className="flex flex-col">
                      <h1 className="text-lg font-bold text-slate-950">
                        {item.product?.judul}
                      </h1>
                      <div className="flex flex-row items-center gap-2.5">
                        <span className="text-2xl text-slate-950 font-bold">
                          Rp{" "}
                          {Intl.NumberFormat("id-ID", {
                            maximumFractionDigits: 1,
                          }).format(totalHarga) || 0}
                        </span>
                        <span className="text-red-500/80 font-bold line-through">
                          Rp{" "}
                          {Intl.NumberFormat("id-ID", {
                            maximumFractionDigits: 1,
                          }).format(item.product?.harga) || 0}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-slate-950">
                        Stok: {item.product?.stok}
                      </span>
                      <div className="flex items-center justify-center">
                        <Button
                          className="border-slate-950 text-slate-950"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();

                            setTempQty((prev) => {
                              const currentQty = prev[i] ?? item.qty;
                              const newQty = Math.max(currentQty - 1, 1);

                              handleQTY(item.product?.id, newQty);

                              return {
                                ...prev,
                                [i]: newQty,
                              };
                            });
                          }}
                        >
                          <RemoveOutlinedIcon className="w-5 h-5" />
                        </Button>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                          <Input
                            id="standard-adornment-amount"
                            startAdornment={
                              <InputAdornment position="start">
                                qty
                              </InputAdornment>
                            }
                            value={
                              isQtyEditing &&
                              (tempQty[i] === 0 || tempQty === undefined)
                                ? ""
                                : tempQty[i] || item.qty
                            }
                            type="number"
                            inputProps={{ min: 0, max: item.product?.stok }}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => {
                              e.stopPropagation();
                              setIsEditing(true);
                              setIsQtyEditing(true);
                            }}
                            onBlur={() => {
                              setIsEditing(false);
                              setIsQtyEditing(false);
                              if (!tempQty[i]) {
                                setTempQty((prev) => ({ ...prev, [i]: 0 }));
                              }

                              const finalQty = tempQty[i] ?? item.qty;
                              handleQTY(item.product?.id, finalQty);
                            }}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (value === "") {
                                setTempQty((prev) => ({ ...prev, [i]: "" }));
                              }
                              if (value < 0) value = 0;
                              if (value > item.product?.stok)
                                value = item.product?.stok;

                              setTempQty((prev) => ({
                                ...prev,
                                [i]: value,
                              }));
                            }}
                          />
                        </FormControl>
                        <Button
                          className=" bg-slate-950"
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();

                            setTempQty((prev) => {
                              const currentQty = prev[i] ?? item.qty;
                              const newQty = currentQty + 1;

                              handleQTY(item.product?.id, newQty);

                              return {
                                ...prev,
                                [i]: newQty,
                              };
                            });
                          }}
                        >
                          <AddOutlinedIcon className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    className={`absolute right-0 top-0 h-full w-[250px]
                        bg-red-500 flex items-center justify-end
                        rounded-r-[40px] transition-opacity duration-300
                        ${
                          showTrash
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }
                      `}
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCart(item.product?.id);
                      setActiveTrashId(showTrash ? null : i);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon className="w-8 h-8" />
                  </Button>
                </div>
              );
            })}
        </DialogContent>
        <DialogActions className="w-full">
          <Button
            className="w-full bg-slate-950 h-14 rounded-2xl"
            variant="contained"
            type="submit"
          >
            Order Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
