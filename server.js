require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// 1. НАСТРОЙКИ
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin.endsWith(".vercel.app") ||
        origin === "http://localhost:3000" ||
        origin === "http://localhost:5173"
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. РАЗДАЧА САЙТА (ИЗ ПАПКИ PUBLIC)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. API РОУТЫ (ВОТ ЭТОГО НЕ ХВАТАЛО СЕРВЕРУ!)
app.use("/api/auth", require("./Routes/auth.Route"));
app.use("/api/profile", require("./Routes/profile.Route"));
app.use("/api/comments", require("./Routes/comment.Route"));
app.use("/api/professions", require("./Routes/profession.Route"));
app.use("/api/stories", require("./Routes/story.Route"));
app.use("/api/feedback", require("./Routes/feedback.Route"));

// 4. БАЗА ДАННЫХ
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ База данных успешно подключена!"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// 5. ЗАПУСК
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
