import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Room from "../models/Room.js";
import Payment from "../models/Payment.js";
import Inquiry from "../models/Inquiry.js";

dotenv.config();

const image = (url) => [{ url, publicId: "seed" }];

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Product.deleteMany(), Room.deleteMany(), Payment.deleteMany(), Inquiry.deleteMany()]);

  const seller = await User.create({
    name: "Aarav Sharma",
    email: "seller@campushub.in",
    password: "password123",
    role: "seller",
    college: "North City University",
  });

  const buyer = await User.create({
    name: "Ananya Rao",
    email: "buyer@campushub.in",
    password: "password123",
    role: "buyer",
    college: "North City University",
  });

  await Product.insertMany([
    {
      title: "Engineering Mathematics Bundle",
      category: "Books",
      price: 850,
      condition: "Good",
      location: "North City University",
      college: "North City University",
      description: "Semester-ready math books with highlighted formulas and clean notes.",
      seller: seller._id,
      featured: true,
      images: image("https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"),
    },
    {
      title: "Lenovo ThinkPad i5 Laptop",
      category: "Electronics",
      price: 24500,
      condition: "Like New",
      location: "Tech Park Hostel",
      college: "North City University",
      description: "Fast student laptop with SSD, charger, and clean battery backup.",
      seller: seller._id,
      featured: true,
      images: image("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"),
    },
  ]);

  await Room.insertMany([
    {
      title: "Premium Single Room Near Main Gate",
      type: "Room",
      rent: 8500,
      deposit: 12000,
      location: "Green Park, 700m from campus",
      college: "North City University",
      distance: "700m",
      availability: "Available now",
      description: "Bright furnished single room with meals, fast Wi-Fi, and quiet study hours.",
      amenities: ["Wi-Fi", "Laundry", "Meals", "Study Desk"],
      owner: seller._id,
      paymentStatus: "paid",
      publishStatus: "published",
      premium: true,
      promoted: true,
      images: image("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"),
    },
  ]);

  await Inquiry.create({
    sender: buyer._id,
    receiver: seller._id,
    message: "Is this available for a visit today?",
  });

  console.log("Seed data created.");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
