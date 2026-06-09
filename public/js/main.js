document.addEventListener("DOMContentLoaded", () => {
  // 1. ЛОГИКА ТЕМЫ
  try {
    const themeToggleBtn = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("profbel_theme");

    const updateIcon = (isLight) => {
      if (!themeToggleBtn) return;
      const icon = themeToggleBtn.querySelector("i");
      icon.className = isLight
        ? "fas fa-moon text-primary-custom fs-5"
        : "fas fa-sun text-warning fs-5";
    };

    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
      updateIcon(true);
    } else {
      updateIcon(false);
    }

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

      if (
        nameValue === "" ||
        nameValue.length < 2 ||
        !nameRegex.test(nameValue)
      ) {
        nameInput.classList.add("is-invalid");
        isValid = false;
      } else {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
      }

      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailValue === "" || !emailRegex.test(emailValue)) {
        emailInput.classList.add("is-invalid");
        isValid = false;
      } else {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
      }

      if (messageInput.value.trim() === "") {
        messageInput.classList.add("is-invalid");
        isValid = false;
      } else {
        messageInput.classList.remove("is-invalid");
        messageInput.classList.add("is-valid");
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
      }
    });

    document.querySelectorAll(".custom-input").forEach((input) => {
      input.addEventListener("input", function () {
        this.classList.remove("is-invalid", "is-valid");
      });
    });
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
        <button class="btn btn-outline-cyan btn-sm" onclick="openStoryModal(${story.id})">Подробнее</button>
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
    requestAnimationFrame(autoSlide);
  }

  // ==========================================
  // 4. СТРАНИЦА ИСТОРИЙ УСПЕХА (ГРИД И КОММЕНТАРИИ)
  // ==========================================
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
    if (storyId) openFullArticle(storyId);
  }

  // ==========================================
  // 5. ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ НА ГЛАВНОЙ (ДЛЯ ГОСТЯ И ЮЗЕРА)
  // ==========================================
  const pastResultsSection = document.getElementById("pastResultsSection");
  const pastResultsContainer = document.getElementById("pastResultsContainer");

  if (pastResultsSection && pastResultsContainer) {
    const token = localStorage.getItem("token");

    if (!token) {
      pastResultsSection.classList.remove("d-none");
      pastResultsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="p-5 rounded-4 border custom-border bg-surface shadow-lg">
            <i class="fas fa-lock fa-3x text-muted-custom mb-3"></i>
            <h3 class="h4 text-light fw-bold mb-3">Войдите в личный кабинет</h3>
            <p class="text-muted-custom mb-4 max-w-700 mx-auto">Только авторизованные пользователи могут сохранять свои результаты и возвращаться к ним в любое время.</p>
            <button class="btn btn-outline-cyan px-4 py-2" data-bs-toggle="modal" data-bs-target="#authModal">
              Войти или Зарегистрироваться
            </button>
          </div>
        </div>
      `;
    } else {
      fetch("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          if (user.testResults && user.testResults.length > 0) {
            pastResultsSection.classList.remove("d-none");
            pastResultsContainer.innerHTML = "";

            user.testResults.forEach((result, index) => {
              const col = document.createElement("div");
              col.className = "col-md-4 mt-4";

              const formattedDate = new Date(result.date).toLocaleDateString(
                "ru-RU",
              );
              const profList = result.topProfessions
                .map(
                  (p) =>
                    `<li class="mb-2"><i class="fas fa-check text-primary-custom me-2 small"></i>${p}</li>`,
                )
                .join("");
              const attemptNum = user.testResults.length - index;

              col.innerHTML = `
                <div class="custom-card card p-4 h-100 border border-secondary shadow-sm position-relative mt-2" style="background-color: var(--bg-dark);">
                  <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-cyan text-dark shadow">
                    Попытка ${attemptNum}
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-2 mb-3 border-bottom custom-border pb-2">
                    <span class="text-main fw-bold">Топ-3:</span>
                    <span class="text-muted-custom small"><i class="far fa-calendar-alt me-1"></i> ${formattedDate}</span>
                  </div>
                  <ul class="list-unstyled text-muted-custom mb-0">${profList}</ul>
                </div>
              `;
              pastResultsContainer.appendChild(col);
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }

  // ==========================================
  // 6. МОДАЛКА АВТОРИЗАЦИИ: ПЕРЕКЛЮЧЕНИЕ ФОРМ
  // ==========================================
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");
  const showForgotBtn = document.getElementById("showForgotBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotForm = document.getElementById("forgotForm");
  const authModalTitle = document.getElementById("authModalTitle");

  const swap = (hides, show, title) => {
    hides.forEach((f) => f && f.classList.replace("d-block", "d-none"));
    show.classList.replace("d-none", "d-block");
    authModalTitle.textContent = title;
  };

  if (showRegisterBtn && showLoginBtn && showForgotBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap([loginForm, forgotForm], registerForm, "Регистрация");
    });
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap([registerForm, forgotForm], loginForm, "Вход в личный кабинет");
    });
    showForgotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap([loginForm, registerForm], forgotForm, "Восстановление пароля");
    });
    backToLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap([forgotForm, registerForm], loginForm, "Вход в личный кабинет");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const age = document.getElementById("regAge").value;
      const gender = document.getElementById("regGender").value;
      const education = document.getElementById("regEdu").value;
      const password = document.getElementById("regPassword").value;

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            age,
            gender,
            education,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          alert("Регистрация успешна! Теперь вы можете войти.");
          showLoginBtn.click();
          registerForm.reset();
        } else {
          alert(`Ошибка: ${data.message}`);
        }
      } catch (err) {
        console.error(err);
        alert("Ошибка соединения с сервером");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.reload();
        } else {
          alert(`Ошибка: ${data.message}`);
        }
      } catch (err) {
        console.error(err);
        alert("Ошибка соединения с сервером");
      }
    });
  }

  // ОТПРАВКА ВОССТАНОВЛЕНИЯ ПАРОЛЯ
  if (forgotForm) {
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value;
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        alert(data.message);
        if (res.ok) backToLoginBtn.click();
      } catch {
        alert("Ошибка соединения с сервером");
      }
    });
  }

  // ==========================================
  // 7. ГЛОБАЛЬНАЯ ПРОВЕРКА АВТОРИЗАЦИИ (ШАПКА САЙТА)
  // ==========================================
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const authBtns = document.querySelectorAll(
    'button[data-bs-target="#authModal"]',
  );

  if (token && user && authBtns.length > 0) {
    authBtns.forEach((btn) => {
      const authNavLi = btn.parentElement;
      authNavLi.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-cyan dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-user-circle me-2 fs-5"></i> ${user.name.split(" ")[0]}
          </button>
          <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end mt-2 custom-border bg-surface" style="box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <li><a class="dropdown-item text-light hover-primary" href="profile.html"><i class="fas fa-id-card me-2"></i> Мой профиль</a></li>
            ${user.role === "admin" ? `<li><a class="dropdown-item text-warning" href="admin.html"><i class="fas fa-crown me-2"></i> Панель админа</a></li>` : ""}
            <li><hr class="dropdown-divider border-secondary"></li>
            <li><button class="dropdown-item text-danger globalLogoutBtn"><i class="fas fa-sign-out-alt me-2"></i> Выйти</button></li>
          </ul>
        </div>
      `;
    });

    document.querySelectorAll(".globalLogoutBtn").forEach((logoutBtn) => {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
      });
    });
  }
});

// ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML
window.openStoryModal = function (id) {
  const story = storiesData.find((s) => s.id === id);
  if (story) {
    document.getElementById("modalStoryPhoto").src = story.photo;
    document.getElementById("modalStoryName").textContent = story.name;
    document.getElementById("modalStoryProfession").textContent =
      story.profession;
    document.getElementById("modalStoryContent").innerHTML = story.fullText;
    const modalElement = document.getElementById("storyModal");
    if (typeof bootstrap !== "undefined") {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
};

// Функция загрузки и отправки вопросов героям
async function loadComments(storyId) {
  const commentsList = document.getElementById("commentsList");
  const formContainer = document.getElementById("commentFormContainer");
  if (!commentsList || !formContainer) return;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Форма ввода (если авторизован) или призыв войти (если гость)
  if (!token || !user) {
    formContainer.innerHTML = `
      <div class="p-3 rounded-3 border custom-border text-center" style="background-color: var(--bg-dark);">
        <p class="text-muted-custom small mb-0">Войдите в личный кабинет, чтобы задать вопрос герою истории.</p>
      </div>
    `;
  } else {
    formContainer.innerHTML = `
      <form id="addCommentForm" class="d-flex gap-2">
        <input type="text" id="commentText" class="form-control custom-input text-light" placeholder="Задайте ваш вопрос..." style="background-color: var(--bg-dark) !important; border-radius: 12px; height: 50px;" required>
        <button type="submit" class="btn btn-accent-glow py-2">Спросить</button>
      </form>
    `;

    document
      .getElementById("addCommentForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = document.getElementById("commentText").value;
        try {
          const res = await fetch("/api/comments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ storyId, text, userName: user.name }),
          });
          if (res.ok) {
            document.getElementById("commentText").value = "";
            loadComments(storyId); // Обновляем комментарии
          }
        } catch (err) {
          console.error(err);
        }
      });
  }

  // 2. Загружаем вопросы с сервера
  try {
    const res = await fetch(`/api/comments/${storyId}`);
    const comments = await res.json();

    if (comments.length === 0) {
      commentsList.innerHTML = `<div class="text-center text-muted-custom py-3">Вопросов пока нет. Спросите что-нибудь первыми!</div>`;
      return;
    }

    const currentUserId = user ? user.id : null;

    commentsList.innerHTML = comments
      .map((c) => {
        // Кнопка удаления показывается ТОЛЬКО создателю комментария
        const isOwner = currentUserId === c.userId;
        const deleteBtn = isOwner
          ? `
        <button class="btn btn-link text-danger p-0 ms-auto delete-comment-btn" data-id="${c._id}" title="Удалить вопрос">
          <i class="fas fa-trash-alt"></i>
        </button>
      `
          : "";

        return `
        <div class="p-3 rounded-4 border custom-border text-start d-flex flex-column" style="background-color: var(--bg-dark);">
          <div class="d-flex align-items-center mb-2">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.userName)}&background=64ffda&color=0a192f&size=32" class="rounded-circle me-2" style="width: 32px; height: 32px;">
            <span class="fw-bold text-light small">${c.userName}</span>
            <span class="text-muted-custom small ms-2">${new Date(c.date).toLocaleDateString("ru-RU")}</span>
            ${deleteBtn}
          </div>
          <p class="mb-0 text-muted-custom small ms-1" style="line-height: 1.5; color: var(--text-main) !important;">${c.text}</p>
        </div>
      `;
      })
      .join("");

    // Вешаем слушатели клика на все кнопки удаления
    document.querySelectorAll(".delete-comment-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const commentId = e.currentTarget.getAttribute("data-id");
        if (confirm("Вы действительно хотите удалить свой вопрос?")) {
          try {
            const res = await fetch(`/api/comments/${commentId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              loadComments(storyId); // Обновляем список вопросов
            } else {
              alert("Не удалось удалить комментарий.");
            }
          } catch (err) {
            console.error(err);
          }
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
}

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

    // Загружаем комментарии строго ПОД статьей
    loadComments(id);
  }
};
