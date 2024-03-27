import express from "express";
import { currentUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", currentUser, createOrder);

router.get("/getallorder", currentUser, getAllOrder);
router.get("/getorderbyid", currentUser, getOrderById);

export default router;
