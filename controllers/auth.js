import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import { validationResult, body } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";

export const register = async (req, res, next) => {
  try {
    const reqData = req.body;
    const valid = validationResult(req);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    if (!valid.isEmpty()) {
      res.send(valid);
    } else {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        fullname: reqData.fullname,
        email: reqData.email,
        password: hash,
        phone: reqData.phone,
        address: reqData.address,
      });
      const newCart = new Cart({ userId: newUser._id, items: [], total: 0 });

      newUser.save();
      newCart.save();
      res.status(201).json({
        message: "User has been created!.",
        token: newUser.signToken(),
      });
    }
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const reqData = req.body;
    const valid = validationResult(req);

    if (valid.isEmpty()) {
      const foundUser = await User.findOne({
        email: reqData.email,
      }).select("email password role");
      if (foundUser) {
        const isEqual = bcrypt.compare(reqData.password, foundUser.password);
        if (isEqual) {
          res.send({
            userId: foundUser._id,
            role: foundUser.role,
            token: foundUser.signToken(),
          });
        } else {
          res.send("Password wrong!.");
        }
      }
    } else {
      res.send("Email wrong!.");
    }
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const reqData = req.body;
    const valid = validationResult(req);

    if (valid.isEmpty()) {
      const foundUser = await User.findOne({
        email: reqData.email,
      }).select("email password role");
      if (foundUser) {
        const isEqual = bcrypt.compare(reqData.password, foundUser.password);
        if (isEqual) {
          if (foundUser.role === "admin" || foundUser.role === "consultant") {
            res.send({
              userId: foundUser._id,
              role: foundUser.role,
              token: foundUser.signToken(),
            });
          } else {
            res.status(401).send("You are not admin!");
          }
        } else {
          res.send("Password wrong!.");
        }
      }
    } else {
      res.send("Email wrong!.");
    }
  } catch (err) {
    next(err);
  }
};

// export const loginAdmin = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (!user) {
//       return next(createError(404, "User not found!."));
//     }
//     const isPasswordCorrect = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!isPasswordCorrect) {
//       return next(createError(404, "Wrong password or username!."));
//     }

//     const token = jwt.sign(
//       { id: user._id, isAdmin: user.isAdmin },
//       process.env.JWT
//     );

//     const { password, isAdmin, ...otherDetails } = user._doc;
//     if (isAdmin === false) {
//       return next(createError(404, "You are not admin!."));
//     }

//     res
//       .cookie("access_token", token, { httpOnly: true })
//       .status(200)
//       .json({ details: { ...otherDetails }, isAdmin, token });
//   } catch (err) {
//     next(err);
//   }
// };
