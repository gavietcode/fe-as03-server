import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import NodeMailer from "nodemailer";
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
  const transport = NodeMailer.createTransport({
    service: "gmail",
    auth: { user: "uocbds1369@gmail.com", pass: "keo05092012" },
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
      subject: "Xác nhận đơn hàng",
      html: mail,
    })
    .then((res) => console.log("Send Email Successfully!"))
    .catch((err) => console.error(err));
};

export const createOrder = async (req, res, next) => {
  const { user } = req;
  try {
    const reqData = req.body;
    console.log(user._id, reqData.user);
    if (user._id !== reqData.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to this order." });
    }

    console.log(reqData.user.userId);
    await User.findByIdAndUpdate(reqData.user.userId, reqData.user);

    const newOrder = new Order({
      user: reqData.user,
      products: reqData.products,
      totalPrice: reqData.totalPrice,
    });
    console.log(newOrder);

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
