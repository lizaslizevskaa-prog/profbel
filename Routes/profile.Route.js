const express = require("express");
const router = express.Router();
const User = require("../Models/user.Model");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Модуль для работы с файловой системой

// 1. АВТОМАТИЧЕСКОЕ СОЗДАНИЕ ПАПКИ ДЛЯ АВАТАРОК
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Специальная функция: Проверка, авторизован ли пользователь (проверка токена)
const protect = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет авторизации" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Записываем ID юзера
    next();
  } catch (err) {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

// Настройка загрузки файлов (аватарок) через библиотеку multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Получить данные своего профиля
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновить анкету
router.put("/update", protect, async (req, res) => {
  try {
    const { name, gender, age, education } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, gender, age, education },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления" });
  }
});

// Загрузить аватар
router.post("/avatar", protect, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Файл не загружен" });
    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true },
    ).select("-password");
    res.json({ avatar: avatarUrl, user });
  } catch (err) {
    console.error("Ошибка загрузки аватара:", err);
    res.status(500).json({ message: "Ошибка сохранения файла на сервере" });
  }
});
// Сохранить результат теста
router.post("/test-result", protect, async (req, res) => {
  try {
    const { professions } = req.body; // Получаем массив названий профессий из теста

    const user = await User.findById(req.user.id);

    // Добавляем новый результат в начало массива
    user.testResults.unshift({ topProfessions: professions });

    // Оставляем только 3 последние попытки (как по ТЗ)
    if (user.testResults.length > 3) {
      user.testResults.pop();
    }

    await user.save();
    res.json({
      message: "Результат успешно сохранен в базу!",
      testResults: user.testResults,
    });
  } catch (err) {
    console.error("Ошибка сохранения теста:", err);
    res.status(500).json({ message: "Ошибка сохранения результата" });
  }
});
// Сохранить результат теста в БД
router.post("/test-result", protect, async (req, res) => {
  try {
    const { professions } = req.body;

    const user = await User.findById(req.user.id);

    // Добавляем новые результаты в начало массива
    user.testResults.unshift({ topProfessions: professions });

    // Оставляем только 3 последние попытки
    if (user.testResults.length > 3) {
      user.testResults.pop();
    }

    await user.save();
    res.json({ message: "Результат успешно сохранен в БД!" });
  } catch (err) {
    console.error("Ошибка сохранения теста:", err);
    res.status(500).json({ message: "Ошибка сохранения результата" });
  }
});
module.exports = router;
