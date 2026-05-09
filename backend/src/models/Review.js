import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetType: { type: String, enum: ["product", "room", "seller"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 600 },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewer: 1, product: 1 }, { unique: true, sparse: true });
reviewSchema.index({ reviewer: 1, room: 1 }, { unique: true, sparse: true });
reviewSchema.index(
  { reviewer: 1, seller: 1, targetType: 1 },
  { unique: true, partialFilterExpression: { targetType: "seller" } }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
