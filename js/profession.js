document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const profId = parseInt(urlParams.get("id"));

  const errorBlock = document.getElementById("errorBlock");
  const profDataBlock = document.getElementById("profDataBlock");

  // Ищем профессию в массиве professions (из data.js)
  const prof = professions.find((p) => p.id === profId);

  if (!prof) {
    // Если id не найден, показываем ошибку
    errorBlock.classList.remove("d-none");
  } else {
    // Показываем блок с данными
    profDataBlock.classList.remove("d-none");

    // ЗАПОЛНЕНИЕ ТЕКСТОВЫХ ДАННЫХ
    document.getElementById("profTitle").textContent = prof.title;
    document.getElementById("profDirection").textContent = prof.direction;
    document.getElementById("profDemand").textContent = `Спрос: ${prof.demand}`;
    document.getElementById("profEduLevel").textContent = prof.educationLevel;
    document.getElementById("profSalary").textContent =
      `${prof.salaryMin} – ${prof.salaryMax} BYN`;
    document.getElementById("profDesc").textContent = prof.description;
    document.getElementById("profPerspectives").textContent = prof.perspectives;

    // ВСТАВЛЯЕМ КАРТИНКУ
    const profImageEl = document.getElementById("profImage");
    profImageEl.src = prof.image;
    profImageEl.alt = prof.title;

    // ЗАПОЛНЕНИЕ СПИСКОВ (Экзамены)
    const examsList = document.getElementById("profExamsList");
    examsList.innerHTML = "";
    const exams = prof.entranceExams;
    if (exams.subject1)
      examsList.innerHTML += `<li class="mb-2"><i class="fas fa-check text-cyan me-2"></i> ${exams.subject1}</li>`;
    if (exams.subject2)
      examsList.innerHTML += `<li class="mb-2"><i class="fas fa-check text-cyan me-2"></i> ${exams.subject2}</li>`;
    if (exams.subject3)
      examsList.innerHTML += `<li><i class="fas fa-check text-cyan me-2"></i> ${exams.subject3}</li>`;

    document.getElementById("profScore").textContent = exams.passingScore;

    // Хард-скиллы
    const hardSkillsList = document.getElementById("profHardSkills");
    hardSkillsList.innerHTML = prof.skills
      .map(
        (skill) =>
          `<li><i class="fas fa-cog text-muted"></i> <span>${skill}</span></li>`,
      )
      .join("");

    // Софт-скиллы
    const softSkillsList = document.getElementById("profSoftSkills");
    softSkillsList.innerHTML = prof.softSkills
      .map(
        (skill) =>
          `<li><i class="fas fa-user-check text-muted"></i> <span>${skill}</span></li>`,
      )
      .join("");

    // ВУЗы
    const uniBlock = document.getElementById("profUniversitiesBlock");
    const uniContainer = document.getElementById("profUniversities");
    if (prof.universities && prof.universities.length > 0) {
      uniContainer.innerHTML = prof.universities
        .map(
          (uni) => `
        <div class="mb-3 border-bottom custom-border pb-3 last-border-none">
          <h5 class="fw-bold text-light mb-1">${uni.name}</h5>
          <p class="text-muted-custom small mb-1"><strong>Факультет:</strong> ${uni.faculty}</p>
          <p class="text-muted-custom small mb-0"><strong>Специальность:</strong> ${uni.specialty}</p>
        </div>
      `,
        )
        .join("");
    } else {
      uniBlock.classList.add("d-none");
    }

    // Колледжи
    const colBlock = document.getElementById("profCollegesBlock");
    const colContainer = document.getElementById("profColleges");
    if (prof.colleges && prof.colleges.length > 0) {
      colContainer.innerHTML = prof.colleges
        .map(
          (col) => `
        <div class="mb-3 border-bottom custom-border pb-3 last-border-none">
          <h5 class="fw-bold text-light mb-1">${col.name}</h5>
          <p class="text-muted-custom small mb-0"><strong>Специальность:</strong> ${col.specialty}</p>
        </div>
      `,
        )
        .join("");
    } else {
      colBlock.classList.add("d-none");
    }

    // Карьерный путь
    const careerContainer = document.getElementById("profCareer");
    if (prof.careerPath && prof.careerPath.length > 0) {
      careerContainer.innerHTML = prof.careerPath
        .map(
          (step, index) => `
        <div class="text-center position-relative bg-surface p-2 z-index-2 mb-3 mb-md-0" style="min-width: 120px;">
          <div class="rounded-circle bg-dark border border-primary mx-auto mb-2 d-flex align-items-center justify-content-center text-primary-custom fw-bold" style="width: 40px; height: 40px;">
            ${index + 1}
          </div>
          <span class="d-block text-light small fw-bold">${step}</span>
        </div>
      `,
        )
        .join("");

      // Добавляем линию для мобильной версии
      const lineDiv = document.createElement("div");
      lineDiv.className =
        "position-absolute start-50 top-0 h-100 border-start custom-border d-md-none";
      lineDiv.style.zIndex = "1";
      careerContainer.appendChild(lineDiv);
    }

    document.title = `ProfBel | ${prof.title}`;
  }
});
