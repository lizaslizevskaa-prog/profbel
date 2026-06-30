const express = require("express");
const router = express.Router();
const Story = require("../Models/story.Model");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.Model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

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

router.get("/approved", async (req, res) => {
  res.json(await Story.find({ status: "approved" }));
});
router.get("/pending", protect, async (req, res) => {
  res.json(await Story.find({ status: "pending" }));
});

router.post("/submit", protect, async (req, res) => {
  const s = new Story({ ...req.body, userId: req.user.id, status: "pending" });
  await s.save();
  res.status(201).json({ message: "Отправлено на модерацию!" });
});

router.put("/approve/:id", protect, async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });
  const user = await User.findById(story.userId);
  if (user && process.env.EMAIL_USER) {
    try {
      await transporter.sendMail({
        from: `"ProfBel" <${process.env.EMAIL_USER}>`, // КРАСИВОЕ ИМЯ ОТПРАВИТЕЛЯ
        to: user.email,
        subject: "Ваша история опубликована!",
        html: `<h3>Поздравляем!</h3><p>Ваша история "${story.name}" успешно прошла модерацию и опубликована на сайте ProfBel.</p>`,
      });
    } catch (e) {}
  }
  res.json({ message: "Одобрено" });
});

router.delete("/:id", protect, async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
});

module.exports = router;
