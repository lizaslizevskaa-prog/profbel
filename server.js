require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// 1. НАСТРОЙКИ ДОСТУПА
app.use(
  cors({
    origin: [
      "https://profbel-ib2s7e106-lizaslizevskaa-progs-projects.vercel.app",
      "https://profbel.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// РАЗРЕШАЕМ БОЛЬШИЕ ФАЙЛЫ (ДЛЯ КАРТИНОК BASE64)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. СЛУЖЕБНЫЕ ПАПКИ
app.use(express.static(path.join(__dirname, "public")));
// Оставим uploads на всякий случай, чтобы не ломался старый код
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. ПОДКЛЮЧЕНИЕ РОУТОВ
app.use(
  "https://profbel-production.up.railway.app/api/auth",
  require("./Routes/auth.Route"),
);
app.use(
  "https://profbel-production.up.railway.app/api/profile",
  require("./Routes/profile.Route"),
);
app.use(
  "https://profbel-production.up.railway.app/api/comments",
  require("./Routes/comment.Route"),
);
app.use(
  "https://profbel-production.up.railway.app/api/professions",
  require("./Routes/profession.Route"),
);
app.use(
  "https://profbel-production.up.railway.app/api/stories",
  require("./Routes/story.Route"),
);
app.use(
  "https://profbel-production.up.railway.app/api/feedback",
  require("./Routes/feedback.Route"),
);

// 4. ПОДКЛЮЧЕНИЕ К БАЗЕ
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ База данных успешно подключена!"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// 5. ЗАПУСК СЕРВЕРА
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
