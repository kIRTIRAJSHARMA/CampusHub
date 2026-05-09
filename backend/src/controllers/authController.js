import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  college: user.college,
  department: user.department,
  year: user.year,
  phone: user.phone,
  city: user.city,
  hostelOrArea: user.hostelOrArea,
  sellerType: user.sellerType,
  avatar: user.avatar,
  acceptedTermsAt: user.acceptedTermsAt,
  averageRating: user.averageRating,
  reviewCount: user.reviewCount,
});

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    college,
    department,
    year,
    phone,
    city,
    hostelOrArea,
    sellerType,
    preferredCategories,
    avatar,
    acceptedTerms,
  } = req.body;

  if (!acceptedTerms) {
    res.status(400);
    throw new Error("You must accept the Terms & Conditions to register");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    college,
    department,
    year,
    phone,
    city,
    hostelOrArea,
    sellerType,
    preferredCategories,
    avatar,
    acceptedTermsAt: new Date(),
  });

  res.status(201).json({
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { credential, role = "buyer", acceptedTerms } = req.body;

  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500);
    throw new Error("Google OAuth is not configured on the server");
  }

  if (!credential) {
    res.status(400);
    throw new Error("Google credential is required");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email?.toLowerCase();

  if (!email || !payload.email_verified) {
    res.status(401);
    throw new Error("Google email is not verified");
  }

  let user = await User.findOne({ email });

  if (!user) {
    if (!acceptedTerms) {
      res.status(400);
      throw new Error("You must accept the Terms & Conditions to register");
    }

    user = await User.create({
      name: payload.name || email.split("@")[0],
      email,
      password: `google_${payload.sub}_${Date.now()}`,
      role: role === "seller" ? "seller" : "buyer",
      avatar: payload.picture || "",
      authProvider: "google",
      googleId: payload.sub,
      acceptedTermsAt: new Date(),
    });
  } else {
    user.authProvider = user.authProvider === "local" ? "local" : "google";
    user.googleId = user.googleId || payload.sub;
    user.avatar = payload.picture || user.avatar || "";
    await user.save();
  }

  res.json({
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
