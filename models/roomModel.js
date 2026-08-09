const mongoose = require("mongoose");

// Define the Item schema
const messagesSchema = new mongoose.Schema({
  ownerName: String,
  message: String,
  createdAt: { type: Date, default: Date.now() },
});

// Define the Order schema
const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  messages: [messagesSchema],
});

// Create the Order model
const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
