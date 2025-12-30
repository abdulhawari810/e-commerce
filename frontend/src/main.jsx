import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProtectedRoute from "./protected/protectedRoute";

import App from "./layout/app";
import Home from "./view/home/home";
import Whislist from "./view/home/whislist";
import Cart from "./view/home/cart";
import Product from "./view/home/product";
import Detail from "./view/home/detail";
import Settings from "./view/home/settings";
import Profile from "./view/home/profile";
import Orders from "./view/home/order";
import Checkout from "./view/home/checkout";

import Login from "./view/auth/login";
import Register from "./view/auth/register";
import Forgot from "./view/auth/forgot";
import Verify from "./view/auth/verify";
import { CartProvider } from "./context/cartCountext";

import Dashboard from "./view/admin/dashboard";
import Order from "./view/admin/order";
import Products from "./view/admin/product";
import Users from "./view/admin/users";
import Promotion from "./view/admin/promotion";
import Report from "./view/admin/report";
import Content from "./view/admin/content";
import Setting from "./view/admin/settings";
import Admin from "./layout/admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Product",
        element: <Product />,
      },
      {
        path: "/Detail/:productId",
        element: <Detail />,
      },
      {
        path: "/Profile",
        element: <Profile />,
      },
      {
        path: "/Order",
        element: <Orders />,
      },
      {
        path: "/Whislist",
        element: (
          <ProtectedRoute>
            <Whislist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Cart",
        element: <Cart />,
      },
      {
        path: "/Settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/Admin",
    element: (
      <ProtectedRoute role={"admin"}>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "Dashboard",
        element: <Dashboard />,
      },
      {
        path: "Order",
        element: <Order />,
      },
      {
        path: "Product",
        element: <Products />,
      },
      {
        path: "Users",
        element: <Users />,
      },
      {
        path: "Promotion",
        element: <Promotion />,
      },
      {
        path: "Content",
        element: <Content />,
      },
      {
        path: "Report",
        element: <Report />,
      },
      {
        path: "Settings",
        element: <Setting />,
      },
    ],
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Checkout",
    element: <Checkout />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Forgot",
    element: <Forgot />,
  },
  {
    path: "/Verify",
    element: <Verify />,
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f172a",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <AuthProvider>
        <StyledEngineProvider enableCssLayer>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <ThemeProvider theme={theme}>
            <RouterProvider router={router}></RouterProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </AuthProvider>
    </CartProvider>
  </StrictMode>
);
