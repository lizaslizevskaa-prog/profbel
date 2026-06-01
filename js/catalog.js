document.addEventListener("DOMContentLoaded", () => {
  const catalogGrid = document.getElementById("catalogGrid");
  const noResults = document.getElementById("noResults");
  const resultsCount = document.getElementById("resultsCount");

  // Элементы фильтров
  const searchFilter = document.getElementById("searchFilter");
  const directionFilter = document.getElementById("directionFilter");
  const eduRadios = document.querySelectorAll('input[name="eduFilter"]');
  const subjectCheckboxes = document.querySelectorAll(".subject-cb");
  const demandRadios = document.querySelectorAll('input[name="demandFilter"]');
  const resetBtn = document.getElementById("resetFilters");

  // Переменные для jQuery UI Slider
  let minSalary = 0;
  let maxSalary = 5000;

  // ИНИЦИАЛИЗАЦИЯ JQUERY UI СЛАЙДЕРА
  $(function () {
    $("#salarySlider").slider({
      range: true,
      min: 0,
      max: 5000,
      step: 100,
      values: [0, 5000],
      slide: function (event, ui) {
        let maxText = ui.values[1] === 5000 ? "5000+" : ui.values[1];
        $("#salaryAmount").text(ui.values[0] + " - " + maxText);
      },
      change: function (event, ui) {
        minSalary = ui.values[0];
        maxSalary = ui.values[1];
        applyFilters();
      },
    });
  });

  // ОСНОВНАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ
  function applyFilters() {
    let filtered = professions;

    // 1. Поиск (Текст)
    const searchText = searchFilter.value.toLowerCase().trim();
    if (searchText) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchText) ||
          p.description.toLowerCase().includes(searchText),
      );
    }

    // 2. Направление
    const dirVal = directionFilter.value;
    if (dirVal !== "Все") {
      filtered = filtered.filter((p) => p.direction === dirVal);
    }

    // 3. Образование
    const eduVal = document.querySelector(
      'input[name="eduFilter"]:checked',
    ).value;
    if (eduVal !== "Все") {
      filtered = filtered.filter((p) => p.educationLevel.includes(eduVal));
    }

    // 4. Предметы
    const selectedSubjects = Array.from(subjectCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((p) =>
        selectedSubjects.some((sub) => p.subjects.includes(sub)),
      );
    }

    // 5. Зарплата
    filtered = filtered.filter((p) => {
      const matchMin = p.salaryMax >= minSalary;
      const matchMax = maxSalary >= 5000 ? true : p.salaryMin <= maxSalary;
      return matchMin && matchMax;
    });

    // 6. Востребованность
    const demandVal = document.querySelector(
      'input[name="demandFilter"]:checked',
    ).value;
    if (demandVal !== "Все") {
      filtered = filtered.filter((p) => p.demand === demandVal);
    }

    renderCatalog(filtered);
  }

  // РЕНДЕР КАТАЛОГА
  function renderCatalog(data) {
    catalogGrid.innerHTML = "";
    resultsCount.textContent = data.length;

    if (data.length === 0) {
      noResults.classList.remove("d-none");
      return;
    } else {
      noResults.classList.add("d-none");
    }

    const fragment = document.createDocumentFragment();

    data.forEach((prof) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-xl-4";
      col.innerHTML = `
        <div class="custom-card card h-100 border border-secondary shadow-lg text-light">
          <div class="card-body p-4 d-flex flex-column">
            <span class="badge bg-purple-soft text-purple mb-3 align-self-start border border-purple">${prof.direction}</span>
            <h4 class="card-title fw-bold mb-3">${prof.title}</h4>
            <p class="card-text text-muted-custom small mb-4 flex-grow-1">${prof.description}</p>
            <div class="mb-4">
              <div class="d-flex align-items-center mb-2">
                <i class="fas fa-wallet text-primary-custom me-2"></i>
                <span class="small fw-bold">${prof.salaryMin} – ${prof.salaryMax} BYN</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="fas fa-graduation-cap text-primary-custom me-2"></i>
                <span class="small text-muted-custom">${prof.educationLevel}</span>
              </div>
            </div>
            <a href="profession.html?id=${prof.id}" class="btn btn-outline-cyan w-100 mt-auto">Подробнее</a>
          </div>
        </div>
      `;
      fragment.appendChild(col);
    });

    catalogGrid.appendChild(fragment);
  }

  //  НАСТРОЙКА ФИЛЬТРОВ
  directionFilter.addEventListener("change", applyFilters);
  eduRadios.forEach((radio) => radio.addEventListener("change", applyFilters));
  subjectCheckboxes.forEach((cb) =>
    cb.addEventListener("change", applyFilters),
  );
  demandRadios.forEach((radio) =>
    radio.addEventListener("change", applyFilters),
  );

  // Сброс фильтров
  resetBtn.addEventListener("click", () => {
    searchFilter.value = "";
    directionFilter.value = "Все";
    document.getElementById("eduAll").checked = true;
    subjectCheckboxes.forEach((cb) => (cb.checked = false));
    document.querySelector('input[name="demandFilter"][value="Все"]').checked =
      true;

    $("#salarySlider").slider("values", [0, 5000]);
    $("#salaryAmount").text("0 - 5000+");
    minSalary = 0;
    maxSalary = 5000;

    applyFilters();
  });

  // ========== JQUERY UI AUTOCOMPLETE ДЛЯ ПОИСКА ==========

  function getDirectionIcon(direction) {
    const icons = {
      IT: "fa-code",
      Инженерия: "fa-microchip",
      Медицина: "fa-heartbeat",
      Биотехнологии: "fa-dna",
      Агропром: "fa-seedling",
      Экология: "fa-leaf",
      Энергетика: "fa-solar-panel",
      "Беспилотные системы": "fa-drone",
      Креатив: "fa-palette",
      Логистика: "fa-truck",
      Управление: "fa-chart-line",
      Образование: "fa-graduation-cap",
      Строительство: "fa-hard-hat",
    };
    return icons[direction] || "fa-briefcase";
  }

  function formatSuggestion(prof, query) {
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const highlightedTitle = prof.title.replace(regex, "<mark>$1</mark>");

    return `
      <div class="autocomplete-suggestion">
        <div class="autocomplete-suggestion-icon">
          <i class="fas ${getDirectionIcon(prof.direction)}"></i>
        </div>
        <div class="autocomplete-suggestion-content">
          <div class="autocomplete-suggestion-title">${highlightedTitle}</div>
          <div class="autocomplete-suggestion-direction">
            <i class="fas fa-tag"></i>
            <span>${prof.direction}</span>
            <i class="fas fa-graduation-cap"></i>
            <span>${prof.educationLevel}</span>
          </div>
        </div>
        <div class="autocomplete-suggestion-salary">
          ${prof.salaryMin}–${prof.salaryMax} BYN
        </div>
      </div>
    `;
  }

  let searchTimeout;
  searchFilter.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFilters();
    }, 300);
  });

  // Инициализация jQuery UI Autocomplete
  $(searchFilter).autocomplete({
    source: function (request, response) {
      const query = request.term.toLowerCase();

      const results = professions.filter(
        (prof) =>
          prof.title.toLowerCase().includes(query) ||
          prof.description.toLowerCase().includes(query) ||
          prof.direction.toLowerCase().includes(query),
      );

      const topResults = results.slice(0, 8);

      response(
        topResults.map((prof) => ({
          label: prof.title,
          value: prof.title,
          prof: prof,
          query: query,
        })),
      );
    },

    minLength: 1,
    delay: 200,

    create: function () {
      $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
        const html = formatSuggestion(item.prof, item.query);
        return $("<li>").append($("<div>").html(html)).appendTo(ul);
      };
    },

    select: function (event, ui) {
      event.preventDefault();
      searchFilter.value = ui.item.value;
      $(this).autocomplete("close");
      applyFilters();
      return false;
    },

    open: function () {
      $(".ui-autocomplete").css("animation", "fadeInDown 0.2s ease");
    },
  });

  searchFilter.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  });

  // Настройка иконки лупы
  setTimeout(function () {
    let searchIcon = document.querySelector(".search-input-icon");

    if (searchIcon) {
      searchIcon.style.cursor = "pointer";
      searchIcon.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        applyFilters();
      });
    }
  }, 100);

  // Первоначальный рендер
  renderCatalog(professions);
});
