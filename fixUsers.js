require("dotenv").config();
const mongoose = require("mongoose");

// Описание схемы (чтобы скрипт понимал, что менять)
const UserSchema = new mongoose.Schema({
  email: String,
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

async function runFix() {
  try {
    // 1. Подключаемся к вашей базе (локальной или облачной из .env)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Подключено к базе для исправления пользователей...");

    // 2. Всем пользователям, у которых нет поля isVerified, ставим true
    const result = await User.updateMany(
      { isVerified: { $exists: false } },
      { $set: { isVerified: true } },
    );

    // 3. Дополнительно подтверждаем всех существующих
    await User.updateMany({}, { $set: { isVerified: true } });

    console.log(
      `✅ Исправлено пользователей: ${result.matchedCount}. Теперь все старые аккаунты могут входить!`,
    );
    process.exit();
  } catch (err) {
    console.error("❌ Ошибка при исправлении:", err);
    process.exit(1);
  }
}

runFix();
