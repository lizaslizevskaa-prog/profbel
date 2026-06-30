document.addEventListener("DOMContentLoaded", async () => {
  const catalogGrid = document.getElementById("catalogGrid");
  const noResults = document.getElementById("noResults");
  const resultsCount = document.getElementById("resultsCount");

  const searchFilter = document.getElementById("searchFilter");
  const directionFilter = document.getElementById("directionFilter");
  const eduRadios = document.querySelectorAll('input[name="eduFilter"]');
  const subjectCheckboxes = document.querySelectorAll(".subject-cb");
  const demandRadios = document.querySelectorAll('input[name="demandFilter"]');
  const resetBtn = document.getElementById("resetFilters");

  let minSalary = 0;
  let maxSalary = 5000;
  let allProfessions = [];

  try {
    // ИСПРАВЛЕНИЕ: Путь сделан относительным
    const res = await fetch("/api/professions");
    allProfessions = await res.json();
  } catch (err) {
    console.error("Ошибка загрузки каталога:", err);
  }

  if (typeof $ !== "undefined" && $.ui) {
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
  }

  function applyFilters() {
    let filtered = allProfessions;

    const searchText = searchFilter.value.toLowerCase().trim();
    if (searchText) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchText) ||
          p.description.toLowerCase().includes(searchText),
      );
    }

    const dirVal = directionFilter.value;
    if (dirVal !== "Все")
      filtered = filtered.filter((p) => p.direction === dirVal);

    const eduVal = document.querySelector(
      'input[name="eduFilter"]:checked',
    ).value;
    if (eduVal !== "Все")
      filtered = filtered.filter((p) => p.educationLevel.includes(eduVal));

    const selectedSubjects = Array.from(subjectCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.entranceExams) return false;
        const profSubjects = [
          p.entranceExams.subject1,
          p.entranceExams.subject2,
          p.entranceExams.subject3,
        ]
          .filter(Boolean)
          .join(" ");
        return selectedSubjects.some((sub) => profSubjects.includes(sub));
      });
    }

    filtered = filtered.filter((p) => {
      const matchMin = p.salaryMax >= minSalary;
      const matchMax = maxSalary >= 5000 ? true : p.salaryMin <= maxSalary;
      return matchMin && matchMax;
    });

    const demandVal = document.querySelector(
      'input[name="demandFilter"]:checked',
    ).value;
    if (demandVal !== "Все")
      filtered = filtered.filter((p) => p.demand === demandVal);

    renderCatalog(filtered);
  }

  async function renderCatalog(data) {
    catalogGrid.innerHTML = "";
    resultsCount.textContent = data.length;

    if (data.length === 0) {
      noResults.classList.remove("d-none");
      return;
    } else {
      noResults.classList.add("d-none");
    }

    let userFavorites = [];
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // ИСПРАВЛЕНИЕ: Путь сделан относительным
        const res = await fetch("/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          userFavorites = userData.favoriteProfessions || [];
        }
      } catch (e) {}
    }

    const fragment = document.createDocumentFragment();

    data.forEach((prof) => {
      const isFav = userFavorites.includes(String(prof._id));
      const heartClass = isFav
        ? "fas fa-heart text-danger"
        : "far fa-heart text-light";

      const col = document.createElement("div");
      col.className = "col-md-6 col-xl-4";
      col.innerHTML = `
        <div class="custom-card card h-100 border border-secondary shadow-lg text-light position-relative">
          <button class="btn btn-sm position-absolute fav-btn" data-id="${prof._id}" style="top: 15px; right: 15px; z-index: 10; background: rgba(0,0,0,0.5); border-radius: 50%;">
            <i class="${heartClass} fs-5 transition-all"></i>
          </button>
          <div class="card-body p-4 d-flex flex-column">
            <span class="badge bg-purple-soft text-purple mb-3 align-self-start border border-purple">${prof.direction}</span>
            <h4 class="card-title fw-bold mb-3">${prof.title}</h4>
            <p class="card-text text-muted-custom small mb-4 flex-grow-1">${prof.description}</p>
            <div class="mb-4">
              <div class="d-flex align-items-center mb-2"><i class="fas fa-wallet text-primary-custom me-2"></i><span class="small fw-bold">${prof.salaryMin} – ${prof.salaryMax} BYN</span></div>
              <div class="d-flex align-items-center"><i class="fas fa-graduation-cap text-primary-custom me-2"></i><span class="small text-muted-custom">${prof.educationLevel}</span></div>
            </div>
            <a href="profession.html?id=${prof._id}" class="btn btn-outline-cyan w-100 mt-auto">Подробнее</a>
          </div>
        </div>
      `;
      fragment.appendChild(col);
    });
    catalogGrid.appendChild(fragment);

    document.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        if (!token) {
          if (typeof window.showNotification !== "undefined") {
            window.showNotification(
              "Войдите в личный кабинет, чтобы сохранять профессии!",
              "error",
            );
          }
          return;
        }
        const profId = String(e.currentTarget.getAttribute("data-id"));
        const icon = e.currentTarget.querySelector("i");
        try {
          // ИСПРАВЛЕНИЕ: Путь сделан относительным
          const res = await fetch("/api/profile/favorites", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ profId }),
          });
          if (res.ok) {
            if (icon.classList.contains("far")) {
              icon.className = "fas fa-heart text-danger";
              icon.style.transform = "scale(1.2)";
              setTimeout(() => (icon.style.transform = "scale(1)"), 200);
            } else {
              icon.className = "far fa-heart text-light";
            }
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  }

  directionFilter.addEventListener("change", applyFilters);
  eduRadios.forEach((radio) => radio.addEventListener("change", applyFilters));
  subjectCheckboxes.forEach((cb) =>
    cb.addEventListener("change", applyFilters),
  );
  demandRadios.forEach((radio) =>
    radio.addEventListener("change", applyFilters),
  );

  resetBtn.addEventListener("click", () => {
    searchFilter.value = "";
    directionFilter.value = "Все";
    document.getElementById("eduAll").checked = true;
    subjectCheckboxes.forEach((cb) => (cb.checked = false));
    document.querySelector('input[name="demandFilter"][value="Все"]').checked =
      true;
    if (typeof $ !== "undefined" && $.ui) {
      $("#salarySlider").slider("values", [0, 5000]);
      $("#salaryAmount").text("0 - 5000+");
    }
    minSalary = 0;
    maxSalary = 5000;
    applyFilters();
  });

  if (typeof $ !== "undefined" && $.ui) {
    let searchTimeout;
    searchFilter.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => applyFilters(), 300);
    });
    $(searchFilter).autocomplete({
      source: function (request, response) {
        const query = request.term.toLowerCase();
        const results = allProfessions.filter(
          (prof) =>
            prof.title.toLowerCase().includes(query) ||
            prof.description.toLowerCase().includes(query) ||
            prof.direction.toLowerCase().includes(query),
        );
        response(
          results.slice(0, 8).map((prof) => ({
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
          const regex = new RegExp(
            `(${item.query.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`,
            "gi",
          );
          const highlightedTitle = item.prof.title.replace(
            regex,
            "<mark>$1</mark>",
          );
          const html = `<div class="autocomplete-suggestion"><div class="autocomplete-suggestion-content"><div class="autocomplete-suggestion-title">${highlightedTitle}</div><div class="autocomplete-suggestion-direction"><i class="fas fa-tag"></i> <span>${item.prof.direction}</span></div></div></div>`;
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
    });
  }

  applyFilters();
});
