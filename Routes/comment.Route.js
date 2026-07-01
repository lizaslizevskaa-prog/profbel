const express = require("express");
const router = express.Router();
const Comment = require("../Models/comment.Model");
const User = require("../Models/user.Model"); // Подключили юзера, чтобы брать email
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Настройка почты для отправки через Gmail SMTP (на Vercel порты 465/587 полностью открыты)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

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

// Получить все вопросы к истории (вместе с ответами)
router.get("/:storyId", async (req, res) => {
  try {
    res.json(
      await Comment.find({ storyId: req.params.storyId }).sort({ date: -1 }),
    );
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке" });
  }
});

// Отправить новый вопрос
router.post("/", protect, async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании вопроса" });
  }
});

// ==========================================
// ОТВЕТИТЬ НА КОММЕНТАРИЙ
// ==========================================
router.post("/:id/reply", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Комментарий не найден" });

    const reply = {
      userId: req.user.id,
      userName: req.body.userName,
      text: req.body.text,
      date: Date.now(),
    };

    comment.replies.push(reply);
    await comment.save();

    // Отправка уведомления автору оригинального комментария
    if (comment.userId !== req.user.id) {
      const originalUser = await User.findById(comment.userId);
      if (originalUser && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          await transporter.sendMail({
            from: `"ProfBel" <${process.env.EMAIL_USER}>`,
            to: originalUser.email,
            subject: "Новый ответ на ваш вопрос - ProfBel",
            html: `<div style="font-family: Arial; padding: 20px;">
                    <h3>Здравствуйте, ${originalUser.name}!</h3>
                    <p>Пользователь <b>${req.body.userName}</b> ответил на ваш вопрос в Историях успеха:</p>
                    <blockquote style="border-left: 4px solid #64ffda; padding: 10px; background: #f1f1f1; color: #333;">${comment.text}</blockquote>
                    <p><b>Ответ:</b> ${req.body.text}</p>
                    <p>Зайдите на сайт ProfBel, чтобы ответить!</p>
                   </div>`,
          });
          console.log("✅ Уведомление о ответе отправлено на", originalUser.email);
        } catch (e) {
          console.error("❌ Ошибка отправки уведомления:", e);
        }
      } else {
        console.warn("⚠️ Уведомление не отправлено: email не настроен или пользователь не найден");
      }
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при добавлении ответа" });
  }
});

// Удаление вопроса (и всех ответов к нему)
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

// Удаление конкретного ответа
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
