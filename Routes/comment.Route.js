const express = require("express");
const router = express.Router();
const Comment = require("../Models/comment.Model");
const User = require("../Models/user.Model");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../Utils/mailer");

const protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Войдите в личный кабинет" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

router.get("/:storyId", async (req, res) => {
  try {
    res.json(await Comment.find({ storyId: req.params.storyId }).sort({ date: -1 }));
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании вопроса" });
  }
});

router.post("/:id/reply", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Комментарий не найден" });

    const reply = {
      userId: req.user.id,
      userName: req.body.userName,
      text: req.body.text,
      date: Date.now(),
    };

    comment.replies.push(reply);
    await comment.save();

    if (comment.userId !== req.user.id && process.env.GOOGLE_REFRESH_TOKEN) {
      const originalUser = await User.findById(comment.userId);
      if (originalUser) {
        sendMail({
          to: originalUser.email,
          subject: "Новый ответ на ваш вопрос - ProfBel",
          html: `<div style="font-family:Arial;padding:20px;">
            <h3>Здравствуйте, ${originalUser.name}!</h3>
            <p>Пользователь <b>${req.body.userName}</b> ответил на ваш вопрос:</p>
            <blockquote style="border-left:4px solid #64ffda;padding:10px;background:#f1f1f1;color:#333;">${comment.text}</blockquote>
            <p><b>Ответ:</b> ${req.body.text}</p>
            <p>Зайдите на сайт ProfBel, чтобы посмотреть!</p>
          </div>`,
        }).catch((e) => console.error("❌ Ошибка уведомления:", e));
      }
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при добавлении ответа" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Не найдено" });
    const userObj = await User.findById(req.user.id);
    const isAdmin = userObj && userObj.role === "admin";
    if (comment.userId !== req.user.id && !isAdmin)
      return res.status(403).json({ message: "Нет прав" });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
});

router.delete("/:id/reply/:replyId", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Не найдено" });
    const reply = comment.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Ответ не найден" });
    const userObj = await User.findById(req.user.id);
    const isAdmin = userObj && userObj.role === "admin";
    if (reply.userId !== req.user.id && !isAdmin)
      return res.status(403).json({ message: "Нет прав" });
    comment.replies.pull(req.params.replyId);
    await comment.save();
    res.json({ message: "Ответ удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка" });
  }
});

module.exports = router;
