import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import axios from "axios";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";
import { useRef, useState } from "react";

export default function Navbar() {
  const avatarRef = useRef(null);
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const opens = Boolean(anchorEl);
  const [Aside, setAside] = useState(false);

  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
    avatarRef.current?.focus();
  };
  return (
    <>
      <aside className="flex flex-col p-5 fixed top-0 left-0 z-40 w-[22%] h-screen">
        <div className="flex flex-col bg-slate-100 rounded-2xl w-full h-full  overflow-y-scroll ">
          <div className="flex items-center sticky top-0 z-10 bg-slate-100 h-16 w-full justify-center">
            <h1 className="font-bold text-lg h-16 flex items-center px-5 w-full">
              Admin Panel
            </h1>
          </div>

          <div className="flex flex-col p-5">
            <h2 className="uppercase text-sm text-slate-500 mb-5">Menu</h2>
            <div className="flex flex-col gap-2.5">
              <NavLink
                to="/Admin/Dashboard"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <DashboardOutlinedIcon className="w-6 h-6" />
                  <span>Dashboard</span>
                </Button>
              </NavLink>
              <NavLink
                to="/Admin/Product"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <StoreOutlinedIcon className="w-6 h-6" />
                  <span>Products</span>
                </Button>
              </NavLink>
              <NavLink
                to="/Admin/Order"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <LocalShippingIcon className="w-6 h-6" />
                  <span>Order</span>
                </Button>
              </NavLink>
              <NavLink
                to="/Admin/Users"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <PeopleAltOutlinedIcon className="w-6 h-6" />
                  <span>Customers</span>
                </Button>
              </NavLink>
              <NavLink
                to="/Admin/Promotion"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <DiscountOutlinedIcon className="w-6 h-6" />
                  <span>Promotion</span>
                </Button>
              </NavLink>
              <NavLink
                to="/Admin/Content"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <AppRegistrationOutlinedIcon className="w-6 h-6" />
                  <span>Content</span>
                </Button>
              </NavLink>

              <NavLink
                to="/Admin/Report"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center justify-start gap-2.5 w-full h-10 rounded-lg"
                >
                  <CampaignOutlinedIcon className="w-6 h-6" />
                  <span>Report Bug</span>
                </Button>
              </NavLink>
            </div>
            <h2 className="uppercase text-sm text-slate-500 mt-10 mb-5">
              General
            </h2>

            <div className="flex flex-col gap-2.5">
              <NavLink
                to="/Admin/Settings"
                className={({ isActive }) =>
                  `peer ${
                    isActive
                      ? "text-slate-950 font-bold bg-slate-50 rounded-lg w-full"
                      : "font-medium text-slate-500 w-full"
                  }`
                }
              >
                <Button
                  variant="text"
                  sx={{ color: "inherit" }}
                  className="flex items-center w-full h-12 justify-start gap-2.5 rounded-lg"
                >
                  <SettingsOutlinedIcon className="w-6 h-6" />
                  <span>Settings</span>
                </Button>
              </NavLink>
              <Button
                variant="contained"
                className="bg-red-500/5 w-full h-12 shadow-none text-red-500 flex items-center justify-start gap-2.5 rounded-lg"
              >
                <LogoutOutlinedIcon className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>
      <nav className="flex flex-col sticky p-5 pl-[22%] right-0 items-center justify-end top-0 z-40 w-full">
        <div className="flex items-center justify-between bg-slate-100 rounded-2xl w-full h-20 px-5">
          <form className="flex items-center justify-center relative">
            <div className="flex items-center justify-center relative w-[300px] h-12 rounded-xl">
              <input
                type="search"
                id="search"
                name="search"
                placeholder="Search..."
                className="w-full h-full px-5 pr-12  rounded-xl outline outline-slate-400 focus:outline-slate-900 not-placeholder-shown:outline-slate-900 font-medium"
              />
            </div>
            <Button
              variant="text"
              sx={{
                width: "unset",
                height: "unset",
                minWidth: "unset",
                minHeight: "unset",
                padding: "unset",
              }}
              className="absolute right-0 rounded-r-xl text-slate-900 w-12 h-12 flex items-center justify-center"
            >
              <SearchOutlinedIcon />
            </Button>
          </form>
          <div className="flex items-center justify-center gap-5">
            <Button
              variant="text"
              sx={{
                width: "unset",
                height: "unset",
                minWidth: "unset",
                minHeight: "unset",
                padding: "unset",
              }}
              className="text-slate-500 w-10 h-10 flex items-center justify-center relative"
            >
              <span className="absolute top-0 -translate-y-1.5 right-0 p-1 text-xs bg-slate-900 text-slate-50 rounded-full">
                10
              </span>
              <NotificationsNoneOutlinedIcon className="w-8 h-8" />
            </Button>
            <Avatar
              className="text-slate-500 cursor-pointer w-10 h-10 relative rounded-full"
              onClick={handleProfile}
              ref={avatarRef}
              alt="Remy Sharp"
              src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            />
          </div>
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
    </>
  );
}
