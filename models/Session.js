const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  name: String,
  colorHex: String,
  colorName: String,
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date, default: null },
  lastSeen: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
});

module.exports = mongoose.model("Session", sessionSchema);