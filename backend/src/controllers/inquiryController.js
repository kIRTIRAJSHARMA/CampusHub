import asyncHandler from "../utils/asyncHandler.js";
import Inquiry from "../models/Inquiry.js";
import Product from "../models/Product.js";
import Room from "../models/Room.js";

const messagePreview = (message) => message.length > 140 ? `${message.slice(0, 140)}...` : message;

const isParticipant = (inquiry, userId) =>
  inquiry.sender.toString() === userId.toString() || inquiry.receiver.toString() === userId.toString();

const getOtherParticipant = (inquiry, userId) =>
  inquiry.sender.toString() === userId.toString() ? inquiry.receiver : inquiry.sender;

const getUnreadMessageCount = (inquiry, userId) => {
  const userIdText = userId.toString();
  const unreadMessages = inquiry.messages?.filter((message) => {
    const senderId = message.sender?._id || message.sender;
    const readByCurrentUser = message.readBy?.some((id) => (id?._id || id).toString() === userIdText);
    return senderId?.toString() !== userIdText && !readByCurrentUser;
  });

  if (unreadMessages?.length) return unreadMessages.length;
  return inquiry.unreadFor?.some((id) => (id?._id || id).toString() === userIdText) ? 1 : 0;
};

const markInquiryRead = async (inquiry, userId) => {
  inquiry.unreadFor = inquiry.unreadFor.filter((id) => id.toString() !== userId.toString());
  inquiry.messages = inquiry.messages.map((message) => {
    const alreadyRead = message.readBy?.some((id) => id.toString() === userId.toString());
    if (alreadyRead) return message;
    message.readBy = [...(message.readBy || []), userId];
    return message;
  });
  await inquiry.save();
  return inquiry;
};

const populateInquiry = (query) =>
  query
    .populate("sender receiver", "name avatar college role averageRating reviewCount")
    .populate("messages.sender", "name avatar")
    .populate("product", "title price images status")
    .populate("room", "title rent images publishStatus");

export const createInquiry = asyncHandler(async (req, res) => {
  const { product, room, message } = req.body;
  const cleanMessage = String(message || "").trim();

  if (cleanMessage.length < 10) {
    res.status(400);
    throw new Error("Message must be at least 10 characters");
  }

  const listing = product
    ? await Product.findById(product).select("seller status")
    : await Room.findById(room).select("owner publishStatus");

  if (!listing || listing.status === "archived" || listing.publishStatus === "archived") {
    res.status(404);
    throw new Error("Listing not found");
  }

  const receiver = product ? listing.seller : listing.owner;
  if (receiver.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot contact yourself on your own listing");
  }

  let inquiry = await Inquiry.findOne({
    $or: [
      { sender: req.user._id, receiver, ...(product ? { product } : { room }) },
      { sender: receiver, receiver: req.user._id, ...(product ? { product } : { room }) },
    ],
  });

  if (!inquiry) {
    inquiry = await Inquiry.create({
      sender: req.user._id,
      receiver,
      product,
      room,
      message: cleanMessage,
      messages: [{ sender: req.user._id, body: cleanMessage, readBy: [req.user._id] }],
      lastMessage: messagePreview(cleanMessage),
      lastMessageAt: new Date(),
      unreadFor: [receiver],
    });
  } else {
    inquiry.messages.push({ sender: req.user._id, body: cleanMessage, readBy: [req.user._id] });
    inquiry.message = cleanMessage;
    inquiry.lastMessage = messagePreview(cleanMessage);
    inquiry.lastMessageAt = new Date();
    inquiry.unreadFor = [getOtherParticipant(inquiry, req.user._id)];
    inquiry.status = "open";
    await inquiry.save();
  }

  inquiry = await populateInquiry(Inquiry.findById(inquiry._id));
  res.status(201).json(inquiry);
});

export const myInquiries = asyncHandler(async (req, res) => {
  const inquiries = await populateInquiry(
    Inquiry.find({ $or: [{ sender: req.user._id }, { receiver: req.user._id }] }).sort({ lastMessageAt: -1, createdAt: -1 })
  );
  res.json(inquiries);
});

export const addMessage = asyncHandler(async (req, res) => {
  const cleanMessage = String(req.body.message || "").trim();

  if (cleanMessage.length < 1) {
    res.status(400);
    throw new Error("Message cannot be empty");
  }

  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry || !isParticipant(inquiry, req.user._id)) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  inquiry.messages.push({ sender: req.user._id, body: cleanMessage, readBy: [req.user._id] });
  inquiry.message = cleanMessage;
  inquiry.lastMessage = messagePreview(cleanMessage);
  inquiry.lastMessageAt = new Date();
  inquiry.unreadFor = [getOtherParticipant(inquiry, req.user._id)];
  inquiry.status = "open";
  await inquiry.save();

  const populated = await populateInquiry(Inquiry.findById(inquiry._id));
  res.status(201).json(populated);
});

export const markRead = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry || !isParticipant(inquiry, req.user._id)) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  await markInquiryRead(inquiry, req.user._id);
  const populated = await populateInquiry(Inquiry.findById(inquiry._id));
  res.json(populated);
});

export const myNotifications = asyncHandler(async (req, res) => {
  const conversations = await populateInquiry(
    Inquiry.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      unreadFor: req.user._id,
    }).sort({ lastMessageAt: -1, createdAt: -1 }).limit(8)
  );

  const notifications = conversations.map((inquiry) => {
    const otherUser = inquiry.sender._id.toString() === req.user._id.toString() ? inquiry.receiver : inquiry.sender;
    const listing = inquiry.product || inquiry.room;
    return {
      id: inquiry._id,
      type: "message",
      count: getUnreadMessageCount(inquiry, req.user._id),
      title: `New message from ${otherUser?.name || "CampusHub user"}`,
      body: inquiry.lastMessage || inquiry.message,
      listingTitle: listing?.title || "CampusHub listing",
      createdAt: inquiry.lastMessageAt || inquiry.updatedAt,
      href: `/messages?thread=${inquiry._id}`,
    };
  });

  const unreadCount = conversations.reduce((total, inquiry) => total + getUnreadMessageCount(inquiry, req.user._id), 0);

  res.json({ unreadCount, notifications });
});
