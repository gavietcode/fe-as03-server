import express from "express";
import { login, loginAdmin, register } from "../controllers/auth.js";
import { body } from "express-validator";

const router = express.Router();

// Validators for registration
const registrationValidators = [
  body("fullname").notEmpty().withMessage("Full Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 9 })
    .withMessage("Password must be at least 9 characters long"),
  body("phone").notEmpty().withMessage("Phone is required"),
];

// Validators for login
const loginValidators = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registrationValidators, register);
router.post("/login", loginValidators, login);
router.post("/admin/login", loginValidators, loginAdmin);

export default router;
