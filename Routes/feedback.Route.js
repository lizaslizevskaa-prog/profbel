const express = require("express");
const router = express.Router();
const Feedback = require("../Models/feedback.Model");
const { sendMail } = require("../Utils/mailer");

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

    if (process.env.GOOGLE_REFRESH_TOKEN) {
      const sent = await sendMail({
        to: feedback.userEmail,
        subject: "Ответ на ваше обращение - ProfBel",
        html: `<h3>Здравствуйте, ${feedback.userName}!</h3><p>Вы писали: <i>${feedback.message}</i></p><p><b>Ответ администратора:</b><br>${req.body.replyText}</p>`,
      });
      if (!sent) {
        console.error("❌ Не удалось отправить ответ на обращение");
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
