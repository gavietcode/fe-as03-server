import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import NodeMailer from "nodemailer";
import mailgen from "mailgen";
import { default as mongoose } from "mongoose";

export const createCart = async (req, res, next) => {
  const { user } = req;
  try {
    const reqData = req.body;

    if (user._id !== reqData.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to this order." });
    }
    await User.findByIdAndUpdate(reqData.user.userId, reqData.user);
    const newOrder = new Order({
      user: reqData.user,
      products: reqData.products,
      totalPrice: reqData.totalPrice,
    });

    await sendEmail(req.body, newOrder.orderTime);
    newOrder.save();
    console.log("sendmai");

    await Cart.findOneAndUpdate(
      {
        userId: reqData.user.userId,
      },
      {
        items: [],
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export const getAllOrder = async (req, res, next) => {
  const { user } = req;

  try {
    const foundOrders = await Order.find({ "user.userId": user._id });
    if (foundOrders) {
      res.json(foundOrders);
    }
  } catch (err) {
    next(err);
  }
};
export const getOrderById = async (req, res, next) => {
  const { user } = req;
  const { orderId } = req.body;
  try {
    const foundOrder = await Order.findOne({
      _id: orderId,
      "user.userId": user._id,
    });
    if (foundOrder) res.json(foundOrder);
  } catch (err) {
    next(err);
  }
};
