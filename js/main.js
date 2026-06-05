document.addEventListener("DOMContentLoaded", () => {
  // 1. ЛОГИКА СВЕТЛОЙ ТЕМЫ (БЕЗОПАСНАЯ)
  try {
    const themeToggleBtn = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("profbel_theme");

    // Функция обновления иконки
    const updateIcon = (isLight) => {
      if (!themeToggleBtn) return;
      const icon = themeToggleBtn.querySelector("i");
      if (isLight) {
        icon.className = "fas fa-moon text-primary-custom fs-5";
      } else {
        icon.className = "fas fa-sun text-warning fs-5";
      }
    };

    // Применяем сохраненную тему при загрузке
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
      updateIcon(true);
    } else {
      updateIcon(false);
    }

    // Слушатель клика
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");

        localStorage.setItem("profbel_theme", isLight ? "light" : "dark");
        updateIcon(isLight);
      });
    }
  } catch (error) {
    console.error("Ошибка в логике темы:", error);
  }

  // 2. ФОРМА ОБРАТНОЙ СВЯЗИ

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("userName");
      const emailInput = document.getElementById("userEmail");
      const messageInput = document.getElementById("userMessage");
      const formAlert = document.getElementById("formAlert");

      let isValid = true;
      const nameValue = nameInput.value.trim();
      const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-\.'`,&\(\)]+$/;

      if (nameValue === "") {
        showError(nameInput, "Пожалуйста, введите ваше имя.");
        isValid = false;
      } else if (nameValue.length < 2) {
        showError(nameInput, "Имя должно содержать минимум 2 символа.");
        isValid = false;
      } else if (!nameRegex.test(nameValue)) {
        showError(nameInput, "Имя содержит недопустимые символы.");
        isValid = false;
      } else if (/(.)\1{3,}/.test(nameValue)) {
        showError(nameInput, "Уберите повторяющиеся символы.");
        isValid = false;
      } else {
        showSuccess(nameInput);
      }

      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailValue === "") {
        showError(emailInput, "Пожалуйста, введите email адрес.");
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        showError(
          emailInput,
          "Введите корректный email (пример: name@domain.com).",
        );
        isValid = false;
      } else {
        showSuccess(emailInput);
      }

      const messageValue = messageInput.value.trim();

      if (messageValue === "") {
        showError(messageInput, "Пожалуйста, введите сообщение.");
        isValid = false;
      } else {
        showSuccess(messageInput);
      }

      if (isValid) {
        formAlert.className = "alert alert-success mt-3";
        formAlert.innerHTML = `<i class="fas fa-check-circle me-2"></i> Спасибо, ${nameValue}! Сообщение успешно отправлено.`;
        formAlert.classList.remove("d-none");

        contactForm.reset();
        [nameInput, emailInput, messageInput].forEach((el) => {
          el.classList.remove("is-valid");
        });

        setTimeout(() => formAlert.classList.add("d-none"), 5000);
      } else {
        const errors = [];
        if (nameInput.classList.contains("is-invalid"))
          errors.push(nameInput.validationMessage);
        if (emailInput.classList.contains("is-invalid"))
          errors.push(emailInput.validationMessage);
        if (messageInput.classList.contains("is-invalid"))
          errors.push(messageInput.validationMessage);

        formAlert.className = "alert alert-danger mt-3";
        formAlert.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> Пожалуйста, исправьте ошибки:<br><ul class="mb-0 mt-2">${errors.map((err) => `<li>${err}</li>`).join("")}</ul>`;
        formAlert.classList.remove("d-none");
      }
    });

    function showError(input, message) {
      input.classList.add("is-invalid");
      input.validationMessage = message;
    }

    function showSuccess(input) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }

    document.querySelectorAll(".custom-input").forEach((input) => {
      input.addEventListener("input", function () {
        this.classList.remove("is-invalid", "is-valid");
      });
    });

    addCharacterCounter("userName", 50);
    addCharacterCounter("userEmail", 100);
    addCharacterCounter("userMessage", 1000);
  }

  function addCharacterCounter(inputId, maxLength) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.setAttribute("maxlength", maxLength);

    const counter = document.createElement("small");
    counter.className = "text-muted-custom d-block mt-1 text-end";
    counter.style.fontSize = "0.75rem";
    counter.innerHTML = `<span id="${inputId}Counter">0</span>/${maxLength} символов`;
    input.parentNode.insertBefore(counter, input.nextSibling);

    const updateCounter = () => {
      const counterSpan = document.getElementById(`${inputId}Counter`);
      if (counterSpan) {
        const currentLength = input.value.length;
        counterSpan.textContent = currentLength;
        counterSpan.style.color =
          currentLength > maxLength * 0.9 ? "#ff6b6b" : "#8892b0";
      }
    };

    input.addEventListener("input", updateCounter);
    updateCounter();
  }

  // 3. СЛАЙДЕР ИСТОРИЙ УСПЕХА

  const sliderTrack = document.getElementById("sliderTrack");

  if (sliderTrack && typeof storiesData !== "undefined") {
    storiesData.forEach((story) => {
      const card = document.createElement("div");
      card.className = "story-slide";
      card.innerHTML = `
        <div class="d-flex align-items-center mb-3">
          <img src="${story.photo}" alt="${story.name}" class="story-img me-3">
          <div>
            <h5 class="mb-0 fw-bold">${story.name}</h5>
            <span class="text-primary-custom small fw-bold">${story.profession}</span>
          </div>
        </div>
        <p class="text-muted-custom story-text-preview mb-3">${story.shortText}</p>
        <a href="stories.html?id=${story.id}" class="btn btn-outline-cyan btn-sm">Подробнее</a>
      `;
      sliderTrack.appendChild(card);
    });

    const originalCards = [...sliderTrack.children];
    for (let i = 0; i < 2; i++) {
      originalCards.forEach((card) => {
        sliderTrack.appendChild(card.cloneNode(true));
      });
    }

    let currentTranslateX = 0;
    let animationId = null;
    let isPaused = false;
    let isManualMoving = false;
    const FIXED_SPEED = 0.3;

    const getOriginalWidth = () => {
      const slides = document.querySelectorAll(".story-slide");
      let totalWidth = 0;
      for (let i = 0; i < storiesData.length; i++) {
        if (slides[i]) totalWidth += slides[i].offsetWidth + 20;
      }
      return totalWidth;
    };

    function autoSlide() {
      if (!isPaused && !isManualMoving) {
        const originalWidth = getOriginalWidth();
        currentTranslateX += FIXED_SPEED;

        if (currentTranslateX >= originalWidth) {
          currentTranslateX -= originalWidth;
          sliderTrack.style.transition = "none";
        }
        sliderTrack.style.transform = `translateX(-${currentTranslateX}px)`;
      }
      animationId = requestAnimationFrame(autoSlide);
    }

    function manualMove(direction) {
      isManualMoving = true;
      const slides = document.querySelectorAll(".story-slide");
      if (slides.length === 0) return;

      const slideWidth = slides[0].offsetWidth + 20;
      const originalWidth = getOriginalWidth();
      let targetPosition =
        direction === "next"
          ? currentTranslateX + slideWidth
          : currentTranslateX - slideWidth;

      if (targetPosition >= originalWidth) targetPosition -= originalWidth;
      else if (targetPosition < 0) targetPosition += originalWidth;

      sliderTrack.style.transition = "transform 0.3s ease";
      sliderTrack.style.transform = `translateX(-${targetPosition}px)`;
      currentTranslateX = targetPosition;

      setTimeout(() => {
        sliderTrack.style.transition = "none";
        isManualMoving = false;
      }, 300);
    }

    const prevBtn = document.getElementById("sliderPrev");
    const nextBtn = document.getElementById("sliderNext");

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => manualMove("prev"));
      nextBtn.addEventListener("click", () => manualMove("next"));
    }

    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => (isPaused = true));
      sliderContainer.addEventListener("mouseleave", () => (isPaused = false));
    }

    animationId = requestAnimationFrame(autoSlide);
  }

  // 4. СТРАНИЦА ИСТОРИЙ УСПЕХА

  const storiesGridView = document.getElementById("storiesGridView");
  const fullArticleView = document.getElementById("fullArticleView");
  const backToGridBtn = document.getElementById("backToGridBtn");

  if (storiesGridView && typeof storiesData !== "undefined") {
    storiesData.forEach((story) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="feature-card p-4 rounded-4 h-100 d-flex flex-column text-start">
          <div class="d-flex align-items-center mb-3">
            <img src="${story.photo}" alt="${story.name}" class="story-img me-3">
            <h5 class="mb-0 fw-bold">${story.name}</h5>
          </div>
          <p class="text-primary-custom fw-bold mb-2">${story.profession}</p>
          <p class="text-muted-custom flex-grow-1">${story.shortText}</p>
          <button class="btn btn-accent-glow mt-3 align-self-start" onclick="openFullArticle(${story.id})">Подробнее</button>
        </div>
      `;
      storiesGridView.appendChild(col);
    });

    if (backToGridBtn) {
      backToGridBtn.addEventListener("click", () => {
        fullArticleView.classList.add("d-none");
        storiesGridView.classList.remove("d-none");
        window.history.pushState({}, document.title, window.location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const storyId = parseInt(urlParams.get("id"));
    if (storyId) {
      openFullArticle(storyId);
    }
  }

  // 5. ПРОШЛЫЕ РЕЗУЛЬТАТЫ ТЕСТА

  const pastResultsSection = document.getElementById("pastResultsSection");
  const pastResultsContainer = document.getElementById("pastResultsContainer");

  if (pastResultsSection && pastResultsContainer) {
    const savedResults =
      JSON.parse(localStorage.getItem("profbel_results")) || [];

    if (savedResults.length > 0) {
      pastResultsSection.classList.remove("d-none");

      savedResults.forEach((result, index) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mt-4";

        const profList = result.professions
          .map(
            (p) =>
              `<li class="mb-2"><i class="fas fa-check text-primary-custom me-2 small"></i>${p}</li>`,
          )
          .join("");

        const attemptNum = savedResults.length - index;

        col.innerHTML = `
          <div class="custom-card card p-4 h-100 border border-secondary shadow-sm position-relative mt-2">
            <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-cyan text-dark shadow">
              Попытка ${attemptNum}
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2 mb-3 border-bottom custom-border pb-2">
              <span class="text-main fw-bold">Топ-3:</span>
              <span class="text-muted-custom small"><i class="far fa-calendar-alt me-1"></i> ${result.date}</span>
            </div>
            <ul class="list-unstyled text-muted-custom mb-0">${profList}</ul>
          </div>
        `;
        pastResultsContainer.appendChild(col);
      });
    }
  }
});

window.openFullArticle = function (id) {
  const story = storiesData.find((s) => s.id === id);
  if (story) {
    document.getElementById("articlePagePhoto").src = story.photo;
    document.getElementById("articlePageName").textContent = story.name;
    document.getElementById("articlePageProfession").textContent =
      story.profession;
    document.getElementById("articlePageContent").innerHTML = story.fullText;

    document.getElementById("storiesGridView").classList.add("d-none");
    document.getElementById("fullArticleView").classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
//
// 6. ПЕРЕКЛЮЧЕНИЕ ФОРМ В МОДАЛКЕ АВТОРИЗАЦИИ
//
document.addEventListener("DOMContentLoaded", () => {
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const authModalTitle = document.getElementById("authModalTitle");

  if (showRegisterBtn && showLoginBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.replace("d-block", "d-none");
      registerForm.classList.replace("d-none", "d-block");
      authModalTitle.textContent = "Регистрация";
    });

    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.classList.replace("d-block", "d-none");
      loginForm.classList.replace("d-none", "d-block");
      authModalTitle.textContent = "Вход в личный кабинет";
    });
  }
});
