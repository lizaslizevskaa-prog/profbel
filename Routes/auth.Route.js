const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../Models/user.Model");

// БРОНЕБОЙНАЯ ФУНКЦИЯ ОТПРАВКИ ПИСЕМ
const sendRealEmail = async (toEmail, subject, htmlContent) => {
  // Проверка: настроен ли .env
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes("ваша_настоящая_почта")
  ) {
    console.log(
      "\n⚠️ ВНИМАНИЕ: Почта в .env не настроена. Письмо не отправлено!",
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Явно указываем сервер Google
      port: 465, // Безопасный порт
      secure: true,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim(),
      },
    });

    await transporter.sendMail({
      from: `"ProfBel" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log(`\n✅ ПИСЬМО УСПЕШНО ОТПРАВЛЕНО НА: ${toEmail}\n`);
  } catch (error) {
    console.error(`\n❌ КРИТИЧЕСКАЯ ОШИБКА ОТПРАВКИ ПИСЬМА:`);
    console.error(error.message);
    console.log(`Проверьте пароль приложения в .env и перезапустите сервер!\n`);
  }
};

// 1. РЕГИСТРАЦИЯ
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, age, education } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Этот email уже зарегистрирован" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Генерируем 4-значный код
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

    console.log(`\n🔑 КОД ПОДТВЕРЖДЕНИЯ ДЛЯ ${email}: ${code}`);

    // Отправляем красивое письмо
    const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f9;">
                <h2 style="color: #0a192f;">Добро пожаловать в ProfBel, ${name}!</h2>
                <p style="font-size: 16px;">Для завершения регистрации введите этот 4-значный код:</p>
                <div style="background: #64ffda; color: #0a192f; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 10px; display: inline-block; letter-spacing: 5px; margin: 20px 0;">
                    ${code}
                </div>
                <p style="font-size: 14px; color: #8892b0;">Если вы не регистрировались на сайте, просто проигнорируйте это письмо.</p>
            </div>
        `;
    await sendRealEmail(email, "Код подтверждения ProfBel", emailHtml);

    res.status(201).json({ message: "Код отправлен на почту!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 2. ВЕРИФИКАЦИЯ КОДА
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Неверный код подтверждения" });

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
      return res
        .status(403)
        .json({ message: "Почта не подтверждена! Зарегистрируйтесь заново." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Неверный email или пароль" });

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
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

// 4. ЗАБЫЛИ ПАРОЛЬ
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    const newPassword = Math.random().toString(36).slice(-6) + "1a";
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f9;">
                <h2 style="color: #0a192f;">Восстановление доступа</h2>
                <p style="font-size: 16px;">Ваш новый временный пароль для входа:</p>
                <div style="background: #8a2be2; color: #fff; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 10px; display: inline-block; margin: 20px 0;">
                    ${newPassword}
                </div>
                <p style="font-size: 14px; color: #8892b0;">После входа вы сможете изменить его в личном кабинете.</p>
            </div>
        `;
    await sendRealEmail(email, "Восстановление пароля ProfBel", emailHtml);

    res.json({ message: `Новый пароль отправлен на вашу почту!` });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при восстановлении пароля" });
  }
});

module.exports = router;
