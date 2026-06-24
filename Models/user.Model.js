const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    gender: { type: String, default: "Не указан" },
    age: { type: Number, min: 14, max: 100 }, // Жесткое ограничение возраста
    education: { type: String, default: "Не указано" },
    avatar: { type: String, default: "default-avatar.png" },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },

    // ИСПРАВЛЕНО: Теперь это String, чтобы сохранять ID из MongoDB
    favoriteProfessions: [{ type: String }],

    testResults: [
      { date: { type: Date, default: Date.now }, topProfessions: [String] },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
