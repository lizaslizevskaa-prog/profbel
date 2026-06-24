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

const sendRealEmail = async (toEmail, subject, htmlContent) => {
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes("ваша_настоящая")
  ) {
    console.log(
      "\n⚠️ ВНИМАНИЕ: Почта в .env не настроена. Письмо не отправлено!",
    );
    return;
  }
  try {
    await transporter.sendMail({
      from: `"ProfBel" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error(`❌ Ошибка отправки письма:`, error.message);
  }
};

// 1. РЕГИСТРАЦИЯ
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, age, education } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email уже зарегистрирован" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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

    console.log(`\n🔑 КОД РЕГИСТРАЦИИ ДЛЯ ${email}: ${code}\n`);
    await sendRealEmail(
      email,
      "Код подтверждения ProfBel",
      `<h2>Ваш код: ${code}</h2>`,
    );
    res.status(201).json({ message: "Код отправлен на почту!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 2. ВЕРИФИКАЦИЯ
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code)
      return res.status(400).json({ message: "Неверный код" });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    res.json({ message: "Почта подтверждена!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 3. ВХОД
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Неверный email или пароль" });
    if (!user.isVerified)
      return res.status(403).json({ message: "Почта не подтверждена!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 4. ЗАБЫЛИ ПАРОЛЬ (ШАГ 1: Отправка кода)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    user.verificationCode = code; // Используем то же поле для кода сброса
    await user.save();

    console.log(`\n🔑 КОД ВОССТАНОВЛЕНИЯ ДЛЯ ${email}: ${code}\n`);
    await sendRealEmail(
      email,
      "Восстановление пароля ProfBel",
      `<h2>Код для сброса пароля: ${code}</h2>`,
    );

    res.json({ message: `Код отправлен на почту!` });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 5. СБРОС ПАРОЛЯ (ШАГ 2: Ввод кода и нового пароля)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code)
      return res.status(400).json({ message: "Неверный код" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.verificationCode = undefined; // Удаляем код
    await user.save();

    res.json({ message: "Пароль успешно изменен!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
