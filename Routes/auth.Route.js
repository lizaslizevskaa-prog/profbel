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
      return res.status(400).json({
        message: "Пароль: мин. 6 символов, 1 заглавная буква и 1 цифра!",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        // Если почта уже подтверждена - не даем регаться
        return res.status(400).json({ message: "Этот Email уже занят" });
      } else {
        // Если аккаунт завис "неподтвержденным" - обновляем ему код и данные
        user.name = name;
        user.password = hashedPassword;
        user.gender = gender;
        user.age = age;
        user.education = education;
        user.verificationCode = code;
        await user.save();
      }
    } else {
      // Если такого email вообще нет - создаем нового
      user = new User({
        name,
        email,
        password: hashedPassword,
        gender,
        age,
        education,
        isVerified: false,
        verificationCode: code,
      });
      await user.save();
    }

    if (process.env.EMAIL_USER) {
      try {
        await transporter.sendMail({
          from: `"ProfBel" <${process.env.EMAIL_USER}>`, // КРАСИВОЕ ИМЯ ОТПРАВИТЕЛЯ
          to: email,
          subject: "Код подтверждения ProfBel",
          html: `<h2>Ваш код: ${code}</h2>`,
        });
      } catch (e) {
        console.error("Ошибка отправки письма", e);
      }
    }
    console.log(`🔑 КОД ДЛЯ ${email}: ${code}`);
    res.status(201).json({ message: "Код отправлен на почту!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

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
    res.status(500).json({ message: "Ошибка" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified)
      return res
        .status(403)
        .json({ message: "Аккаунт не найден или не подтвержден" });
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
    res.status(500).json({ message: "Ошибка" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email не найден" });
    const newPass = Math.random().toString(36).slice(-8) + "1A";
    user.password = await bcrypt.hash(newPass, 10);
    await user.save();
    if (process.env.EMAIL_USER) {
      try {
        await transporter.sendMail({
          from: `"ProfBel" <${process.env.EMAIL_USER}>`, // КРАСИВОЕ ИМЯ ОТПРАВИТЕЛЯ
          to: user.email,
          subject: "Новый пароль",
          html: `<h3>Пароль: ${newPass}</h3>`,
        });
      } catch (e) {}
    }
    console.log(`🔑 НОВЫЙ ПАРОЛЬ ДЛЯ ${user.email}: ${newPass}`);
    res.json({ message: "Пароль отправлен!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка" });
  }
});

module.exports = router;
