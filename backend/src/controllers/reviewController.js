import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const refreshRating = async (targetType, targetId) => {
  const reviews = await Review.find({ targetType, [targetType]: targetId }).select("rating");
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  const update = {
    averageRating: reviews.length ? Number((total / reviews.length).toFixed(1)) : 0,
    reviewCount: reviews.length,
  };

  if (targetType === "product") await Product.findByIdAndUpdate(targetId, update);
  if (targetType === "room") await Room.findByIdAndUpdate(targetId, update);
  if (targetType === "seller") await User.findByIdAndUpdate(targetId, update);
};

export const createReview = asyncHandler(async (req, res) => {
  const { targetType, targetId, rating, comment } = req.body;

  if (!["product", "room", "seller"].includes(targetType)) {
    res.status(400);
    throw new Error("Invalid review target");
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5 || !comment?.trim()) {
    res.status(400);
    throw new Error("Rating and written review are required");
  }

  const target = targetType === "product"
    ? await Product.findById(targetId).select("seller")
    : targetType === "room"
      ? await Room.findById(targetId).select("owner")
      : await User.findById(targetId).select("_id");

  if (!target) {
    res.status(404);
    throw new Error("Review target not found");
  }

  const review = await Review.findOneAndUpdate(
    { reviewer: req.user._id, targetType, [targetType]: targetId },
    {
      reviewer: req.user._id,
      targetType,
      [targetType]: targetId,
      seller: targetType === "product" ? target.seller : targetType === "room" ? target.owner : target._id,
      rating: numericRating,
      comment: comment.trim(),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("reviewer", "name avatar");

  await refreshRating(targetType, targetId);
  res.status(201).json(review);
});

export const listReviews = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;
  const reviews = await Review.find({ targetType, [targetType]: targetId })
    .populate("reviewer", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
});
