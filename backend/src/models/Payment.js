import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    listingType: { type: String, enum: ["product", "room"], default: "room" },
    purpose: { type: String, enum: ["listing", "checkout", "promotion"], default: "listing" },
    amount: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0 },
    commissionAmount: { type: Number, default: 0 },
    sellerReceives: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    provider: { type: String, enum: ["mock", "razorpay", "stripe"], default: "mock" },
    providerOrderId: { type: String, default: "" },
    providerPaymentId: { type: String, default: "" },
    status: { type: String, enum: ["created", "success", "failed"], default: "created" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
