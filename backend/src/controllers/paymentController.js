import asyncHandler from "../utils/asyncHandler.js";
import Payment from "../models/Payment.js";
import Room from "../models/Room.js";
import Product from "../models/Product.js";
import { calculateCommission } from "../utils/commerce.js";

export const createRoomPayment = asyncHandler(async (req, res) => {
  const { roomId, provider = "mock" } = req.body;
  const room = await Room.findOne({ _id: roomId, owner: req.user._id });

  if (!room) {
    res.status(404);
    throw new Error("Room draft not found");
  }

  const promoted = Boolean(room.promoted);
  const commission = calculateCommission(room.rent, "room", promoted);
  const payment = await Payment.create({
    user: req.user._id,
    room: room._id,
    listingType: "room",
    purpose: "listing",
    amount: room.listingFee || commission.commissionAmount,
    commissionRate: commission.commissionRate,
    commissionAmount: commission.commissionAmount,
    sellerReceives: commission.sellerReceives,
    provider,
    providerOrderId: `mock_order_${Date.now()}`,
  });

  res.status(201).json({ payment, amount: payment.amount, currency: "INR" });
});

export const confirmRoomPayment = asyncHandler(async (req, res) => {
  const { paymentId, success = true } = req.body;
  const payment = await Payment.findOne({ _id: paymentId, user: req.user._id });

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  payment.status = success ? "success" : "failed";
  payment.providerPaymentId = `mock_payment_${Date.now()}`;
  await payment.save();

  const room = await Room.findByIdAndUpdate(
    payment.room,
    {
      paymentStatus: success ? "paid" : "failed",
      publishStatus: success ? "published" : "draft",
      premium: success,
    },
    { new: true }
  );

  res.json({ payment, room });
});

export const createProductPayment = asyncHandler(async (req, res) => {
  const { productId, provider = "mock" } = req.body;
  const product = await Product.findOne({ _id: productId, seller: req.user._id });

  if (!product) {
    res.status(404);
    throw new Error("Product draft not found");
  }

  const promoted = Boolean(product.promoted);
  const commission = calculateCommission(product.price, "product", promoted);
  const payment = await Payment.create({
    user: req.user._id,
    product: product._id,
    listingType: "product",
    purpose: "listing",
    amount: product.listingFee || commission.commissionAmount,
    commissionRate: commission.commissionRate,
    commissionAmount: commission.commissionAmount,
    sellerReceives: commission.sellerReceives,
    provider,
    providerOrderId: `mock_order_${Date.now()}`,
  });

  res.status(201).json({ payment, amount: payment.amount, currency: "INR" });
});

export const confirmProductPayment = asyncHandler(async (req, res) => {
  const { paymentId, success = true } = req.body;
  const payment = await Payment.findOne({ _id: paymentId, user: req.user._id, listingType: "product" });

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  payment.status = success ? "success" : "failed";
  payment.providerPaymentId = `mock_payment_${Date.now()}`;
  await payment.save();

  const existingProduct = await Product.findById(payment.product).select("promoted");
  const product = await Product.findByIdAndUpdate(
    payment.product,
    {
      paymentStatus: success ? "paid" : "failed",
      status: success ? "active" : "draft",
      featured: success ? Boolean(existingProduct?.promoted) : false,
    },
    { new: true }
  );

  res.json({ payment, product });
});

export const createCheckoutPayment = asyncHandler(async (req, res) => {
  const { productId, roomId, provider = "mock", acceptedTerms } = req.body;

  if (!acceptedTerms) {
    res.status(400);
    throw new Error("Accept Terms & Conditions before making payments");
  }

  const listing = productId
    ? await Product.findOne({ _id: productId, status: "active" })
    : await Room.findOne({ _id: roomId, publishStatus: "published" });

  if (!listing) {
    res.status(404);
    throw new Error("Listing not found");
  }

  const listingType = productId ? "product" : "room";
  const amount = productId ? listing.price : listing.rent;
  const commission = calculateCommission(amount, listingType, listing.promoted);
  const payment = await Payment.create({
    user: req.user._id,
    product: productId,
    room: roomId,
    listingType,
    purpose: "checkout",
    amount,
    ...commission,
    provider,
    providerOrderId: `mock_order_${Date.now()}`,
  });

  res.status(201).json({ payment, amount, currency: "INR", ...commission });
});
