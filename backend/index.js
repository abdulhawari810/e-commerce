import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import session from "cookie-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import db from "./config/db.js";
import router from "./router/routes.js";

dotenv.config();

const allowedOrigins = [
  "https://pandanime-frontend.vercel.app",
  "http://localhost:5173",
  "https://d2ae29be96df.ngrok-free.app/",
];

const app = express();

(async () => {
  db.sync();
})();

app.use(
  cors({
    origin: allowedOrigins,
    // origin: function (origin, callback) {
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     callback(null, origin);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  }),
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(
  "/storage/thumbnail",
  express.static(path.join(process.cwd(), "storage/thumbnail")),
);
app.use(router);
// buat http server
const httpServer = http.createServer(app);

// inisialisasi socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    // origin: ["http://localhost:5173", "https://b4d909a84363.ngrok-free.app"], // sesuaikan origin React
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// handle socket connection
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  // user join room (frontend harus emit 'join' setelah connect, with userId)
  socket.on("join", (userId) => {
    if (!userId) return;
    const room = `user_${userId}`;
    socket.join(room);
    console.log(`socket ${socket.id} joined room ${room}`);
  });

  // optional: auth with token (see section below)
  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

// start server
const PORT = process.env.APP_PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`));
