const express = require("express");
const router = express.Router();
const User = require("../Models/user.Model");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs"); // Подключили шифровальщик для паролей

// АВТОМАТИЧЕСКОЕ СОЗДАНИЕ ПАПКИ ДЛЯ АВАТАРОК
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Проверка авторизации
const protect = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет авторизации" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Получить данные профиля
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
    res.status(500).json({ message: "Ошибка сохранения файла на сервере" });
  }
});

// Сохранить результат теста в БД
router.post("/test-result", protect, async (req, res) => {
  try {
    const { professions } = req.body;
    const user = await User.findById(req.user.id);

    user.testResults.unshift({ topProfessions: professions });

    if (user.testResults.length > 3) {
      user.testResults.pop();
    }

    await user.save();
    res.json({ message: "Результат успешно сохранен в БД!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сохранения результата" });
  }
});

// ==========================================
// НОВОЕ: ИЗМЕНЕНИЕ ПАРОЛЯ ИЗ ПРОФИЛЯ
// ==========================================
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // 1. Проверяем, правильно ли введен старый (или временный) пароль
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный текущий пароль" });
    }

    // 2. Проверяем надежность нового пароля
    const passwordRegex = /^(?=.*[A-Za-zА-Яа-я])(?=.*\d)[A-Za-zА-Яа-я\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res
        .status(400)
        .json({
          message:
            "Новый пароль должен быть от 6 символов, содержать буквы и цифры",
        });
    }

    // 3. Шифруем и сохраняем
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Пароль успешно изменен!" });
  } catch (err) {
    console.error("Ошибка смены пароля:", err);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

module.exports = router;
