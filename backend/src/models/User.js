import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
    college: { type: String, trim: true },
    department: { type: String, trim: true, default: "" },
    year: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true },
    city: { type: String, trim: true, default: "" },
    hostelOrArea: { type: String, trim: true, default: "" },
    sellerType: { type: String, enum: ["student", "property-owner", "pg-manager", ""], default: "" },
    preferredCategories: [{ type: String }],
    avatar: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: "" },
    acceptedTermsAt: { type: Date },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    savedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, refPath: "recentlyViewedModel" }],
    recentlyViewedModel: { type: String, enum: ["Product", "Room"] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
