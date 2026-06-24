const express = require("express");
const router = express.Router();
const User = require("../Models/user.Model");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
      cb(
        null,
        `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`,
      ),
  }),
});

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

router.post("/avatar", protect, upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Файл не загружен" });
  const avatarUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarUrl },
    { new: true },
  ).select("-password");
  res.json({ avatar: avatarUrl, user });
});

router.post("/test-result", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.testResults.unshift({ topProfessions: req.body.professions });
  if (user.testResults.length > 3) user.testResults.pop();
  await user.save();
  res.json({ message: "Сохранено" });
});

// ИСПРАВЛЕНО: Избранное (перевод ID в строку)
router.post("/favorites", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profId = String(req.body.profId);
    const index = user.favoriteProfessions.indexOf(profId);
    if (index === -1) user.favoriteProfessions.push(profId);
    else user.favoriteProfessions.splice(index, 1);
    await user.save();
    res.json({ message: "Обновлено", favorites: user.favoriteProfessions });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
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
