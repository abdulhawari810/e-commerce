import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
<<<<<<< HEAD
=======

>>>>>>> 2b2e8e3 (two commit)
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
<<<<<<< HEAD
  server: {
    allowedHosts: ["cfa490aac191.ngrok-free.app"],
  },
=======
>>>>>>> 2b2e8e3 (two commit)
});
