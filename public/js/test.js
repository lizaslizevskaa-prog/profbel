const { createApp } = Vue;

const testApp = createApp({
  data() {
    return {
      step: 0,
      totalSteps: 10,
      saved: false,
      professionsFromDb: [],
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
              text: "Писать код, собирать компьютеры",
              points: { IT: 3, Креатив: 1 },
            },
            {
              text: "Чинить технику, собирать конструкторы",
              points: { Инженерия: 3, "Беспилотные системы": 2 },
            },
            {
              text: "Читать про космос, работу тела",
              points: { Медицина: 3, Биотехнологии: 2, Экология: 2 },
            },
            {
              text: "Организовывать мероприятия",
              points: { Управление: 3, Логистика: 2 },
            },
          ],
        },
        {
          text: "2. Какой школьный предмет дается тебе легче всего?",
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
              text: "Собираю данные, ищу ошибку",
              points: { IT: 2, Инженерия: 2, Логистика: 2 },
            },
            {
              text: "Ищу креативный выход",
              points: { Креатив: 3, Образование: 1 },
            },
            {
              text: "Распределяю задачи между другими",
              points: { Управление: 3 },
            },
            {
              text: "Изучаю инструкции, чертежи",
              points: { Медицина: 2, Энергетика: 2, Биотехнологии: 2 },
            },
          ],
        },
        {
          text: "4. Где бы ты хотел(а) работать в будущем?",
          answers: [
            {
              text: "В современном офисе или удаленно",
              points: { IT: 3, Креатив: 2, Управление: 1 },
            },
            {
              text: "В лаборатории в белом халате",
              points: { Биотехнологии: 3, Медицина: 3 },
            },
            {
              text: "На стройках, заводах, электростанциях",
              points: { Строительство: 3, Энергетика: 3, Инженерия: 2 },
            },
            {
              text: "На свежем воздухе или в теплицах",
              points: { Экология: 3, Агропром: 3 },
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
              text: "Сделать планету чистой",
              points: { Экология: 3, Энергетика: 2 },
            },
            {
              text: "Построить умные города",
              points: { Строительство: 3, Логистика: 2 },
            },
          ],
        },
        {
          text: "6. Как ты относишься к рутинной работе и правилам?",
          answers: [
            {
              text: "Люблю точность. Правила важны",
              points: { Медицина: 3, Энергетика: 2, Строительство: 2 },
            },
            {
              text: "Ненавижу рутину, я за творчество",
              points: { Креатив: 3, Образование: 1 },
            },
            {
              text: "Готов выполнять ее ради проекта",
              points: { Управление: 2, Инженерия: 1 },
            },
            {
              text: "Напишу программу, которая сделает всё за меня",
              points: { IT: 3, "Беспилотные системы": 2 },
            },
          ],
        },
        {
          text: "7. Какое достижение техники кажется тебе самым крутым?",
          answers: [
            {
              text: "Роботы-хирурги и 3D-печать органов",
              points: { Медицина: 3, Биотехнологии: 3 },
            },
            {
              text: "Автономные дроны и авто",
              points: { "Беспилотные системы": 3, Логистика: 2 },
            },
            { text: "Умные теплицы", points: { Агропром: 3, Экология: 2 } },
            {
              text: "Виртуальная реальность",
              points: { IT: 2, Креатив: 2, Образование: 2 },
            },
          ],
        },
        {
          text: "8. Какой формат работы тебе ближе?",
          answers: [
            {
              text: "Одиночка: мне дали задачу, я ее сделал",
              points: { IT: 2, Инженерия: 1 },
            },
            { text: "Командный игрок", points: { Креатив: 3, Управление: 1 } },
            { text: "Руководитель", points: { Управление: 3, Логистика: 1 } },
            { text: "Наставник", points: { Образование: 3, Медицина: 1 } },
          ],
        },
        {
          text: "9. Представь, что тебе дали миллион долларов. Что откроешь?",
          answers: [
            { text: "ИТ-стартап", points: { IT: 3 } },
            {
              text: "Завод по производству энергии",
              points: { Энергетика: 3, Экология: 3 },
            },
            {
              text: "Агрохолдинг с дронами",
              points: { Агропром: 3, "Беспилотные системы": 2 },
            },
            {
              text: "Онлайн-университет",
              points: { Образование: 3, Креатив: 2 },
            },
          ],
        },
        {
          text: "10. Главный критерий успеха для тебя — это...",
          answers: [
            {
              text: "Высокая зарплата и востребованность",
              points: { IT: 3, Инженерия: 2 },
            },
            {
              text: "Ощущение, что моя работа спасает жизни",
              points: { Медицина: 3, Биотехнологии: 2 },
            },
            {
              text: "Возможность создавать новое",
              points: { Креатив: 2, Образование: 2 },
            },
            {
              text: "Видимый физический результат",
              points: { Строительство: 3, Энергетика: 2 },
            },
          ],
        },
      ],
      answersHistory: [],
    };
  },
  methods: {
    async loadProfessions() {
      try {
        const res = await fetch("/api/professions");
        this.professionsFromDb = await res.json();
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
    },
    startTest() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (typeof bootstrap !== "undefined") {
          const modalEl = document.getElementById("authModal");
          const modal =
            bootstrap.Modal.getInstance(modalEl) ||
            new bootstrap.Modal(modalEl);
          modal.show();
        }
        return;
      }
      this.step = 1;
      for (let key in this.userScores) {
        this.userScores[key] = 0;
      }
      this.answersHistory = [];
      this.saved = false;
    },
    selectAnswer(answer) {
      this.answersHistory.push(answer);
      for (let category in answer.points) {
        this.userScores[category] += answer.points[category];
      }
      this.step++;
      if (this.step > this.totalSteps) {
        this.calculateResult();
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
      const sortedCategories = Object.keys(this.userScores).sort(
        (a, b) => this.userScores[b] - this.userScores[a],
      );
      const top3Categories = sortedCategories.slice(0, 3);
      this.recommendedProfessions = [];
      const usedIds = new Set();

      top3Categories.forEach((category) => {
        const availableProfs = this.professionsFromDb.filter(
          (p) => p.direction === category && !usedIds.has(p._id),
        );
        if (availableProfs.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableProfs.length);
          const randomProf = availableProfs[randomIndex];
          this.recommendedProfessions.push(randomProf);
          usedIds.add(randomProf._id);
        } else {
          const fallbackProfs = this.professionsFromDb.filter(
            (p) => !usedIds.has(p._id),
          );
          if (fallbackProfs.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * fallbackProfs.length,
            );
            const fallback = fallbackProfs[randomIndex];
            this.recommendedProfessions.push(fallback);
            usedIds.add(fallback._id);
          }
        }
      });
    },
    async saveResults() {
      if (this.saved) return;
      const professionsList = this.recommendedProfessions.map((p) => p.title);
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await fetch("/api/profile/test-result", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ professions: professionsList }),
          });
          if (res.ok) {
            this.saved = true;
            alert("Результаты сохранены в личном кабинете!");
          } else {
            alert("Ошибка при сохранении на сервер.");
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    restartTest() {
      this.startTest();
      window.scrollTo(0, 0);
    },
  },
  mounted() {
    this.loadProfessions();
  },
});

if (document.getElementById("testApp")) {
  testApp.mount("#testApp");
}
