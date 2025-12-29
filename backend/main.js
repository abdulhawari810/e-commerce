import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";
import cartRouter from "./router/cartRouter.js";
import colorsRouter from "./router/colorsRouter.js";
import productRouter from "./router/productRouter.js";
import whislistRouter from "./router/whislistRouter.js";
import activityRouter from "./router/activityRouter.js";
import sizeRouter from "./router/sizeRouter.js";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import orderRouter from "./router/orderRouter.js";

dotenv.config();

const app = express();

(async () => {
  db.sync();
})();

app.use(
  cors({
    origin: ["*", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESS_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(userRouter);
app.use(authRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(colorsRouter);
app.use(whislistRouter);
app.use(activityRouter);
app.use(sizeRouter);
app.use(orderRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const userSocket = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    userSocket[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    for (const userId in userSocket) {
      if (userSocket[userId] === socket.id) {
        delete userSocket[userId];
      }
    }
  });
});

server.listen(process.env.APP_PORT, () => console.log("server up and running"));

export { io, userSocket };

export default server;
