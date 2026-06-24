const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "new" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
