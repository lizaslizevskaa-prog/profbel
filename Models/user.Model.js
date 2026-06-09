const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Пожалуйста, введите корректный email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Пароль должен содержать минимум 6 символов"],
    },

    // ==========================================
    // НОВОЕ: РОЛЬ ПОЛЬЗОВАТЕЛЯ (АДМИН ИЛИ ЮЗЕР)
    // ==========================================
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // По умолчанию все обычные пользователи
    },

    gender: {
      type: String,
      enum: ["Мужской", "Женский", "Не указан"],
      default: "Не указан",
    },
    age: {
      type: Number,
      min: [14, "Возраст не может быть меньше 14 лет"],
      max: [100, "Возраст не может быть больше 100 лет"],
    },
    education: {
      type: String,
      default: "Не указано",
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    favoriteProfessions: [
      {
        type: Number,
      },
    ],
    testResults: [
      {
        date: { type: Date, default: Date.now },
        topProfessions: [{ type: String }],
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
