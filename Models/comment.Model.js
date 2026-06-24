const mongoose = require("mongoose");

// Схема для ответов на комментарий
const ReplySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Схема основного комментария
const CommentSchema = new mongoose.Schema({
  storyId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [ReplySchema], // НОВОЕ: Массив ответов
});

module.exports = mongoose.model("Comment", CommentSchema);
