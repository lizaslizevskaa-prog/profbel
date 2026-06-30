const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../Models/user.Model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, age, education } = req.body;
    const passwordRegex = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password))
      return res
        .status(400)
        .json({
          message: "Пароль: мин. 6 символов, 1 заглавная буква и 1 цифра!",
        });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email занят" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      education,
      isVerified: false,
      verificationCode: code,
    });
    await newUser.save();
    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: `"ProfBel" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Код ProfBel",
        html: `<h2>Ваш код: ${code}</h2>`,
      });
    }
    res.status(201).json({ message: "Код отправлен на почту!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified)
      return res.status(403).json({ message: "Аккаунт не подтвержден" });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Неверный пароль" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка входа" });
  }
});

router.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.verificationCode !== code)
    return res.status(400).json({ message: "Неверный код" });
  user.isVerified = true;
  user.verificationCode = undefined;
  await user.save();
  res.json({ message: "Успех!" });
});

router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "Email не найден" });
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  user.verificationCode = code;
  await user.save();
  if (process.env.EMAIL_USER) {
    await transporter.sendMail({
      from: `"ProfBel" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Сброс пароля",
      html: `<h2>Код для сброса: ${code}</h2>`,
    });
  }
  res.json({ message: "Код отправлен!" });
});

router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.verificationCode !== code)
    return res.status(400).json({ message: "Неверный код" });
  user.password = await bcrypt.hash(newPassword, 10);
  user.verificationCode = undefined;
  await user.save();
  res.json({ message: "Пароль изменен!" });
});

module.exports = router;
