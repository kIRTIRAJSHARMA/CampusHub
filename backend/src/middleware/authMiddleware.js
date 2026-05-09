import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  next();
});

export const sellerOnly = (req, res, next) => {
  if (req.user?.role !== "seller" && req.user?.role !== "admin") {
    res.status(403);
    next(new Error("Seller access required"));
    return;
  }
  next();
};
