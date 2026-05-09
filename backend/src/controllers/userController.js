import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "college", "department", "year", "phone", "city", "hostelOrArea", "sellerType", "avatar"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
  res.json(user);
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const exists = user.wishlist.some((id) => id.toString() === req.params.productId);
  user.wishlist = exists ? user.wishlist.filter((id) => id.toString() !== req.params.productId) : [...user.wishlist, req.params.productId];
  await user.save();
  res.json({ wishlist: user.wishlist });
});

export const toggleSavedRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const exists = user.savedRooms.some((id) => id.toString() === req.params.roomId);
  user.savedRooms = exists ? user.savedRooms.filter((id) => id.toString() !== req.params.roomId) : [...user.savedRooms, req.params.roomId];
  await user.save();
  res.json({ savedRooms: user.savedRooms });
});

export const mySavedListings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({ path: "wishlist", match: { status: "active" }, populate: { path: "seller", select: "name college avatar" } })
    .populate({ path: "savedRooms", match: { publishStatus: "published" }, populate: { path: "owner", select: "name college avatar" } });

  res.json({ wishlist: user.wishlist, savedRooms: user.savedRooms });
});
