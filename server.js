require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Раздача статики (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ПОДКЛЮЧЕНИЕ API РОУТОВ
app.use("/api/auth", require("./Routes/auth.Route"));
app.use("/api/profile", require("./Routes/profile.Route"));
app.use("/api/comments", require("./Routes/comment.Route"));
app.use("/api/professions", require("./Routes/profession.Route"));
app.use("/api/stories", require("./Routes/story.Route"));
app.use("/api/feedback", require("./Routes/feedback.Route"));

// Подключение к базе данных MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ База данных успешно подключена!"))
  .catch((err) => console.error("❌ Ошибка БД:", err));

// ==========================================
// ЗАПУСК СЕРВЕРА (Адаптация для Vercel)
// ==========================================
// Если запускаем на локальном компьютере - слушаем порт
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`),
  );
}

// ЭТО ОБЯЗАТЕЛЬНО ДЛЯ VERCEL: Экспортируем приложение
module.exports = app;
