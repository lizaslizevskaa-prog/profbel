const express = require("express");
const router = express.Router();
const User = require("../Models/user.Model");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcryptjs");

// Проверка авторизации
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет авторизации" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

// НАСТРОЙКА ДЛЯ VERCEL: Храним файл в оперативной памяти, а не на диске!
const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", protect, async (req, res) => {
  res.json(await User.findById(req.user.id).select("-password"));
});

router.put("/update", protect, async (req, res) => {
  res.json(
    await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select(
      "-password",
    ),
  );
});

// НОВАЯ ЗАГРУЗКА АВАТАРКИ (В ФОРМАТЕ ТЕКСТА BASE64)
router.post("/avatar", protect, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Файл не загружен" });

    // Превращаем картинку в текстовую строку Base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Сохраняем эту строку прямо в MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: base64Image },
      { new: true },
    ).select("-password");

    res.json({ avatar: base64Image, user });
  } catch (err) {
    console.error("Ошибка загрузки аватара:", err);
    res.status(500).json({ message: "Ошибка сохранения аватара" });
  }
});

router.post("/test-result", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.testResults.unshift({ topProfessions: req.body.professions });
  if (user.testResults.length > 3) user.testResults.pop();
  await user.save();
  res.json({ message: "Сохранено" });
});

router.post("/favorites", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  const profId = String(req.body.profId);
  const index = user.favoriteProfessions.indexOf(profId);
  if (index === -1) user.favoriteProfessions.push(profId);
  else user.favoriteProfessions.splice(index, 1);
  await user.save();
  res.json({ message: "Обновлено", favorites: user.favoriteProfessions });
});

router.put("/change-password", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!(await bcrypt.compare(req.body.currentPassword, user.password)))
    return res.status(400).json({ message: "Неверный текущий пароль" });
  const passwordRegex = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(req.body.newPassword))
    return res.status(400).json({ message: "Слабый пароль" });
  user.password = await bcrypt.hash(req.body.newPassword, 10);
  await user.save();
  res.json({ message: "Пароль изменен!" });
});

module.exports = router;
