import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    message: { type: String, required: true },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        body: { type: String, required: true, trim: true },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    unreadFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

inquirySchema.index({ sender: 1, receiver: 1, product: 1 });
inquirySchema.index({ sender: 1, receiver: 1, room: 1 });
inquirySchema.index({ receiver: 1, unreadFor: 1, lastMessageAt: -1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
