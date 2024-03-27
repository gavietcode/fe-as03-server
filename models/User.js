import mongoose from "mongoose";
import { createJWT } from "../utils/jsonwebtoken.js";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    default: "Hanoi",
  },
  role: {
    type: String,
    enum: ["customer", "admin", "consultant"],
    default: "customer",
  },
});

UserSchema.methods.signToken = function () {
  const token = createJWT(this._id, this.email, this.role);
  return token;
};

export default mongoose.model("User", UserSchema);
