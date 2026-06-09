// База данных профессий будущего (35 профессий, актуально на 2024-2026 год)
const professions = [
  {
    id: 1,
    title: "Разработчик беспилотных систем",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.MwiqFBKP0a18kPvOkuf46AHaEJ?r=0&w=1249&h=700&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Беспилотные системы",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика", "Языки"],
    salaryMin: 2000,
    salaryMax: 4500,
    demand: "Растущий",
    description:
      "Специалист, создающий ПО и аппаратную часть для дронов и беспилотников.",
    perspectives:
      "Огромный спрос в агросекторе, логистике и мониторинге лесов Беларуси.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 344 баллов",
    },
    universities: [
      {
        name: "БГУИР",
        faculty: "ФКП",
        specialty: "Электронные системы и технологии",
      },
      { name: "БНТУ", faculty: "МСФ", specialty: "Робототехнические системы" },
    ],
    colleges: [],
    skills: ["C/C++", "Python", "ROS", "Схемотехника"],
    softSkills: ["Аналитическое мышление", "Ответственность"],
    careerPath: [
      "Младший инженер",
      "Инженер-разработчик",
      "Тимлид",
      "Технический директор",
    ],
  },
  {
    id: 2,
    title: "Специалист по кибербезопасности",
    image:
      "https://t3.ftcdn.net/jpg/06/34/92/92/360_F_634929245_yGkMC01XFyAJhFQNWY45HeNc8kENVt1p.jpg",
    direction: "IT",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика", "Информатика"],
    salaryMin: 2500,
    salaryMax: 5000,
    demand: "Стабильный",
    description:
      "Эксперт по защите ИТ-инфраструктуры от хакерских атак и утечек данных.",
    perspectives:
      "С развитием цифровой экономики потребность в защите данных растет экспоненциально.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 378 баллов",
    },
    universities: [
      { name: "БГУ", faculty: "ФПМИ", specialty: "Кибербезопасность" },
      {
        name: "БГУИР",
        faculty: "ФКСиС",
        specialty: "Информационная безопасность",
      },
    ],
    colleges: [],
    skills: ["Сети", "Криптография", "Linux", "Ethical Hacking"],
    softSkills: ["Стрессоустойчивость", "Внимание к деталям"],
    careerPath: ["Junior Analyst", "Security Engineer", "Pentester", "CISO"],
  },
  {
    id: 3,
    title: "Инженер возобновляемой энергетики",
    image:
      "https://brixx.com/wp-content/uploads/2025/04/financial-modelling-tool-for-energy-companies.jpg",
    direction: "Энергетика",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика"],
    salaryMin: 1800,
    salaryMax: 3500,
    demand: "Растущий",
    description:
      "Занимается проектированием и внедрением солнечных панелей, ветрогенераторов и биогазовых установок.",
    perspectives:
      "Переход на зеленые технологии открывает большие перспективы в Беларуси и ЕС.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 255 баллов",
    },
    universities: [
      {
        name: "БНТУ",
        faculty: "Энергетический",
        specialty: "Электроэнергетика и электротехника",
      },
    ],
    colleges: [],
    skills: ["AutoCAD", "Электротехника", "Анализ данных"],
    softSkills: ["Экологическое мышление", "Работа в команде"],
    careerPath: ["Проектировщик", "Инженер ПТО", "Руководитель проектов"],
  },
  {
    id: 4,
    title: "Оператор 3D-печати в строительстве",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.9fEt89DV1dzcTrLFMntqOAHaEp?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Строительство",
    educationLevel: "Колледж",
    subjects: ["Математика"],
    salaryMin: 1500,
    salaryMax: 2800,
    demand: "Новый",
    description:
      "Управляет строительными 3D-принтерами для возведения домов и инфраструктурных объектов.",
    perspectives:
      "Технология только зарождается, но обещает революцию в скорости строительства.",
    entranceExams: {
      subject1: "Средний балл аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 7.8 баллов",
    },
    universities: [],
    colleges: [
      { name: "МГАСК", specialty: "Строительство зданий и сооружений" },
    ],
    skills: ["Чтение чертежей", "Настройка 3D-принтера", "Материаловедение"],
    softSkills: ["Точность", "Обучаемость"],
    careerPath: ["Младший оператор", "Старший оператор", "Начальник участка"],
  },
  {
    id: 5,
    title: "Агрокибернетик",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.nqWnTZlihw1XNNxRg9Vm_gHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Агропром",
    educationLevel: "Вуз",
    subjects: ["Математика", "Биология"],
    salaryMin: 1700,
    salaryMax: 3200,
    demand: "Растущий",
    description:
      "Специалист по автоматизации сельскохозяйственных процессов, внедрению IoT и дронов на полях.",
    perspectives:
      "Оцифровка сельского хозяйства Беларуси - приоритетная государственная задача.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Биология (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 80 баллов",
    },
    universities: [
      {
        name: "БГСХА",
        faculty: "Механизации сельского хозяйства",
        specialty:
          "Техническое обеспечение производства сельскохозяйственной продукции",
      },
    ],
    colleges: [],
    skills: ["IoT", "Анализ данных", "Основы агрономии"],
    softSkills: ["Системное мышление", "Проактивность"],
    careerPath: ["Специалист", "Ведущий аналитик", "Руководитель цифровизации"],
  },
  {
    id: 6,
    title: "Проектировщик умных домов",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.H6Vm8414jwXk-nHRDRTnIAHaE8?r=0&w=940&h=627&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Инженерия",
    educationLevel: "Вуз/Колледж",
    subjects: ["Математика", "Физика"],
    salaryMin: 2200,
    salaryMax: 5000,
    demand: "Стабильный",
    description:
      "Разрабатывает системы автоматизации для жилых помещений: климат-контроль, безопасность, освещение.",
    perspectives:
      "Растущий спрос в частном строительстве и элитной недвижимости.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 260 баллов",
    },
    universities: [
      {
        name: "БНТУ",
        faculty: "ФИТР",
        specialty: "Автоматизация технологических процессов и производств",
      },
    ],
    colleges: [
      {
        name: "МГПК (Минский государственный политехнический колледж)",
        specialty: "Автоматизация технологических процессов и производств",
      },
    ],
    skills: ["KNX", "Электромонтаж", "Программирование контроллеров"],
    softSkills: ["Коммуникабельность", "Ориентация на клиента"],
    careerPath: ["Монтажник", "Проектировщик", "Главный инженер проекта"],
  },
  {
    id: 7,
    title: "Разработчик VR/AR-приложений",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.xs8nVFM0VRw2wo7NxuyprAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "IT",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика"],
    salaryMin: 2200,
    salaryMax: 4800,
    demand: "Растущий",
    description:
      "Программист, создающий виртуальную и дополненную реальность для игр, обучения и бизнеса.",
    perspectives:
      "Бурный рост индустрии развлечений и образовательных технологий.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 395 баллов",
    },
    universities: [
      { name: "БГУИР", faculty: "ФКСиС", specialty: "Программная инженерия" },
    ],
    colleges: [],
    skills: ["Unity 3D", "Unreal Engine", "C#", "C++"],
    softSkills: ["Креативность", "Пространственное мышление"],
    careerPath: ["Junior VR Developer", "Middle Developer", "Lead Developer"],
  },
  {
    id: 8,
    title: "Экоаналитик в промышленности",
    image:
      "https://www.shutterstock.com/image-photo/smart-farmingmanagement-information-system-using-600nw-1276376506.jpg",
    direction: "Экология",
    educationLevel: "Вуз",
    subjects: ["Химия", "Биология"],
    salaryMin: 1500,
    salaryMax: 2700,
    demand: "Стабильный",
    description:
      "Анализирует влияние производств на окружающую среду и разрабатывает стратегии снижения углеродного следа.",
    perspectives:
      "Внедрение ESG-стандартов делает эту профессию обязательной для крупных заводов.",
    entranceExams: {
      subject1: "Химия (ЦТ/ЦЭ)",
      subject2: "Биология (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 285 баллов",
    },
    universities: [
      { name: "БГУ", faculty: "Географический", specialty: "Геоэкология" },
      {
        name: "БГТУ",
        faculty: "ХТиТ",
        specialty: "Природоохранная деятельность",
      },
    ],
    colleges: [],
    skills: ["Экологический аудит", "Химический анализ", "Законодательство РБ"],
    softSkills: ["Аналитические способности", "Убедительность"],
    careerPath: [
      "Эколог",
      "Старший эколог",
      "Директор по устойчивому развитию",
    ],
  },
  {
    id: 9,
    title: "Специалист по роботизации",
    image:
      "https://static.tildacdn.com/tild6265-6439-4934-b735-616632346633/_2.jpg",
    direction: "Инженерия",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика"],
    salaryMin: 2000,
    salaryMax: 4000,
    demand: "Растущий",
    description:
      "Внедряет промышленных роботов на производственные линии, программирует их и обслуживает.",
    perspectives:
      "Модернизация белорусских промышленных гигантов требует тысяч таких специалистов.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 275 баллов",
    },
    universities: [
      { name: "БНТУ", faculty: "МСФ", specialty: "Робототехнические системы" },
    ],
    colleges: [],
    skills: ["Программирование ЧПУ", "Мехатроника", "Пневматика"],
    softSkills: ["Логика", "Быстрое принятие решений"],
    careerPath: ["Инженер", "Ведущий инженер", "Главный конструктор"],
  },
  {
    id: 10,
    title: "Генетический консультант",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.KXQxC0u_IgY2CqQsj7zWWAHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Медицина",
    educationLevel: "Вуз",
    subjects: ["Биология", "Химия"],
    salaryMin: 1800,
    salaryMax: 3500,
    demand: "Новый",
    description:
      "Врач или биолог, который анализирует ДНК пациента для выявления предрасположенностей к заболеваниям.",
    perspectives:
      "Персонализированная медицина - главный тренд мирового здравоохранения.",
    entranceExams: {
      subject1: "Биология (ЦТ/ЦЭ)",
      subject2: "Химия (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 376 баллов",
    },
    universities: [
      { name: "БГМУ", faculty: "Лечебный", specialty: "Лечебное дело" },
      {
        name: "БГУ",
        faculty: "Биологический",
        specialty: "Биология (профилизация: Генетика)",
      },
    ],
    colleges: [],
    skills: ["Биоинформатика", "Клиническая генетика", "Психология"],
    softSkills: ["Эмпатия", "Тактичность"],
    careerPath: ["Ассистент", "Консультант", "Заведующий лабораторией"],
  },
  {
    id: 11,
    title: "Биоинформатик",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.Ji7EFvPw5cOEksWTxgDr3gHaEK?r=0&w=820&h=461&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Биотехнологии",
    educationLevel: "Вуз",
    subjects: ["Биология", "Математика"],
    salaryMin: 2200,
    salaryMax: 4500,
    demand: "Растущий",
    description:
      "Разрабатывает алгоритмы для анализа больших биологических данных (например, расшифровки генома).",
    perspectives:
      "Высочайший спрос в фармакологии и исследовательских институтах по всему миру.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика/Иностранный (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 391 балл",
    },
    universities: [
      {
        name: "БГУ",
        faculty: "Совместная программа Биофака и ФПМИ",
        specialty: "Биоинженерия и биоинформатика",
      },
    ],
    colleges: [],
    skills: ["Python", "R", "Анализ данных", "Молекулярная биология"],
    softSkills: ["Скрупулезность", "Аналитическое мышление"],
    careerPath: [
      "Младший аналитик",
      "Биоинформатик",
      "Руководитель исследований",
    ],
  },
  {
    id: 12,
    title: "Разработчик нейроинтерфейсов",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.IOzpQgLPxxGgDqu5zO441AHaE8?r=0&w=1024&h=683&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "IT",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика", "Биология"],
    salaryMin: 2500,
    salaryMax: 5000,
    demand: "Новый",
    description:
      "Создает системы, позволяющие мозгу напрямую взаимодействовать с компьютерами и протезами.",
    perspectives:
      "Профессия на стыке IT и медицины, за которой будущее реабилитации и киборгизации.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 382 баллов",
    },
    universities: [
      { name: "БГУИР", faculty: "ФИТиУ", specialty: "Искусственный интеллект" },
    ],
    colleges: [],
    skills: [
      "Machine Learning",
      "Нейробиология",
      "Программирование микроконтроллеров",
    ],
    softSkills: ["Научный подход", "Креативность"],
    careerPath: ["Исследователь", "Разработчик", "Архитектор систем"],
  },
  {
    id: 13,
    title: "Сити-фермер",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.jnS2GiRNroFMHJ4iRIR7rAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "Агропром",
    educationLevel: "Колледж/Вуз",
    subjects: ["Биология"],
    salaryMin: 1200,
    salaryMax: 2500,
    demand: "Новый",
    description:
      "Специалист по выращиванию овощей, ягод и зелени в городских условиях на вертикальных фермах.",
    perspectives:
      "Позволяет обеспечивать города свежими продуктами без расходов на логистику.",
    entranceExams: {
      subject1: "Биология (ЦТ/ЦЭ)",
      subject2: "Химия (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 74 баллов",
    },
    universities: [
      {
        name: "БГСХА",
        faculty: "Агрономический",
        specialty: "Производство продукции растительного происхождения",
      },
    ],
    colleges: [
      {
        name: "Аграрные колледжи РБ",
        specialty: "Производство продукции растениеводства",
      },
    ],
    skills: ["Гидропоника", "Ботаника", "Управление микроклиматом"],
    softSkills: ["Предпринимательская жилка", "Ответственность"],
    careerPath: ["Агроном", "Главный технолог", "Владелец сити-фермы"],
  },
  {
    id: 14,
    title: "Специалист по переработке отходов",
    image:
      "https://musor.moscow/wp-content/uploads/2021/03/pererabotka-musora.jpg",
    direction: "Экология",
    educationLevel: "Колледж/Вуз",
    subjects: ["Химия"],
    salaryMin: 1300,
    salaryMax: 2500,
    demand: "Стабильный",
    description:
      "Организует процесс сортировки, переработки и утилизации бытовых и промышленных отходов.",
    perspectives:
      "Проблема свалок актуальна, страна активно строит мусороперерабатывающие заводы.",
    entranceExams: {
      subject1: "Химия (ЦТ/ЦЭ)",
      subject2: "Математика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 210 баллов",
    },
    universities: [
      { name: "БГТУ", faculty: "ХТиТ", specialty: "Промышленная экология" },
    ],
    colleges: [
      {
        name: "Технологические колледжи",
        specialty: "Охрана окружающей среды",
      },
    ],
    skills: ["Знание технологий переработки", "Логистика", "Эко-менеджмент"],
    softSkills: ["Организаторские способности", "Стрессоустойчивость"],
    careerPath: ["Технолог", "Начальник смены", "Директор завода"],
  },
  {
    id: 15,
    title: "Медицинский кибернетик",
    image:
      "https://medcafedra.ru/upload/iblock/80e/05xk9b78108v9rstiiiarp2sdrnaz8mf/vrach-kibernetik.jpg",
    direction: "Медицина",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика", "Биология"],
    salaryMin: 2000,
    salaryMax: 4000,
    demand: "Растущий",
    description:
      "Разрабатывает программное обеспечение для сложного медицинского оборудования (МРТ, УЗИ, роботы-хирурги).",
    perspectives:
      "Критически важная профессия для высокотехнологичных клиник и РНПЦ.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 344 баллов",
    },
    universities: [
      {
        name: "БГУИР",
        faculty: "ФКП",
        specialty: "Электронные системы и технологии",
      },
    ],
    colleges: [],
    skills: ["Схемотехника", "Программирование", "Знание анатомии (база)"],
    softSkills: ["Внимательность", "Готовность к постоянному обучению"],
    careerPath: [
      "Инженер сервиса",
      "Инженер-разработчик",
      "Руководитель отдела",
    ],
  },
  {
    id: 16,
    title: "Дата-журналист",
    image:
      "https://imgproxy.soyuz.by/CUcrzfx_vVrWRvYhZwK_xvWc9RqjSkHb4bTjKxz97ic/w:943/h:629/czM6Ly9zb3l1ei5ieS80NjI1OC9waG90b18yMDI1LTA0LTE4XzEwLTI3LTAzLmpwZw.jpg",
    direction: "Креатив",
    educationLevel: "Вуз",
    subjects: ["История", "Языки", "Математика"],
    salaryMin: 1500,
    salaryMax: 3000,
    demand: "Новый",
    description:
      "Создает журналистские расследования и материалы на основе анализа больших массивов данных (Big Data).",
    perspectives:
      "СМИ все больше переходят от обычных текстов к инфографике и аналитике.",
    entranceExams: {
      subject1: "История Беларуси (ЦТ/ЦЭ)",
      subject2: "Творческое испытание",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 362 баллов",
    },
    universities: [
      {
        name: "БГУ",
        faculty: "Журналистики",
        specialty: "Информация и коммуникация",
      },
    ],
    colleges: [],
    skills: ["Excel/SQL", "Python (основы)", "Копирайтинг", "Инфографика"],
    softSkills: ["Любознательность", "Критическое мышление"],
    careerPath: [
      "Журналист",
      "Аналитик данных",
      "Главный редактор спецпроектов",
    ],
  },
  {
    id: 17,
    title: "Проектировщик транспортных систем",
    image:
      "https://company.sbb.ch/content/dam/internet/shared/images/personen/baustelle/BIM-Plan.JPG/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg",
    direction: "Логистика",
    educationLevel: "Вуз",
    subjects: ["Математика", "Физика"],
    salaryMin: 1800,
    salaryMax: 3500,
    demand: "Стабильный",
    description:
      "Разрабатывает транспортные развязки, маршруты общественного транспорта с учетом умных светофоров и ИИ.",
    perspectives: "Минск и областные центры нуждаются в оптимизации трафика.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 260 баллов",
    },
    universities: [
      {
        name: "БНТУ",
        faculty: "АТФ",
        specialty: "Организация дорожного движения и транспортное планирование",
      },
    ],
    colleges: [],
    skills: ["ГИС-системы", "Моделирование трафика", "Урбанистика"],
    softSkills: ["Пространственное мышление", "Системный подход"],
    careerPath: [
      "Инженер-проектировщик",
      "Главный инженер",
      "Урбанист-эксперт",
    ],
  },
  {
    id: 18,
    title: "Тканевый инженер",
    image:
      "https://storage.edunetwork.ru/professions/images/530/3b486c6e-5987-4aa2-84f0-12490c1d97af.webp",
    direction: "Биотехнологии",
    educationLevel: "Вуз",
    subjects: ["Биология", "Химия"],
    salaryMin: 2200,
    salaryMax: 4500,
    demand: "Новый",
    description:
      "Выращивает искусственные органы и ткани для трансплантации с помощью 3D-биопринтеров.",
    perspectives:
      "Научная фантастика, ставшая реальностью. Специалисты работают в передовых РНПЦ.",
    entranceExams: {
      subject1: "Биология (ЦТ/ЦЭ)",
      subject2: "Химия (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 350 баллов",
    },
    universities: [
      {
        name: "БГУ",
        faculty: "Биологический",
        specialty: "Фундаментальная и прикладная биотехнология (6 лет)",
      },
      { name: "БГТУ", faculty: "ТОВ", specialty: "Биотехнология" },
    ],
    colleges: [],
    skills: ["Клеточная биология", "Работа с 3D-биопринтерами", "Гистология"],
    softSkills: ["Терпеливость", "Научный энтузиазм"],
    careerPath: ["Лаборант", "Научный сотрудник", "Руководитель лаборатории"],
  },
  {
    id: 19,
    title: "Менеджер цифровой трансформации",
    image:
      "https://png.pngtree.com/background/20230330/original/pngtree-the-digital-transformation-and-digitalization-technology-concept-digital-transformation-and-digitalization-picture-image_2215343.jpg",
    direction: "Управление",
    educationLevel: "Вуз",
    subjects: ["Математика", "Языки"],
    salaryMin: 2000,
    salaryMax: 4500,
    demand: "Растущий",
    description:
      "Переводит традиционные компании (заводы, банки, ритейл) на современные цифровые рельсы.",
    perspectives:
      "Абсолютно любой крупный бизнес сейчас нуждается в таких управленцах.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Иностранный язык (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 365 баллов",
    },
    universities: [
      { name: "БГЭУ", faculty: "ФЦЭ", specialty: "Цифровая экономика" },
      {
        name: "БГУ",
        faculty: "Экономический",
        specialty: "Экономическая информатика",
      },
    ],
    colleges: [],
    skills: ["Бизнес-анализ", "Agile/Scrum", "Основы ИТ-архитектуры"],
    softSkills: ["Лидерство", "Коммуникабельность", "Умение убеждать"],
    careerPath: [
      "Бизнес-аналитик",
      "Project Manager",
      "CDTO (Директор по цифре)",
    ],
  },
  {
    id: 20,
    title: "Разработчик образовательных VR-программ",
    image:
      "https://avatars.mds.yandex.net/i?id=475996dc8a730900b137020fe13711b1_l-5272716-images-thumbs&ref=rim&n=13&w=1920&h=1280",
    direction: "Образование",
    educationLevel: "Вуз",
    subjects: ["Математика", "История", "Информатика"],
    salaryMin: 1800,
    salaryMax: 3500,
    demand: "Новый",
    description:
      "Создает симуляции для школ и вузов: от виртуальных химических лабораторий до экскурсий в Древний Рим.",
    perspectives:
      "EdTech (образовательные технологии) - один из самых быстрорастущих рынков в мире.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 280 баллов",
    },
    universities: [
      {
        name: "БГПУ",
        faculty: "ФМИТ",
        specialty: "Информатика и образовательные технологии",
      },
    ],
    colleges: [],
    skills: ["Педагогический дизайн", "Основы Unity", "Сценаристика"],
    softSkills: ["Эмпатия", "Творческое мышление"],
    careerPath: [
      "Методист",
      "VR-разработчик",
      "Продюсер образовательных продуктов",
    ],
  },
  {
    id: 21,
    title: "Мастер по обслуживанию электромобилей (EV-механик)",
    image: "https://cont.ws/uploads/pic/2022/11/1%20%2894%29.webp",
    direction: "Инженерия",
    educationLevel: "Колледж",
    subjects: ["Физика", "Математика"],
    salaryMin: 2200,
    salaryMax: 4200,
    demand: "Растущий",
    description:
      "Специалист, который занимается диагностикой высоковольтных батарей, ремонтом электродвигателей и прошивкой программного обеспечения электрокаров.",
    perspectives:
      "С учетом сборки электромобилей в РБ (БЕЛДЖИ) и роста их числа на дорогах, спрос на таких мастеров на СТО превышает предложение в несколько раз.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 7.2 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "МГАК (Минский автомеханический колледж)",
        specialty: "Техническое обслуживание и ремонт транспортных средств",
      },
    ],
    skills: [
      "Диагностика высоковольтных систем",
      "Автоэлектрика",
      "Чтение электросхем",
      "Пайка",
    ],
    softSkills: ["Внимательность", "Осторожность", "Логическое мышление"],
    careerPath: ["Помощник автоэлектрика", "EV-мастер", "Начальник СТО"],
  },
  {
    id: 22,
    title: "Техник-наладчик систем IoT (Интернет вещей)",
    image:
      "https://instrumentationtools.com/wp-content/uploads/2025/02/image.gif",
    direction: "IT",
    educationLevel: "Колледж",
    subjects: ["Информатика", "Физика"],
    salaryMin: 1700,
    salaryMax: 3200,
    demand: "Новый",
    description:
      "Специалист, который физически устанавливает и настраивает умные датчики для ЖКХ, заводов, камер видеонаблюдения и умных остановок.",
    perspectives:
      "Цифровизация городской среды и предприятий идет полным ходом, требуются «руки», способные это монтировать и обслуживать.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 7.8 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "МГКЦТ (Минский колледж цифровых технологий)",
        specialty: "Микроэлектроника и программное обеспечение",
      },
      {
        name: "Колледж ИКТ (Белорусская академия связи)",
        specialty: "Телекоммуникационные системы",
      },
    ],
    skills: [
      "Монтаж сетей связи",
      "Настройка датчиков",
      "Основы Linux",
      "Схемотехника",
    ],
    softSkills: ["Аккуратность", "Умение решать проблемы на месте"],
    careerPath: [
      "Электромонтер",
      "Техник-наладчик",
      "Старший системный инженер",
    ],
  },
  {
    id: 23,
    title: "Наладчик мехатронных систем (Робототехника)",
    image:
      "https://avatars.mds.yandex.net/i?id=c127642d10a062758caef3da7090bbb5_l-5244992-images-thumbs&ref=rim&n=13&w=2048&h=1365",
    direction: "Инженерия",
    educationLevel: "Колледж",
    subjects: ["Математика", "Физика"],
    salaryMin: 1900,
    salaryMax: 3800,
    demand: "Стабильный",
    description:
      "Обслуживает производственных роботов на заводах, программирует станки с ЧПУ, следит за исправностью пневматики и гидравлики автоматических линий.",
    perspectives:
      "Машиностроительные гиганты РБ постоянно закупают новых роботов. Без мехатроников заводы просто остановятся.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 7.5 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "КСТМиА РИПО (Колледж современных технологий в машиностроении)",
        specialty: "Мехатроника",
      },
    ],
    skills: [
      "Программирование ПЛК",
      "Пневматика",
      "Гидравлика",
      "Чтение чертежей",
    ],
    softSkills: ["Аналитический склад ума", "Стрессоустойчивость"],
    careerPath: [
      "Наладчик 4-го разряда",
      "Наладчик 6-го разряда",
      "Мастер цеха",
    ],
  },
  {
    id: 24,
    title: "BIM-техник (Чертежник умных зданий)",
    image:
      "https://img.freepik.com/premium-photo/engineer-collaborates-digital-twin-project-using-bim-technology-urban-architectural-design_937679-70199.jpg",
    direction: "Строительство",
    educationLevel: "Колледж",
    subjects: ["Математика", "Информатика"],
    salaryMin: 2000,
    salaryMax: 4000,
    demand: "Растущий",
    description:
      "Создает цифровые 3D-модели зданий (BIM) со всеми коммуникациями (трубы, провода). Помогает архитекторам находить ошибки до начала стройки.",
    perspectives:
      "По госпрограмме стройотрасль РБ переходит на BIM-технологии. Обычные 2D-чертежи уходят в прошлое.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 8.0 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "МГАСК (Минский архитектурно-строительный колледж)",
        specialty: "Архитектурное проектирование",
      },
    ],
    skills: ["Revit", "AutoCAD", "ArchiCAD", "Чтение проектной документации"],
    softSkills: ["Пространственное мышление", "Усидчивость", "Педантичность"],
    careerPath: ["Младший чертежник", "BIM-техник", "BIM-координатор"],
  },
  {
    id: 25,
    title: "Лаборант биотехнологического анализа",
    image:
      "https://xn--b1adaebrf2ajbak1aepg.xn--p1ai/upload/iblock/190/kraski0247_as_smart_object_1_copy_2.jpg",
    direction: "Биотехнологии",
    educationLevel: "Колледж",
    subjects: ["Биология", "Химия"],
    salaryMin: 1600,
    salaryMax: 2700,
    demand: "Растущий",
    description:
      "Берет пробы, проводит химические и микробиологические анализы сырья для производства эко-продуктов, лекарств и косметики.",
    perspectives:
      "Пищевая промышленность РБ переходит на новые стандарты качества. Каждому современному заводу нужна своя биотех-лаборатория.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 7.5 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "Смиловичский государственный аграрный колледж",
        specialty: "Ветеринарная и санитарная экспертиза",
      },
    ],
    skills: [
      "Микроскопия",
      "Титриметрия",
      "Работа с центрифугой",
      "Соблюдение ГОСТов",
    ],
    softSkills: ["Скрупулезность", "Любовь к чистоте и порядку"],
    careerPath: ["Младший лаборант", "Старший лаборант", "Техник-микробиолог"],
  },
  {
    id: 26,
    title: "Специалист по разработке и сопровождению веб-ресурсов",
    image:
      "https://finance-news-media.fra1.cdn.digitaloceanspaces.com/prod/7/8/78b6c0253d700ba72541a247aba8c4da",
    direction: "IT",
    educationLevel: "Колледж",
    subjects: ["Информатика", "Математика"],
    salaryMin: 2000,
    salaryMax: 5000,
    demand: "Растущий",
    description:
      "Занимается созданием, версткой, программированием и поддержкой современных веб-сайтов и веб-приложений.",
    perspectives:
      "IT-сектор в Беларуси активно нанимает выпускников колледжей на позиции Junior-разработчиков. Это отличный старт карьеры.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 9.2 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "Колледж ИКТ (Белорусская государственная академия связи)",
        specialty: "Разработка и сопровождение веб-ресурсов",
      },
    ],
    skills: ["HTML/CSS", "JavaScript", "Vue/React", "Основы баз данных"],
    softSkills: ["Усидчивость", "Умение мыслить логически", "Работа в команде"],
    careerPath: ["Junior Frontend Developer", "Middle Developer", "Team Lead"],
  },
  {
    id: 27,
    title: "Промпт-инженер (Специалист по нейросетям)",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.vGvB-M-KOAPzl9rJZTRkKAHaD4?r=0&w=1280&h=670&rs=1&pid=ImgDetMain&o=7&rm=3",
    direction: "IT",
    educationLevel: "Вуз",
    subjects: ["Математика", "Иностранный язык", "Информатика"],
    salaryMin: 2000,
    salaryMax: 4500,
    demand: "Новый",
    description:
      "Учит нейросети (ChatGPT, Midjourney) выполнять сложные бизнес-задачи, формулируя правильные текстовые запросы (промпты).",
    perspectives:
      "Самая популярная профессия десятилетия. Нужна во всех сферах: от маркетинга до программирования.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Иностранный язык (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 360 баллов",
    },
    universities: [
      { name: "БГУИР", faculty: "ФИТиУ", specialty: "Искусственный интеллект" },
      { name: "БГУ", faculty: "Мехмат", specialty: "Математика и ИТ" },
    ],
    colleges: [],
    skills: [
      "Prompt Engineering",
      "Основы Python",
      "NLP (Natural Language Processing)",
      "API интеграции",
    ],
    softSkills: [
      "Аналитическое мышление",
      "Креативность",
      "Умение четко формулировать мысли",
    ],
    careerPath: ["Младший аналитик ИИ", "Промпт-инженер", "AI-архитектор"],
  },
  {
    id: 28,
    title: "Киберследователь (Цифровая криминалистика)",
    image:
      "https://media.istockphoto.com/id/1308842397/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BD%D0%B0%D0%B4-%D1%8D%D1%82%D0%B8%D0%BC-%D0%B4%D0%B5%D0%BB%D0%BE%D0%BC-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%D0%B5%D1%82-%D1%80%D0%B0%D0%B7%D0%B2%D0%B5%D0%B4%D1%8B%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0.jpg?s=612x612&w=0&k=20&c=xAjqMRHC8zs6tVqS_MCikFjI3FtynI8ta7Iwctygiao=",
    direction: "Управление",
    educationLevel: "Вуз",
    subjects: ["Обществоведение", "Иностранный язык"],
    salaryMin: 2200,
    salaryMax: 4000,
    demand: "Растущий",
    description:
      "Расследует преступления в интернете: взломы, кражи криптовалют, телефонное мошенничество. Собирает цифровые улики.",
    perspectives:
      "Количество киберпреступлений растет каждый год. Специалисты на вес золота в Следственном комитете и МВД РБ.",
    entranceExams: {
      subject1: "Обществоведение (ЦТ/ЦЭ)",
      subject2: "Иностранный язык (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 340 баллов",
    },
    universities: [
      {
        name: "Академия МВД РБ",
        faculty: "Криминальной милиции",
        specialty: "Противодействие киберпреступлениям и компьютерная разведка",
      },
      { name: "БГУ", faculty: "Юридический", specialty: "Правоведение" },
    ],
    colleges: [],
    skills: [
      "Сетевой анализ",
      "OSINT (поиск по открытым данным)",
      "Криптография",
      "Знание законов РБ",
    ],
    softSkills: [
      "Внимательность",
      "Стрессоустойчивость",
      "Психологическая стойкость",
    ],
    careerPath: [
      "Оперуполномоченный",
      "Старший следователь",
      "Начальник отдела кибербезопасности",
    ],
  },
  {
    id: 29,
    title: "FoodTech-технолог (Специалист по альтернативному питанию)",
    image:
      "https://plus.unsplash.com/premium_photo-1661962510909-4be27f3637a2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    direction: "Биотехнологии",
    educationLevel: "Вуз",
    subjects: ["Химия", "Биология"],
    salaryMin: 1800,
    salaryMax: 3500,
    demand: "Новый",
    description:
      "Разрабатывает новые продукты питания: растительное мясо, безлактозное молоко, протеиновые коктейли из насекомых.",
    perspectives:
      "Мир переходит на экологичную еду. В РБ пищевая промышленность — одна из самых сильных отраслей экономики.",
    entranceExams: {
      subject1: "Химия (ЦТ/ЦЭ)",
      subject2: "Биология (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 240 баллов",
    },
    universities: [
      {
        name: "БГУТ (г. Могилев)",
        faculty: "Технологический",
        specialty: "Технология пищевых производств",
      },
    ],
    colleges: [],
    skills: [
      "Пищевая химия",
      "Микробиология",
      "Работа с ферментерами",
      "ГОСТы и сертификация",
    ],
    softSkills: ["Креативность", "Интерес к ЗОЖ", "Аккуратность"],
    careerPath: [
      "Помощник технолога",
      "Главный технолог",
      "R&D директор (разработка новых продуктов)",
    ],
  },
  {
    id: 30,
    title: "Диспетчер умных энергосетей (Smart Grid)",
    image:
      "https://plus.unsplash.com/premium_photo-1716259490200-e77e7fdccfe4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFNtYXJ0JTIwR3JpZCUyMERpc3BhdGNoZXJ8ZW58MHx8MHx8fDA%3D",
    direction: "Энергетика",
    educationLevel: "Колледж",
    subjects: ["Математика", "Физика"],
    salaryMin: 2000,
    salaryMax: 3700,
    demand: "Стабильный",
    description:
      "Управляет распределением электроэнергии между электростанциями, ветряками и умными домами через компьютерные системы.",
    perspectives:
      "С вводом БелАЭС энергосистема страны усложняется, требуя цифрового контроля за перетоками энергии.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 7.8 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "Минский государственный энергетический колледж",
        specialty: "Автоматизация и управление энергетическими процессами",
      },
    ],
    skills: ["АСУ ТП", "Электротехника", "Работа со SCADA-системами"],
    softSkills: [
      "Хладнокровие",
      "Способность быстро принимать решения",
      "Высокая концентрация",
    ],
    careerPath: [
      "Дежурный диспетчер",
      "Старший диспетчер",
      "Начальник смены энергоузла",
    ],
  },
  {
    id: 31,
    title: "E-commerce логист (Архитектор маркетплейсов)",
    image:
      "https://i.pinimg.com/736x/c5/d3/67/c5d36731983ae3fa604852bffd72def9.jpg",
    direction: "Логистика",
    educationLevel: "Вуз",
    subjects: ["Математика", "Иностранный язык"],
    salaryMin: 1700,
    salaryMax: 4000,
    demand: "Растущий",
    description:
      "Строит оптимальные маршруты доставки товаров от продавца до покупателя для крупных маркетплейсов (Wildberries, Ozon).",
    perspectives:
      "Интернет-торговля растет на десятки процентов в год. Умение дешево и быстро доставить товар ценится очень высоко.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Иностранный язык (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 315 баллов",
    },
    universities: [
      {
        name: "БГЭУ",
        faculty: "Маркетинга и логистики",
        specialty: "Логистика",
      },
      { name: "БНТУ", faculty: "ФТУГ", specialty: "Транспортная логистика" },
    ],
    colleges: [],
    skills: [
      "Анализ цепочек поставок",
      "Работа в ERP-системах",
      "Таможенное право",
      "Аналитика данных",
    ],
    softSkills: ["Системное мышление", "Умение вести переговоры"],
    careerPath: [
      "Менеджер по логистике",
      "Руководитель цепочек поставок",
      "Директор по операциям (COO)",
    ],
  },
  {
    id: 32,
    title: "Тренд-вотчер (Аналитик цифровых трендов)",
    image:
      "https://media.istockphoto.com/id/2264719422/photo/business-analyst-and-marketing-coach-examine-kpi-dashboards.jpg?s=612x612&w=0&k=20&c=UGnVu16u3-0a-4-L2saSSfLekzdv5hzER9qkfM6Ueyw=",
    direction: "Креатив",
    educationLevel: "Вуз",
    subjects: ["Обществоведение", "История"],
    salaryMin: 1600,
    salaryMax: 3500,
    demand: "Новый",
    description:
      "Изучает изменения в поведении людей в интернете, соцсетях и культуре, чтобы предсказать, что будет модно завтра.",
    perspectives:
      "Крупные бренды и IT-компании готовы платить за понимание того, какой продукт нужно создавать для зумеров и альфа.",
    entranceExams: {
      subject1: "Обществоведение (ЦТ/ЦЭ)",
      subject2: "История Беларуси (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 330 баллов",
    },
    universities: [
      {
        name: "БГУ",
        faculty: "ФФСН",
        specialty: "Социология (Цифровая социология)",
      },
      { name: "БГЭУ", faculty: "ФМК", specialty: "Маркетинг" },
    ],
    colleges: [],
    skills: [
      "Социологические исследования",
      "Веб-аналитика",
      "Мониторинг соцсетей",
      "Презентация данных",
    ],
    softSkills: ["Любопытство", "Эмпатия", "Широкий кругозор"],
    careerPath: [
      "Младший аналитик",
      "Тренд-вотчер",
      "Директор по стратегии продукта",
    ],
  },
  {
    id: 33,
    title: "Инженер-реабилитолог (Разработчик бионических протезов)",
    image:
      "https://avatars.mds.yandex.net/i?id=092e2e070adf94dd3b3132fb3ddaadf0ecbb0704-3605663-images-thumbs&n=13",
    direction: "Инженерия",
    educationLevel: "Вуз",
    subjects: ["Физика", "Математика"],
    salaryMin: 2100,
    salaryMax: 4200,
    demand: "Новый",
    description:
      "Проектирует умные экзоскелеты и протезы, которые управляются силой мысли (электрическими импульсами мышц).",
    perspectives:
      "Профессия объединяет благородную миссию помощи людям и передовую робототехнику.",
    entranceExams: {
      subject1: "Математика (ЦТ/ЦЭ)",
      subject2: "Физика (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 295 баллов",
    },
    universities: [
      {
        name: "БНТУ",
        faculty: "Приборостроительный",
        specialty: "Биотехнические и медицинские аппараты и системы",
      },
    ],
    colleges: [],
    skills: [
      "3D-моделирование (CAD)",
      "Биомеханика",
      "Основы нейрофизиологии",
      "Схемотехника",
    ],
    softSkills: ["Гуманизм", "Изобретательность", "Терпение"],
    careerPath: [
      "Инженер-конструктор",
      "Ведущий разработчик протезов",
      "Руководитель медтех-лаборатории",
    ],
  },
  {
    id: 34,
    title: "Оператор медицинских роботов и сложной медтехники",
    image:
      "https://media.istockphoto.com/id/1530778744/photo/two-surgeons-observing-high-precision-programmable-automated-robot-arms-operating-patient-in.jpg?s=612x612&w=0&k=20&c=tDxIq3DYEegmdJ2IVv2l47URxH-UULA--uhPc7rI4OE=",
    direction: "Медицина",
    educationLevel: "Колледж",
    subjects: ["Биология", "Физика"],
    salaryMin: 1800,
    salaryMax: 3200,
    demand: "Растущий",
    description:
      "Настраивает и обслуживает хирургических роботов (например, Da Vinci), сложные аппараты МРТ и системы жизнеобеспечения в больницах.",
    perspectives:
      "Больницы Беларуси активно закупают высокотехнологичное оборудование, а врачи не должны отвлекаться на его техническую настройку.",
    entranceExams: {
      subject1: "Конкурс среднего балла аттестата",
      subject2: "",
      subject3: "",
      passingScore: "от 8.5 баллов",
    },
    universities: [],
    colleges: [
      {
        name: "Белорусский государственный медицинский колледж (Минск)",
        specialty: "Медико-диагностическое дело",
      },
    ],
    skills: [
      "Работа со сложным оборудованием",
      "Основы физиологии",
      "Техническая диагностика",
      "Стерильность",
    ],
    softSkills: [
      "Внимательность",
      "Стрессоустойчивость",
      "Ответственность за чужую жизнь",
    ],
    careerPath: [
      "Ассистент-оператор",
      "Старший техник оперблока",
      "Главный специалист по медтехнике клиники",
    ],
  },
  {
    id: 35,
    title: "Агроэколог (Специалист по устойчивому развитию АПК)",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1920&auto=format&fit=crop",
    direction: "Экология",
    educationLevel: "Вуз",
    subjects: ["Биология", "Химия"],
    salaryMin: 1800,
    salaryMax: 3200,
    demand: "Стабильный",
    description:
      "Следит за тем, чтобы сельскохозяйственные предприятия не отравляли почву и воду пестицидами. Внедряет экологически чистые методы земледелия.",
    perspectives:
      "Без эко-сертификатов белорусские продукты не смогут продаваться на экспорт. Это важнейшая профессия для экономики.",
    entranceExams: {
      subject1: "Биология (ЦТ/ЦЭ)",
      subject2: "Химия (ЦТ/ЦЭ)",
      subject3: "Белорусский/русский язык (ЦТ/ЦЭ)",
      passingScore: "от 220 баллов",
    },
    universities: [
      {
        name: "БГСХА",
        faculty: "Агроэкологический",
        specialty: "Экология сельского хозяйства",
      },
    ],
    colleges: [],
    skills: [
      "Химический анализ почвы",
      "Эко-аудит",
      "Основы ботаники",
      "Знание эко-стандартов",
    ],
    softSkills: [
      "Принципиальность",
      "Любовь к природе",
      "Аналитическое мышление",
    ],
    careerPath: [
      "Эколог предприятия",
      "Эко-инспектор",
      "Руководитель направления устойчивого развития",
    ],
  },
];

