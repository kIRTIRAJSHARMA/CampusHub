import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { calculateCommission } from "../utils/commerce.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { category, condition, location, search, minPrice, maxPrice } = req.query;
  const query = { status: "active" };

  if (category && category !== "All") query.category = category;
  if (condition) query.condition = condition;
  if (location) query.location = new RegExp(location, "i");
  if (search) query.$text = { $search: search };
  if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };

  const products = await Product.find(query).populate("seller", "name college avatar averageRating reviewCount").sort({ promoted: -1, featured: -1, createdAt: -1 });
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate("seller", "name college avatar phone averageRating reviewCount");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const reviews = await Review.find({ product: product._id }).populate("reviewer", "name avatar").sort({ createdAt: -1 });
  res.json({ ...product.toObject(), reviews });
});

export const myProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, status: { $ne: "archived" } }).sort({ createdAt: -1 });
  res.json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.acceptedTerms) {
    res.status(400);
    throw new Error("Accept Terms & Conditions before saving a listing");
  }

  const promoted = Boolean(req.body.promoted);
  const commission = calculateCommission(req.body.price, "product", promoted);
  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
    featured: promoted,
    promoted,
    listingFee: commission.commissionAmount,
    status: "draft",
    paymentStatus: "pending",
    ...commission,
  });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const ownership = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, seller: req.user._id };
  const existing = await Product.findOne(ownership);
  if (!existing) {
    res.status(404);
    throw new Error("Product not found or not owned by you");
  }
  const promoted = req.body.promoted ?? existing.promoted;
  const price = req.body.price ?? existing.price;
  const commission = calculateCommission(price, "product", promoted);
  const product = await Product.findByIdAndUpdate(existing._id, { ...req.body, featured: promoted, promoted, listingFee: commission.commissionAmount, ...commission }, { new: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found or not owned by you");
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const ownership = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, seller: req.user._id };
  const product = await Product.findOneAndUpdate(ownership, { status: "archived" }, { new: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found or not owned by you");
  }
  res.json({ message: "Product archived" });
});
