import express from "express";
import { mySavedListings, toggleSavedRoom, toggleWishlist, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/saved", protect, mySavedListings);
router.post("/wishlist/:productId", protect, toggleWishlist);
router.post("/saved-rooms/:roomId", protect, toggleSavedRoom);

export default router;
