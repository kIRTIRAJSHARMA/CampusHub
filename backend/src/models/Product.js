import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Books", "Electronics", "Cycles", "Furniture", "Gadgets", "Notes", "Hostel Essentials"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ["New", "Like New", "Good", "Fair"], default: "Good" },
    location: { type: String, required: true },
    college: { type: String, default: "" },
    description: { type: String, required: true },
    images: [{ url: String, publicId: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "sold", "draft", "archived"], default: "active" },
    featured: { type: Boolean, default: false },
    promoted: { type: Boolean, default: false },
    listingFee: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.1 },
    commissionAmount: { type: Number, default: 0 },
    sellerReceives: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", category: "text", location: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