// Массив историй успеха (10 историй)
const storiesData = [
  {
    id: 1,
    name: "Алексей Корж",
    profession: "Разработчик беспилотных систем",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    shortText:
      "С детства я увлекался авиамоделированием. После школы решил, что хобби должно стать профессией, и поступил в БГУИР...",
    fullText:
      "С детства я увлекался авиамоделированием. После школы решил, что хобби должно стать профессией, и поступил в БГУИР на факультет компьютерного проектирования. Обучение дало мощную базу в схемотехнике и программировании микроконтроллеров.<br><br><b>Путь к успеху:</b> На 3-м курсе я попал на стажировку в минскую компанию, занимающуюся агродронами. Сначала тестировал прошивки, а через год стал полноценным разработчиком. Сейчас я руковожу отделом, мы создаем беспилотники для мониторинга лесных пожаров и сельскохозяйственных полей.<br><br><b>О профессии:</b> Это уникальный стык инженерии, программирования и аэродинамики. Отрасль в Беларуси активно растет, и хорошие специалисты ценятся на вес золота.",
  },
  {
    id: 2,
    name: "Елена Савицкая",
    profession: "Специалист по кибербезопасности",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    shortText:
      "Мой путь начался с того, что у меня взломали аккаунт в соцсети. Мне стало интересно, как это работает, и я пошла в БГУ...",
    fullText:
      "Мой путь начался с того, что у меня взломали аккаунт в соцсети. Мне стало безумно интересно, как это технически работает, и я пошла на ФПМИ БГУ изучать кибербезопасность.<br><br><b>Путь к успеху:</b> Параллельно с учебой я проходила курсы по этичному хакингу. Участвовала в CTF-соревнованиях, где меня заметили рекрутеры крупного банка. Начинала младшим аналитиком SOC, а сейчас работаю Senior Security Engineer. Мы защищаем персональные данные миллионов клиентов от кибератак.<br><br><b>О профессии:</b> Кибербезопасность — это постоянная игра в шахматы со злоумышленниками. Нужно всегда быть на шаг впереди. Профессия невероятно востребованная и высокооплачиваемая как в Беларуси, так и во всем мире.",
  },
  {
    id: 3,
    name: "Дмитрий Новик",
    profession: "Сити-фермер",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    shortText:
      "Многие думают, что сельское хозяйство — это тракторы и грязь. Я доказал обратное, открыв вертикальную ферму прямо в центре Минска...",
    fullText:
      "Многие думают, что сельское хозяйство — это тракторы и грязь. Я доказал обратное, открыв вертикальную ферму прямо в центре Минска. Я окончил БГСХА по специальности «Агрономия», но всегда интересовался новыми технологиями.<br><br><b>Путь к успеху:</b> Изучив гидропонику и IoT (интернет вещей), я собрал свою первую установку в гараже. Выращивал микрозелень и продавал в местные рестораны. Сегодня у меня огромная автоматизированная ферма на территории бывшего завода, где климатом, освещением и поливом управляет искусственный интеллект.<br><br><b>О профессии:</b> Сити-фермерство позволяет выращивать экологически чистую еду в черте города круглый год, минимизируя расходы на логистику. Это профессия, которая спасает экологию.",
  },
  {
    id: 4,
    name: "Мария Луговская",
    profession: "Тканевый инженер",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    shortText:
      "В школе я разрывалась между биологией и инженерией. Выбрала биологический факультет БГУ и ни разу не пожалела...",
    fullText:
      "В школе я разрывалась между биологией и инженерией. Выбрала биологический факультет БГУ и ни разу не пожалела об этом выборе.<br><br><b>Путь к успеху:</b> После университета я устроилась в исследовательский институт, где мы занимаемся разработкой биосовместимых материалов. Сейчас моя команда работает над прорывным проектом 3D-биопечати хрящевой ткани. Мы уже успешно тестируем образцы в лабораторных условиях.<br><br><b>О профессии:</b> Тканевая инженерия — это настоящая медицина будущего. Мы буквально учимся создавать «запасные части» для человеческого тела. Это требует глубоких знаний в биологии, клеточной химии и материаловедении.",
  },
  {
    id: 5,
    name: "Павел Крук",
    profession: "Инженер возобновляемой энергетики",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
    shortText:
      "Я всегда хотел сделать мир чище. Поступив в БНТУ на энергетический факультет, я понял, что будущее стоит за зелеными технологиями...",
    fullText:
      "Я всегда хотел сделать мир чище и экологичнее. Поступив в БНТУ на энергетический факультет, я окончательно понял, что будущее стоит исключительно за зелеными технологиями.<br><br><b>Путь к успеху:</b> Свой дипломный проект я посвятил оптимизации ветрогенераторов для наших широт. После выпуска пошел работать инженером-проектировщиком солнечных электростанций. Сейчас руковожу масштабным проектом по внедрению умных энергосетей (Smart Grid) в одном из регионов Беларуси.<br><br><b>О профессии:</b> Глобальный переход на возобновляемые источники энергии неизбежен. Мы проектируем, строим и обслуживаем системы, которые генерируют чистую энергию. Это не только прибыльно, но и критически важно для будущего нашей планеты.",
  },
  {
    id: 6,
    name: "Максим Ковалев",
    profession: "Специалист по разработке и сопровождению веб-ресурсов",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    shortText:
      "После 9 класса я решил не тратить время на школу и поступил в Колледж ИКТ. Это было лучшее решение в моей жизни...",
    fullText:
      "После 9 класса я решил не тратить время на школу и поступил в Колледж ИКТ на специальность по веб-разработке. Мне хотелось как можно быстрее начать делать реальные проекты.<br><br><b>Путь к успеху:</b> Уже на втором курсе я сверстал свой первый сайт на заказ. В колледже дали отличную базу по HTML, CSS и JavaScript. На преддипломной практике меня пригласили Junior-разработчиком в минскую IT-компанию. Сейчас мне 20 лет, я Middle Frontend-разработчик и сам провожу собеседования для новичков.<br><br><b>О профессии:</b> Веб-разработка — это идеальный старт в IT. Главное здесь не диплом вуза, а реальные навыки, портфолио и умение постоянно учиться новому.",
  },
  {
    id: 7,
    name: "Анна Зимина",
    profession: "BIM-техник (Чертежник умных зданий)",
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
    shortText:
      "Я всегда любила рисовать и геометрию, поэтому пошла в архитектурно-строительный колледж. Но обычные чертежи быстро наскучили...",
    fullText:
      "Я всегда любила рисовать и геометрию, поэтому пошла в МГАСК. Но обычные плоские чертежи на бумаге быстро наскучили. Тогда я узнала про BIM-технологии — создание информационных 3D-моделей зданий.<br><br><b>Путь к успеху:</b> Я начала самостоятельно изучать программу Revit. Мой дипломный проект был полностью выполнен в 3D с автоматическим расчетом материалов. Меня сразу забрали в крупное проектное бюро. Мы строим современные жилые комплексы: я объединяю архитектуру, трубы и электрику в одну модель, чтобы избежать ошибок на стройке.<br><br><b>О профессии:</b> BIM-проектирование — это как играть в The Sims, но по-взрослому. За этой технологией будущее всего строительства в Беларуси.",
  },
  {
    id: 8,
    name: "Илья Разумовский",
    profession: "Дата-журналист",
    photo: "https://randomuser.me/api/portraits/men/29.jpg",
    shortText:
      "На журфаке БГУ я понял, что слова без доказательств мало кого убеждают. Я начал изучать анализ данных и инфографику...",
    fullText:
      "На журфаке БГУ я понял, что красивые слова без доказательств мало кого убеждают в современном мире. Люди верят цифрам. Поэтому я начал параллельно изучать Excel, основы SQL и визуализацию данных.<br><br><b>Путь к успеху:</b> Свое первое громкое расследование я сделал на основе открытых данных о закупках. Вместо простыни текста я выдал читателям интерактивный график. Сейчас я руковожу отделом дата-спецпроектов в крупном медиахолдинге. Мы анализируем всё: от демографии до изменений климата в Беларуси.<br><br><b>О профессии:</b> Дата-журналист — это детектив с навыками программиста. Профессия супер-творческая, но при этом требует строгой логики и математической точности.",
  },
  {
    id: 9,
    name: "Денис Тарасов",
    profession: "Мастер по обслуживанию электромобилей",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    shortText:
      "С детства копался в гараже с моторами. Когда увидел первую Tesla, понял: двигатели внутреннего сгорания — это прошлый век...",
    fullText:
      "С детства я копался в гараже с дедушкой, перебирая моторы старых «Жигулей». Но когда я впервые увидел в Минске электромобиль, понял: двигатели внутреннего сгорания — это прошлый век. Я поступил в автомеханический колледж.<br><br><b>Путь к успеху:</b> На практике я напросился на специализированную СТО по электрокарам. Начинал с банальной замены фильтров салона, но упорно читал мануалы по высоковольтным батареям. Сегодня у меня свой сервис. Мы ремонтируем батареи, перепрошиваем софт и устанавливаем зарядные станции.<br><br><b>О профессии:</b> Электричек на дорогах становится всё больше с каждым днем. Быть EV-механиком сейчас — это гарантировать себе очередь из клиентов на месяцы вперед.",
  },
  {
    id: 10,
    name: "Дарья Волкова",
    profession: "Генетический консультант",
    photo: "https://randomuser.me/api/portraits/women/49.jpg",
    shortText:
      "На лечебном факультете БГМУ я осознала, что медицина должна не лечить болезни, а предотвращать их. Так я пришла в генетику...",
    fullText:
      "На лечебном факультете БГМУ я осознала, что медицина должна не столько лечить уже запущенные болезни, сколько предотвращать их появление. Так я углубилась в медицинскую генетику.<br><br><b>Путь к успеху:</b> После ординатуры я устроилась в РНПЦ «Мать и дитя», а затем перешла в частную лабораторию предиктивной медицины. Ко мне приходят люди, чтобы расшифровать свой геном. Я анализирую ДНК и составляю персонализированный план: какие витамины пить, какой спорт выбрать и риск каких болезней у них повышен.<br><br><b>О профессии:</b> Генетика — это чтение инструкции к человеку. Мы помогаем людям жить дольше и качественнее. В ближайшие годы геномный паспорт будет у каждого, и специалисты моего профиля станут самыми востребованными врачами.",
  },
];
