import express from "express";
import { addMessage, createInquiry, markRead, myInquiries, myNotifications } from "../controllers/inquiryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, myInquiries).post(protect, createInquiry);
router.get("/notifications", protect, myNotifications);
router.post("/:id/messages", protect, addMessage);
router.put("/:id/read", protect, markRead);

export default router;
