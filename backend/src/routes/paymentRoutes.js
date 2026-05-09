import express from "express";
import { confirmProductPayment, confirmRoomPayment, createCheckoutPayment, createProductPayment, createRoomPayment } from "../controllers/paymentController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/room-listing", protect, sellerOnly, createRoomPayment);
router.post("/room-listing/confirm", protect, sellerOnly, confirmRoomPayment);
router.post("/product-listing", protect, sellerOnly, createProductPayment);
router.post("/product-listing/confirm", protect, sellerOnly, confirmProductPayment);
router.post("/checkout", protect, createCheckoutPayment);

export default router;
