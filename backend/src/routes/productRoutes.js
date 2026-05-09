import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, myProducts, updateProduct } from "../controllers/productController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, sellerOnly, createProduct);
router.get("/mine/listings", protect, sellerOnly, myProducts);
router.route("/:id").get(getProductById).put(protect, sellerOnly, updateProduct).delete(protect, sellerOnly, deleteProduct);

export default router;
