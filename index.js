import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import productsRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import bodyParser from "body-parser";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";
import multer from "multer";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to booking data of MongoDB");
  } catch (error) {
    throw error;
  }
};

//MongoDB is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB is disconnected!.");
});

// Try to connect mongodb
mongoose.connection.on("connected", () => {
  console.log("MongoDB is disconnected!.");
});

app.enable("trust proxy", 1);

// app.use(
//   cors({
//     origin: true,
//     methods: ["GET, POST, PUT, PATH, DELETE, OPTIONS"],
//     credentials: true,
//   })
// );

app.get("/", (req, res, next) => {
  try {
    res.json({ status: 200, message: "Get data success!." });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server errer!");
  }
});

// Middleware
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
// app.use("/api/cart", usersRoute);
app.use("/api/orders", orderRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

// Check error Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Somthing went wrong!.";
  return res.status(errorStatus).json({
    success: false,
    status: errorMessage,
    stack: err.stack,
  });
});

app.listen(5000, () => {
  connect(); // When sever run, it will connect to mongodb
  console.log("Server running on port: 5000...");
});
