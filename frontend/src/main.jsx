import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/app.css";
<<<<<<< HEAD
import Aos from "aos";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import file layout
import App from "./layout/app";
import Admin from "./layout/admin";
import Auth from "./layout/auth";

// import file Home
import Home from "./view/Home/Home";
import About from "./view/Home/About";
import Contact from "./view/Home/Contact";
import Settings from "./view/Home/Settings";
import Cart from "./view/Home/Cart";
import Product from "./view/Home/Product";
import Detail from "./view/Home/Detail";

// import file context & protected
import ProtectedRoute from "./protected/protected";
import { AuthProvider } from "./context/AuthContext";

// import file OAuth
import Login from "./view/OAuth/Login";
import Register from "./view/OAuth/Register";

//inital AOS Animation

Aos.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
  initClassName: "aos-init", // class applied after initialization
  animatedClassName: "aos-animate", // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: "ease", // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
});
=======
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
>>>>>>> 2b2e8e3 (two commit)

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
<<<<<<< HEAD
        path: "/Contact",
        element: <Contact />,
      },
      {
        path: "/About",
        element: <About />,
      },
      {
        path: "/Detail",
        element: <Detail />,
      },
      {
        path: "/Settings",
        element: <Settings />,
      },
      {
        path: "/Cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
=======
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
>>>>>>> 2b2e8e3 (two commit)
    ],
  },
  {
    path: "/Admin",
<<<<<<< HEAD
    element: <Admin />,
    children: [{}],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
=======
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
>>>>>>> 2b2e8e3 (two commit)
);
