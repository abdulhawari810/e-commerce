import { createContext, useContext, useEffect, useState } from "react";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const [countCart, setCountCart] = useState(0);
  const [dataCart, setDataCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");

      if (!saved || saved === "undefined") return [];

      return JSON.parse(saved);
    } catch (err) {
      console.error("Invalid cart in localStorage", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(dataCart));
  }, [dataCart]);

  return (
    <cartContext.Provider
      value={{ countCart, setCountCart, dataCart, setDataCart }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => useContext(cartContext);
