import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import mailgen from "mailgen";
import { default as mongoose } from "mongoose";

export const handleMailContent = (data, sendTime) => {
  const _sendTime =
    sendTime.getHours() +
    ":" +
    sendTime.getMinutes() +
    " " +
    sendTime.getDate() +
    "/" +
    sendTime.getMonth() +
    "/" +
    sendTime.getFullYear();

  let mailContent = {
    body: {
      name: `${data.user.fullname}`,
      intro: `"Order time:  ${_sendTime}"`,
      table: {
        data: data.products.map((item) => {
          return {
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          };
        }),
      },
      outro: `Total: ${data.totalPrice} VND`,
    },
  };
  return mailContent;
};

export const sendEmail = async (data, sendTime) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "uocbds1369@gmail.com", pass: "onup ntdd ergb mzmo" },
  });

  const mailGenerate = new mailgen({
    theme: "default",
    product: { name: "Eco-Shop", link: "https://mailgen.js/" },
  });

  const mailContent = handleMailContent(data, sendTime);
  const mail = mailGenerate.generate(mailContent);

  transport
    .sendMail({
      from: "uocbds1369@gmail.com",
      to: "uocbds1369@gmail.com",
      subject: "Order",
      html: mail,
    })
    .then((res) => console.log("Send Email Successfully!"))
    .catch((err) => console.error(err));
};

export const createOrder = async (req, res, next) => {
  const { user } = req;
  try {
    const reqData = req.body;

    if (user._id !== reqData.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to this order." });
    }

    await User.findByIdAndUpdate(user, reqData.user);

    const newOrder = new Order({
      user: reqData.user,
      products: reqData.products,
      totalPrice: reqData.totalPrice,
      delivery: "Waiting for delivery...",
    });

    await sendEmail(req.body, newOrder.orderTime);
    newOrder.save();
    console.log("sendmailed");

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
    const foundOrders = await Order.find(user.params_id);
    if (foundOrders) {
      res.json(foundOrders);
    }
  } catch (err) {
    next(err);
  }
};
export const getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const detail = await Order.findById(id);
    if (detail != null) {
      res.json(detail);
    } else {
      res.send({ message: "Order not found!." });
    }
  } catch (err) {
    next(err);
  }

  // const { user } = req;
  // const { orderId } = req.body;
  // try {
  //   const foundOrder = await Order.findOne({
  //     _id: orderId,
  //     "user.userId": user._id,
  //   });
  //   if (foundOrder) res.json(foundOrder);
  // } catch (err) {
  //   next(err);
  // }
};

export const getCountOrders = async (req, res, next) => {
  try {
    const countOrders = await Order.countDocuments();
    res.status(200).json(countOrders);
  } catch (err) {
    next(err);
  }
};

export const getEarning = async (req, res, next) => {
  const countOrders = await Order.find();
  try {
    const earning = countOrders.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    res.status(200).json(earning);
  } catch (err) {
    next(err);
  }
};

export const getBalance = async (req, res, next) => {
  const countOrders = await Order.find();
  try {
    const earning = countOrders.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    const balance = earning / countOrders.length;

    res.status(200).json(balance);
  } catch (err) {
    next(err);
  }
};
