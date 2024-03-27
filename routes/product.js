import express from "express";
import {
  deleteProduct,
  getAllProduct,
  getProductDetail,
  postAddProduct,
  postEditProduct,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();
router.post("/", postAddProduct);
router.get("/all", getAllProduct);
router.get("/detail/:id", getProductDetail);
router.post("/edit-product", postEditProduct);
// Update
router.put("/:id", updateProduct);

// Delete
router.delete("/:id", deleteProduct);

export default router;
