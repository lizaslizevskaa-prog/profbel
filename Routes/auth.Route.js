const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.Model");
const { sendMail } = require("../Utils/mailer");

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, age, education } = req.body;

    const passwordRegex = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message: "Пароль: мин. 6 символов, 1 заглавная буква и 1 цифра!",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

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
      user.isVerified = false;
      user.verificationCode = code;
      user.codeExpires = codeExpires;
      await user.save();
    } else {
      user = new User({
        name, email, password: hashedPassword,
        gender, age, education,
        isVerified: false,
        verificationCode: code,
        codeExpires,
      });
      await user.save();
    }

    if (process.env.GOOGLE_REFRESH_TOKEN) {
      await sendMail({
        to: email,
        subject: "Подтверждение регистрации ProfBel",
        html: `<h3>Код подтверждения: <span style="color:#00bcd4;font-size:28px;letter-spacing:4px">${code}</span></h3><p>Код действителен 10 минут.</p>`,
      });
    }

    res.status(201).json({
      message: "Код подтверждения отправлен на почту!",
      email,
    });
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
    if (user.codeExpires && user.codeExpires < new Date())
      return res.status(400).json({ message: "Код истёк. Запросите новый." });
    user.isVerified = true;
    user.verificationCode = undefined;
    user.codeExpires = undefined;
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
    if (!user)
      return res.status(400).json({ message: "Аккаунт не найден. Возможно, нужно зарегистрироваться." });
    if (!user.isVerified)
      return res.status(403).json({ message: "Аккаунт не подтвержден" });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Неверный пароль" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const passwordRegex = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword))
      return res.status(400).json({
        message: "Пароль: мин. 6 символов, 1 заглавная буква и 1 цифра!",
      });

    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code)
      return res.status(400).json({ message: "Неверный код" });
    if (user.codeExpires && user.codeExpires < new Date())
      return res.status(400).json({ message: "Код истёк. Запросите новый." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = undefined;
    user.codeExpires = undefined;
    await user.save();

    res.json({ message: "Пароль успешно изменён! Теперь войдите." });
  } catch (err) {
    console.error("❌ Ошибка reset-password:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email не найден" });
    if (!user.isVerified)
      return res.status(403).json({ message: "Аккаунт не подтвержден. Зарегистрируйтесь заново." });

    const code = generateCode();
    user.verificationCode = code;
    user.codeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    if (process.env.GOOGLE_REFRESH_TOKEN) {
      await sendMail({
        to: user.email,
        subject: "Сброс пароля ProfBel",
        html: `<h3>Код для сброса: <span style="color:#00bcd4;font-size:28px;letter-spacing:4px">${code}</span></h3><p>Код действителен 10 минут. Если вы не запрашивали сброс — проигнорируйте письмо.</p>`,
      });
    } else {
      return res.status(500).json({ message: "Сервис почты не настроен." });
    }
    res.json({ message: "Код для сброса отправлен на почту!" });
  } catch (err) {
    console.error("❌ Ошибка forgot-password:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/check-email", async (req, res) => {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return res.status(500).json({ status: "error", message: "GOOGLE_REFRESH_TOKEN не задан" });
  }
  try {
    await sendMail({
      to: "lizaslizevskaa@gmail.com",
      subject: "Тест ProfBel",
      html: "<h3>Почта работает!</h3>",
    });
    res.json({ status: "ok", message: "Gmail API настроен корректно" });
  } catch (e) {
    console.error("❌ Ошибка проверки почты:", e);
    res.status(500).json({ status: "error", message: e.message });
  }
});

module.exports = router;
