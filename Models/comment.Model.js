const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  storyId: { type: Number, required: true }, // ID истории успеха из data.js
  userId: { type: String, required: true }, // ID пользователя, который оставил комментарий
  userName: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
