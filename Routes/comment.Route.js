const express = require("express");
const router = express.Router();
const Comment = require("../Models/comment.Model");
const jwt = require("jsonwebtoken");

// Middleware для проверки авторизации
const protect = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Войдите в личный кабинет" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

// 1. Получить все вопросы к конкретной истории
router.get("/:storyId", async (req, res) => {
  try {
    const comments = await Comment.find({ storyId: req.params.storyId }).sort({
      date: -1,
    });
    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка сервера при загрузке комментариев" });
  }
});

// 2. Отправить новый вопрос
router.post("/", protect, async (req, res) => {
  try {
    const { storyId, text, userName } = req.body;
    const newComment = new Comment({
      storyId,
      text,
      userName,
      userId: req.user.id, // Записываем ID создателя, чтобы он мог удалить
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сохранения комментария" });
  }
});

// 3. Удалить свой комментарий
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Комментарий не найден" });

    // Проверяем, является ли пользователь владельцем этого комментария
    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Вы можете удалять только свои комментарии!" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Комментарий успешно удален!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении комментария" });
  }
});

module.exports = router;
