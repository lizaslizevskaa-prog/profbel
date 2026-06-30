const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.Model");

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

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Этот Email уже занят" });
    }

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.gender = gender;
      user.age = age;
      user.education = education;
      user.verificationCode = code;
      user.isVerified = false;
      await user.save();
    } else {
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

    // Отправка писем через защищенный HTTPS-запрос к API Resend (не блокируется Render)
    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Дефолтный отправитель на бесплатном тарифе Resend
          to: email,
          subject: "Код подтверждения ProfBel",
          html: `<div style="font-family: Arial; padding: 20px; text-align: center;"><h2>Ваш код подтверждения: <span style="color: #00bcd4;">${code}</span></h2></div>`,
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          console.log("✅ Код подтверждения отправлен через Resend API:", data),
        )
        .catch((e) =>
          console.error("❌ Ошибка отправки письма через Resend:", e),
        );
    }

    console.log(`🔑 КОД ДЛЯ ${email}: ${code}`);
    res.status(201).json({ message: "Код отправлен на почту!" });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
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

    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "Новый пароль ProfBel",
          html: `<h3>Ваш новый пароль: <span style="color: #00bcd4;">${newPass}</span></h3><p>Используйте его для входа, а затем сможете сменить в личном кабинете.</p>`,
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          console.log(
            "✅ Письмо с новым паролем отправлено через Resend:",
            data,
          ),
        )
        .catch((e) =>
          console.error("❌ Ошибка отправки нового пароля через Resend:", e),
        );
    }

    res.json({ message: "Новый пароль отправлен на почту!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка" });
  }
});

module.exports = router;
