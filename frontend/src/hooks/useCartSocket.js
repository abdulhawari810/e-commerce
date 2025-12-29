// hooks/useCartSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";

let socket;

export default function useCartSocket(
  userId,
  onCartUpdated,
  serverUrl = import.meta.env.VITE_BASE_API,
) {
  useEffect(() => {
    if (!userId) return;

    socket = io(serverUrl, {
      // jika mau kirim token: auth: { token: localStorage.getItem("token") }
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      // join room user
      socket.emit("join", userId);
    });

    socket.on("cart-updated", (data) => {
      // data: { count }
      onCartUpdated && onCartUpdated(data);
    });

    return () => {
      if (socket) {
        socket.off("cart-updated");
        socket.disconnect();
      }
    };
  }, [userId, onCartUpdated, serverUrl]);
}
