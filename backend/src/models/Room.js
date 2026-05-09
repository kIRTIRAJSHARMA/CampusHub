import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Room", "PG", "Hostel", "Flat"], default: "Room" },
    rent: { type: Number, required: true, min: 0 },
    deposit: { type: Number, default: 0 },
    location: { type: String, required: true },
    college: { type: String, required: true },
    distance: { type: String, default: "" },
    availability: { type: String, default: "Available now" },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ url: String, publicId: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listingFee: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.2 },
    commissionAmount: { type: Number, default: 0 },
    ownerReceives: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    publishStatus: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    premium: { type: Boolean, default: false },
    promoted: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

roomSchema.index({ title: "text", description: "text", college: "text", location: "text" });

const Room = mongoose.model("Room", roomSchema);

export default Room;
