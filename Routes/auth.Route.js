const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Библиотека для шифрования паролей
const jwt = require("jsonwebtoken"); // Библиотека для создания токенов
const User = require("../Models/user.Model"); // Наша модель пользователя

// ==========================================
// 1. РЕГИСТРАЦИЯ
// ==========================================
router.post("/register", async (req, res) => {
  try {
    // Получаем данные из запроса (то, что пользователь ввел в форму)
    const { name, email, password, gender, age, education } = req.body;

    // Проверка пароля: минимум 6 символов, минимум 1 буква и 1 цифра
    // Добавил поддержку и русских, и английских букв
    const passwordRegex = /^(?=.*[A-Za-zА-Яа-я])(?=.*\d)[A-Za-zА-Яа-я\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "Пароль должен быть мин. 6 символов и содержать буквы и цифры",
        });
    }

    // Проверяем, есть ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    // Шифруем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      education,
    });

    // Сохраняем в базу данных
    await newUser.save();
    res.status(201).json({ message: "Регистрация прошла успешно!" });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

// ==========================================
// 2. ВХОД В АККАУНТ
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    // Сравниваем введенный пароль с зашифрованным в базе
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    // Если пароль верный, создаем токен (электронный пропуск) на 7 дней
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Отправляем токен и базовые данные на фронтенд
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Ошибка при входе:", err);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

module.exports = router;
