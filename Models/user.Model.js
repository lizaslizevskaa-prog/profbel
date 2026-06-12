const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    gender: {
      type: String,
      enum: ["Мужской", "Женский", "Не указан"],
      default: "Не указан",
    },
    age: { type: Number, min: 14, max: 100 },
    education: { type: String, default: "Не указано" },
    avatar: { type: String, default: "default-avatar.png" },

    // НОВЫЕ ПОЛЯ ДЛЯ ПРОВЕРКИ ПОЧТЫ
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },

    favoriteProfessions: [{ type: Number }],
    testResults: [
      {
        date: { type: Date, default: Date.now },
        topProfessions: [{ type: String }],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
