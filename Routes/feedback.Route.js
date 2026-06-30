const express = require("express");
const router = express.Router();
const Feedback = require("../Models/feedback.Model");
const nodemailer = require("nodemailer");

// Настройка почты для отправки через Gmail SMTP (на Vercel порты 465/587 полностью открыты)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post("/", async (req, res) => {
  const f = new Feedback(req.body);
  await f.save();
  res.json({ message: "Сообщение получено!" });
});
router.get("/", async (req, res) => {
  res.json(await Feedback.find().sort({ date: -1 }));
});

router.post("/reply/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Не найдено" });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // НА VERCEL ОБЯЗАТЕЛЕН AWAIT: без него безсерверная функция заморозится до того, как письмо уйдет
        await transporter.sendMail({
          from: `"ProfBel | Поддержка" <${process.env.EMAIL_USER}>`,
          to: feedback.userEmail,
          subject: "Ответ на ваше обращение - ProfBel",
          html: `<h3>Здравствуйте, ${feedback.userName}!</h3><p>Вы писали: <i>${feedback.message}</i></p><p><b>Ответ администратора:</b><br>${req.body.replyText}</p>`,
        });
        console.log("✅ Письмо с ответом поддержки успешно отправлено!");
      } catch (e) {
        console.error("❌ Ошибка отправки письма при ответе на обращение:", e);
      }
    }
    feedback.status = "replied";
    await feedback.save();
    res.json({ message: "Ответ отправлен на почту!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка отправки" });
  }
});

module.exports = router;
