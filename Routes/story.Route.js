const express = require("express");
const router = express.Router();
const Story = require("../Models/story.Model");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.Model");
const { sendMail } = require("../Utils/mailer");

const protect = (req, res, next) => {
  try {
    req.user = jwt.verify(
      req.headers.authorization?.split(" ")[1],
      process.env.JWT_SECRET,
    );
    next();
  } catch {
    res.status(401).json({ message: "Ошибка" });
  }
};

// ПОЛУЧИТЬ ОДОБРЕННЫЕ ИСТОРИИ
router.get("/approved", async (req, res) => {
  res.json(await Story.find({ status: "approved" }));
});

// ПОЛУЧИТЬ ИСТОРИИ НА МОДЕРАЦИЮ
router.get("/pending", protect, async (req, res) => {
  res.json(await Story.find({ status: "pending" }));
});

// ПОЛУЧИТЬ ОТКЛОНЁННЫЕ ИСТОРИИ
router.get("/rejected", protect, async (req, res) => {
  res.json(await Story.find({ status: "rejected" }));
});

// ОТПРАВИТЬ НОВУЮ ИСТОРИЮ
router.post("/submit", protect, async (req, res) => {
  const s = new Story({ ...req.body, userId: req.user.id, status: "pending" });
  await s.save();
  res.status(201).json({ message: "Отправлено на модерацию!" });
});

// ОДОБРИТЬ ИСТОРИЮ
router.put("/approve/:id", protect, async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });
  const user = await User.findById(story.userId);
  if (user && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      await sendMail({
        to: user.email,
        subject: "Ваша история опубликована!",
        html: `<h3>Поздравляем!</h3><p>Ваша история "<b>${story.name}</b>" успешно прошла модерацию и опубликована на сайте ProfBel.</p>`,
      });
    } catch (e) {
      console.error("Ошибка отправки письма при одобрении:", e);
    }
  }
  res.json({ message: "Одобрено" });
});

// ОТКЛОНИТЬ ИСТОРИЮ
router.put("/reject/:id", protect, async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, {
    status: "rejected",
  });
  const user = await User.findById(story.userId);
  if (user && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      await sendMail({
        to: user.email,
        subject: "История не прошла модерацию",
        html: `<h3>Уведомление от ProfBel</h3><p>Ваша история "<b>${story.name}</b>" не прошла модерацию.</p><p>Пожалуйста, отредактируйте и отправьте заново.</p>`,
      });
    } catch (e) {
      console.error("Ошибка отправки письма при отклонении:", e);
    }
  }
  res.json({ message: "Отклонено" });
});

// УДАЛИТЬ ИСТОРИЮ
router.delete("/:id", protect, async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
});

// СЕКРЕТНЫЙ РОУТ ДЛЯ ЗАГРУЗКИ ИСТОРИЙ
router.post("/seed", async (req, res) => {
  try {
    const storiesArray = req.body;

    // Удаляем старые и записываем новые со статусом approved
    await Story.deleteMany({});

    const storiesWithStatus = storiesArray.map((s) => ({
      name: s.name,
      profession: s.profession,
      education: "Не указано",
      shortText: s.shortText,
      fullText: s.fullText,
      photo: s.photo,
      status: "approved",
    }));

    await Story.insertMany(storiesWithStatus);
    res.json({ message: "Все истории успешно загружены в базу!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка загрузки", error: err.message });
  }
});

module.exports = router;
