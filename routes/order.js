import express from "express";
import { currentUser } from "../middlewares/auth.js";
import {
  createOrder,
  getAllOrder,
  getBalance,
  getCountOrders,
  getEarning,
  getOrderById,
} from "../controllers/order.js";

const router = express.Router();

router.post("/create", currentUser, createOrder);
router.get("/getallorder", currentUser, getAllOrder);
router.get("/getorderbyid/:id", currentUser, getOrderById);
router.get("/countOrders", getCountOrders);
router.get("/earning", getEarning);
router.get("/balance", getBalance);

export default router;
