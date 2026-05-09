import express from "express";
import { createRoomDraft, deleteRoom, getRoomById, getRooms, myRooms, updateRoom } from "../controllers/roomController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getRooms).post(protect, sellerOnly, createRoomDraft);
router.get("/mine", protect, sellerOnly, myRooms);
router.route("/:id").get(getRoomById).put(protect, sellerOnly, updateRoom).delete(protect, sellerOnly, deleteRoom);

export default router;
