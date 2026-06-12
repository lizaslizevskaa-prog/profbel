require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Раздача файлов сайта из папки public
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Подключение API роутов
app.use("/api/auth", require("./Routes/auth.Route"));
app.use("/api/profile", require("./Routes/profile.Route"));
app.use("/api/comments", require("./Routes/comment.Route")); // Подключили комментарии!

// Подключение к базе данных MongoDB
console.log("ЧТО ВИДИТ СЕРВЕР:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ База данных успешно подключена!"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
