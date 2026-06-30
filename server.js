require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// 1. НАСТРОЙКИ (Middleware)
app.use(cors()); // Разрешает фронтенду делать запросы к бекенду
app.use(express.json());

// 2. РАБОТА С ФАЙЛАМИ
// Раздача статики (если у тебя есть папки public и uploads в проекте)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. API РОУТЫ
app.use("/api/auth", require("./Routes/auth.Route"));
app.use("/api/profile", require("./Routes/profile.Route"));
app.use("/api/comments", require("./Routes/comment.Route"));
app.use("/api/professions", require("./Routes/profession.Route"));
app.use("/api/stories", require("./Routes/story.Route"));
app.use("/api/feedback", require("./Routes/feedback.Route"));

// 4. ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ
// Используем переменную MONGO_URI, которую ты настроил в Railway
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ База данных успешно подключена!"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// 5. ЗАПУСК СЕРВЕРА
// Railway сам передает номер порта через переменную окружения PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер успешно запущен на порту ${PORT}`);
});
