// Логика теста на Vue 3
const { createApp } = Vue;

const testApp = createApp({
  data() {
    return {
      step: 0,
      totalSteps: 10,
      saved: false,
      userScores: {
        IT: 0,
        Инженерия: 0,
        "Беспилотные системы": 0,
        Энергетика: 0,
        Строительство: 0,
        Агропром: 0,
        Экология: 0,
        Медицина: 0,
        Биотехнологии: 0,
        Креатив: 0,
        Логистика: 0,
        Управление: 0,
        Образование: 0,
      },
      recommendedProfessions: [],
      questions: [
        {
          text: "1. Что тебе больше всего нравится делать в свободное время?",
          answers: [
            {
              text: "Писать код, собирать компьютеры или играть в сложные стратегии",
              points: { IT: 3, Креатив: 1 },
            },
            {
              text: "Чинить технику, собирать конструкторы, паять",
              points: { Инженерия: 3, "Беспилотные системы": 2 },
            },
            {
              text: "Читать про космос, природу, работу человеческого тела",
              points: { Медицина: 3, Биотехнологии: 2, Экология: 2 },
            },
            {
              text: "Организовывать мероприятия, быть лидером в компании",
              points: { Управление: 3, Логистика: 2 },
            },
          ],
        },
        {
          text: "2. Какой школьный предмет дается тебе легче всего (или наиболее интересен)?",
          answers: [
            {
              text: "Информатика и Математика",
              points: { IT: 3, Инженерия: 2 },
            },
            {
              text: "Биология и Химия",
              points: { Медицина: 3, Биотехнологии: 3, Агропром: 2 },
            },
            {
              text: "Физика и Черчение",
              points: { Строительство: 3, Энергетика: 3, Инженерия: 2 },
            },
            {
              text: "Языки, История, Обществоведение",
              points: { Образование: 3, Креатив: 3, Управление: 2 },
            },
          ],
        },
        {
          text: "3. Как ты подходишь к решению сложной проблемы?",
          answers: [
            {
              text: "Собираю данные, анализирую и ищу системную ошибку",
              points: { IT: 2, Инженерия: 2, Логистика: 2 },
            },
            {
              text: "Ищу креативный и нестандартный выход",
              points: { Креатив: 3, Образование: 1 },
            },
            {
              text: "Распределяю задачи между другими людьми, чтобы решить всё быстрее",
              points: { Управление: 3 },
            },
            {
              text: "Изучаю инструкции, чертежи или научные статьи",
              points: { Медицина: 2, Энергетика: 2, Биотехнологии: 2 },
            },
          ],
        },
        {
          text: "4. Где бы ты хотел(а) работать в будущем?",
          answers: [
            {
              text: "В современном офисе или вообще удаленно из дома",
              points: { IT: 3, Креатив: 2, Управление: 1 },
            },
            {
              text: "В высокотехнологичной лаборатории в белом халате",
              points: { Биотехнологии: 3, Медицина: 3 },
            },
            {
              text: "На масштабных объектах: стройки, заводы, электростанции",
              points: { Строительство: 3, Энергетика: 3, Инженерия: 2 },
            },
            {
              text: "На свежем воздухе или в современных теплицах",
              points: { Экология: 3, Агропром: 3, "Беспилотные системы": 1 },
            },
          ],
        },
        {
          text: "5. Какая глобальная цель тебя вдохновляет больше?",
          answers: [
            { text: "Создать ИИ, который изменит мир", points: { IT: 3 } },
            {
              text: "Победить неизлечимые болезни",
              points: { Медицина: 3, Биотехнологии: 3 },
            },
            {
              text: "Сделать планету чистой, спасти природу",
              points: { Экология: 3, Энергетика: 2 },
            },
            {
              text: "Построить умные города и удобную инфраструктуру",
              points: { Строительство: 3, Логистика: 2, Управление: 1 },
            },
          ],
        },
        {
          text: "6. Как ты относишься к рутинной работе и четким инструкциям?",
          answers: [
            {
              text: "Люблю точность. Ошибка может стоить дорого, поэтому правила важны",
              points: { Медицина: 3, Энергетика: 2, Строительство: 2 },
            },
            {
              text: "Ненавижу рутину, я за творчество и свободу",
              points: { Креатив: 3, Образование: 1 },
            },
            {
              text: "Готов выполнять ее, если это необходимо для масштабного проекта",
              points: { Управление: 2, Инженерия: 1 },
            },
            {
              text: "Предпочитаю написать скрипт/программу, которая сделает рутину за меня",
              points: { IT: 3, "Беспилотные системы": 2 },
            },
          ],
        },
        {
          text: "7. Какое достижение техники кажется тебе самым крутым?",
          answers: [
            {
              text: "Роботы-хирурги и печать органов на 3D-принтере",
              points: { Медицина: 3, Биотехнологии: 3 },
            },
            {
              text: "Автономные дроны и беспилотные автомобили",
              points: { "Беспилотные системы": 3, Логистика: 2 },
            },
            {
              text: "Умные теплицы и вертикальные фермы в небоскребах",
              points: { Агропром: 3, Экология: 2 },
            },
            {
              text: "Виртуальная реальность и метавселенные",
              points: { IT: 2, Креатив: 2, Образование: 2 },
            },
          ],
        },
        {
          text: "8. Какой формат работы тебе ближе?",
          answers: [
            {
              text: "Одиночка: мне дали задачу, я ее сделал(а) сам(а)",
              points: { IT: 2, Инженерия: 1 },
            },
            {
              text: "Командный игрок: обсуждаем идеи, проводим мозговые штурмы",
              points: { Креатив: 3, Управление: 1 },
            },
            {
              text: "Руководитель: я говорю, кто и что должен делать",
              points: { Управление: 3, Логистика: 1 },
            },
            {
              text: "Наставник: люблю объяснять другим, как всё устроено",
              points: { Образование: 3, Медицина: 1 },
            },
          ],
        },
        {
          text: "9. Представь, что тебе дали миллион долларов на бизнес. Что откроешь?",
          answers: [
            {
              text: "ИТ-стартап по разработке софта или нейросетей",
              points: { IT: 3 },
            },
            {
              text: "Завод по производству возобновляемой энергии или переработке мусора",
              points: { Энергетика: 3, Экология: 3 },
            },
            {
              text: "Агрохолдинг с дронами и автоматическим поливом",
              points: { Агропром: 3, "Беспилотные системы": 2 },
            },
            {
              text: "Онлайн-университет или медиа-портал нового поколения",
              points: { Образование: 3, Креатив: 2 },
            },
          ],
        },
        {
          text: "10. Главный критерий успеха для тебя — это...",
          answers: [
            {
              text: "Высокая зарплата и востребованность в любой точке мира",
              points: { IT: 3, Инженерия: 2 },
            },
            {
              text: "Ощущение, что моя работа реально спасает жизни людей",
              points: { Медицина: 3, Биотехнологии: 2 },
            },
            {
              text: "Возможность постоянно учиться и создавать что-то новое",
              points: { Креатив: 2, Образование: 2 },
            },
            {
              text: "Видимый физический результат: построенный мост, работающий завод",
              points: { Строительство: 3, Энергетика: 2, Агропром: 1 },
            },
          ],
        },
      ],
      answersHistory: [],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.step - 1];
    },
    progressPercent() {
      return ((this.step - 1) / this.totalSteps) * 100;
    },
  },
  methods: {
    startTest() {
      this.step = 1;
      for (let key in this.userScores) {
        this.userScores[key] = 0;
      }
      this.answersHistory = [];
      this.saved = false;
    },

    selectAnswer(answer, event) {
      // Анимация выбранной кнопки
      if (event && event.currentTarget) {
        $(event.currentTarget).effect("highlight", { color: "#64ffda" }, 500);
      }

      this.answersHistory.push(answer);

      for (let category in answer.points) {
        this.userScores[category] += answer.points[category];
      }

      this.step++;

      if (this.step > this.totalSteps) {
        this.calculateResult();
        this.$nextTick(() => {
          this.showResultsWithAnimation();
        });
      }
    },

    prevStep() {
      this.step--;
      const lastAnswer = this.answersHistory.pop();
      for (let category in lastAnswer.points) {
        this.userScores[category] -= lastAnswer.points[category];
      }
    },

    calculateResult() {
      const sortedCategories = Object.keys(this.userScores).sort((a, b) => {
        return this.userScores[b] - this.userScores[a];
      });

      const top3Categories = sortedCategories.slice(0, 3);

      this.recommendedProfessions = [];
      const usedIds = new Set();

      top3Categories.forEach((category) => {
        const prof = professions.find(
          (p) => p.direction === category && !usedIds.has(p.id),
        );
        if (prof) {
          this.recommendedProfessions.push(prof);
          usedIds.add(prof.id);
        } else {
          const fallback = professions.find((p) => !usedIds.has(p.id));
          if (fallback) {
            this.recommendedProfessions.push(fallback);
            usedIds.add(fallback.id);
          }
        }
      });
    },

    showResultsWithAnimation() {
      setTimeout(() => {
        const resultsDiv = $(".results-container");
        if (resultsDiv.length) {
          resultsDiv.hide();
          resultsDiv.show("slide", { direction: "up" }, 500);
        }

        // Пульсация для топ-1
        setTimeout(() => {
          $(".top-card .custom-card").effect("pulsate", { times: 3 }, 800);
        }, 300);

        // Подсветка всех карточек
        $(".col-md-4 .custom-card").each(function (index) {
          $(this)
            .delay(index * 200)
            .effect("highlight", { color: "#64ffda" }, 1000);
        });
      }, 100);
    },

    saveResults() {
      if (this.saved) return;

      const btn = $(".btn-accent-glow");
      btn.effect("bounce", { times: 2, distance: 5 }, 300);

      let pastResults =
        JSON.parse(localStorage.getItem("profbel_results")) || [];

      const newResult = {
        date: new Date().toLocaleDateString("ru-RU"),
        professions: this.recommendedProfessions.map((p) => p.title),
      };

      pastResults.unshift(newResult);
      if (pastResults.length > 3) {
        pastResults.pop();
      }

      localStorage.setItem("profbel_results", JSON.stringify(pastResults));
      this.saved = true;

      $(".save-notification").fadeIn(300).delay(2000).fadeOut(300);
    },

    restartTest() {
      $(".results-container").fadeOut(300, () => {
        this.startTest();
        $("html, body").animate({ scrollTop: 0 }, 500);
      });
    },
  },
  mounted() {
    console.log("Тест загружен, анимации готовы!");
  },
});

// Запускаем приложение Vue
if (document.getElementById("testApp")) {
  testApp.mount("#testApp");
}

// Дополнительные эффекты
$(document).ready(function () {
  $(document).on("mouseenter", ".answer-btn", function () {
    $(this)
      .stop()
      .animate(
        { paddingLeft: "25px", backgroundColor: "rgba(100, 255, 218, 0.05)" },
        150,
      );
  });
  $(document).on("mouseleave", ".answer-btn", function () {
    $(this)
      .stop()
      .animate({ paddingLeft: "20px", backgroundColor: "transparent" }, 150);
  });
});
