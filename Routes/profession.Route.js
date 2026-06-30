const express = require("express");
const router = express.Router();
const Profession = require("../Models/profession.Model");
const jwt = require("jsonwebtoken");

const adminOnly = (req, res, next) => {
  try {
    req.userId = jwt.verify(
      req.headers.authorization?.split(" ")[1],
      process.env.JWT_SECRET,
    ).id;
    next();
  } catch {
    res.status(401).json({ message: "Ошибка" });
  }
};

router.get("/", async (req, res) => {
  res.json(await Profession.find());
});
router.get("/:id", async (req, res) => {
  res.json(await Profession.findById(req.params.id));
});
router.post("/", adminOnly, async (req, res) => {
  const p = new Profession(req.body);
  await p.save();
  res.status(201).json(p);
});
router.put("/:id", adminOnly, async (req, res) => {
  res.json(
    await Profession.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  );
});
router.delete("/:id", adminOnly, async (req, res) => {
  await Profession.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
});
// СЕКРЕТНЫЙ РОУТ ДЛЯ ЗАГРУЗКИ ПРОФЕССИЙ (Потом можно удалить)
router.post("/seed", async (req, res) => {
  try {
    // Получаем массив профессий, который ты отправишь
    const professionsArray = req.body;

    // Удаляем старые (если есть) и записываем новые
    await Profession.deleteMany({});
    await Profession.insertMany(professionsArray);

    res.json({ message: "УРА! Все профессии успешно загружены в базу!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка загрузки", error: err });
  }
});
module.exports = router;
