const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profession: { type: String, required: true },
    education: { type: String, required: true },
    shortText: { type: String, required: true },
    fullText: { type: String, required: true },
    photo: {
      type: String,
      default: "https://randomuser.me/api/portraits/lego/1.jpg",
    },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Story", StorySchema);
