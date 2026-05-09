import asyncHandler from "../utils/asyncHandler.js";
import Room from "../models/Room.js";
import Review from "../models/Review.js";
import { calculateCommission } from "../utils/commerce.js";

export const getRooms = asyncHandler(async (req, res) => {
  const { college, location, type, maxRent, available } = req.query;
  const query = { publishStatus: "published" };

  if (college) query.college = new RegExp(college, "i");
  if (location) query.location = new RegExp(location, "i");
  if (type) query.type = type;
  if (maxRent) query.rent = { $lte: Number(maxRent) };
  if (available) query.availability = new RegExp(available, "i");

  const rooms = await Room.find(query).populate("owner", "name college avatar phone averageRating reviewCount").sort({ promoted: -1, premium: -1, createdAt: -1 });
  res.json(rooms);
});

export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate("owner", "name college avatar phone averageRating reviewCount");
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  const reviews = await Review.find({ room: room._id }).populate("reviewer", "name avatar").sort({ createdAt: -1 });
  res.json({ ...room.toObject(), reviews });
});

export const createRoomDraft = asyncHandler(async (req, res) => {
  if (!req.body.acceptedTerms) {
    res.status(400);
    throw new Error("Accept Terms & Conditions before listing a room");
  }

  const promoted = Boolean(req.body.promoted);
  const commission = calculateCommission(req.body.rent, "room", promoted);
  const room = await Room.create({
    ...req.body,
    owner: req.user._id,
    paymentStatus: "pending",
    publishStatus: "draft",
    listingFee: commission.commissionAmount,
    commissionRate: commission.commissionRate,
    commissionAmount: commission.commissionAmount,
    ownerReceives: commission.sellerReceives,
    promoted,
  });
  res.status(201).json(room);
});

export const updateRoom = asyncHandler(async (req, res) => {
  const ownership = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
  const existing = await Room.findOne(ownership);
  if (!existing) {
    res.status(404);
    throw new Error("Room not found or not owned by you");
  }
  const promoted = req.body.promoted ?? existing.promoted;
  const rent = req.body.rent ?? existing.rent;
  const commission = calculateCommission(rent, "room", promoted);
  const room = await Room.findByIdAndUpdate(
    existing._id,
    {
      ...req.body,
      promoted,
      listingFee: commission.commissionAmount,
      commissionRate: commission.commissionRate,
      commissionAmount: commission.commissionAmount,
      ownerReceives: commission.sellerReceives,
    },
    { new: true }
  );
  if (!room) {
    res.status(404);
    throw new Error("Room not found or not owned by you");
  }
  res.json(room);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const ownership = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
  const room = await Room.findOneAndUpdate(ownership, { publishStatus: "archived" }, { new: true });
  if (!room) {
    res.status(404);
    throw new Error("Room not found or not owned by you");
  }
  res.json({ message: "Room archived" });
});

export const myRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ owner: req.user._id, publishStatus: { $ne: "archived" } }).sort({ createdAt: -1 });
  res.json(rooms);
});
