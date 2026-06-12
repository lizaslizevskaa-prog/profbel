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
    console.error(error);
  }

  // 2. ФОРМА ОБРАТНОЙ СВЯЗИ (Контакты)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nameInput = document.getElementById("userName");
      const emailInput = document.getElementById("userEmail");
      const messageInput = document.getElementById("userMessage");
      const formAlert = document.getElementById("formAlert");

      let isValid = true;
      if (nameInput.value.trim().length < 2) {
        nameInput.classList.add("is-invalid");
        isValid = false;
      } else {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
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
        formAlert.innerHTML = `<i class="fas fa-check-circle me-2"></i> Сообщение успешно отправлено.`;
        formAlert.classList.remove("d-none");
        contactForm.reset();
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
    for (let i = 0; i < 2; i++)
      originalCards.forEach((card) =>
        sliderTrack.appendChild(card.cloneNode(true)),
      );

    let currentTranslateX = 0;
    let isPaused = false;
    let isManualMoving = false;

    function autoSlide() {
      if (!isPaused && !isManualMoving) {
        currentTranslateX += 0.3;
        const slides = document.querySelectorAll(".story-slide");
        let totalW = 0;
        for (let i = 0; i < storiesData.length; i++)
          if (slides[i]) totalW += slides[i].offsetWidth + 20;

        if (currentTranslateX >= totalW) {
          currentTranslateX -= totalW;
          sliderTrack.style.transition = "none";
        }
        sliderTrack.style.transform = `translateX(-${currentTranslateX}px)`;
      }
      requestAnimationFrame(autoSlide);
    }
    requestAnimationFrame(autoSlide);
  }

  // 4. СТРАНИЦА ИСТОРИЙ УСПЕХА (ГРИД)
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const storyId = parseInt(urlParams.get("id"));
    if (storyId) openFullArticle(storyId);
  }

  // 5. ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ НА ГЛАВНОЙ (ДЛЯ ГОСТЯ И ЮЗЕРА)
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
                  <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-cyan text-dark shadow">Попытка ${attemptNum}</div>
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
  // ГЕНЕРАТОР КРАСИВЫХ УВЕДОМЛЕНИЙ (ВМЕСТО ALERT)
  // ==========================================
  function showNotification(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "position-fixed top-0 end-0 p-3";
      container.style.zIndex = "10000";
      document.body.appendChild(container);
    }

    const bgClass = type === "success" ? "bg-success" : "bg-danger";
    const iconClass =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white ${bgClass} border-0 mb-2 show`;
    toast.style.transition = "opacity 0.3s ease";
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-bold fs-6">
          <i class="fas ${iconClass} me-2"></i> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 6. МОДАЛКА АВТОРИЗАЦИИ: ПЕРЕКЛЮЧЕНИЕ И ОТПРАВКА
  // ==========================================
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");
  const showForgotBtn = document.getElementById("showForgotBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotForm = document.getElementById("forgotForm");
  const verifyForm = document.getElementById("verifyForm");
  const authModalTitle = document.getElementById("authModalTitle");

  let currentRegEmail = "";

  const swap = (hides, show, title) => {
    hides.forEach((f) => f && f.classList.replace("d-block", "d-none"));
    if (show) show.classList.replace("d-none", "d-block");
    authModalTitle.textContent = title;
  };

  if (showRegisterBtn && showLoginBtn && showForgotBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap([loginForm, forgotForm, verifyForm], registerForm, "Регистрация");
    });
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap(
        [registerForm, forgotForm, verifyForm],
        loginForm,
        "Вход в личный кабинет",
      );
    });
    showForgotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      swap(
        [loginForm, registerForm, verifyForm],
        forgotForm,
        "Восстановление пароля",
      );
    });
    if (backToLoginBtn)
      backToLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        swap(
          [forgotForm, registerForm, verifyForm],
          loginForm,
          "Вход в личный кабинет",
        );
      });
  }

  // РЕГИСТРАЦИЯ -> Вызов кода
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("regName")
        ? document.getElementById("regName").value
        : registerForm.querySelectorAll("input")[0].value;
      const email = document.getElementById("regEmail")
        ? document.getElementById("regEmail").value
        : registerForm.querySelectorAll("input")[1].value;
      const age = document.getElementById("regAge")
        ? document.getElementById("regAge").value
        : 18;
      const gender = document.getElementById("regGender")
        ? document.getElementById("regGender").value
        : "Не указан";
      const education = document.getElementById("regEdu")
        ? document.getElementById("regEdu").value
        : "Школа";

      // ПРОВЕРКА ПАРОЛЯ ПРЯМО В ФОРМЕ
      const passwordInput = document.getElementById("regPassword");
      const password = passwordInput.value;
      const passwordRegex =
        /^(?=.*[A-Za-zА-Яа-я])(?=.*\d)[A-Za-zА-Яа-я\d]{6,}$/;

      if (!passwordRegex.test(password)) {
        passwordInput.classList.add("is-invalid");
        showNotification(
          "Пароль должен быть от 6 символов и содержать минимум 1 букву и 1 цифру",
          "error",
        );
        return; // Останавливаем отправку
      } else {
        passwordInput.classList.remove("is-invalid");
      }

      // Если всё ок - отправляем
      try {
        // Меняем текст кнопки на "Загрузка..."
        const btn = registerForm.querySelector('button[type="submit"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        btn.disabled = true;

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

        btn.innerHTML = oldText;
        btn.disabled = false;

        if (response.ok) {
          currentRegEmail = email;
          showNotification(data.message, "success");
          swap([registerForm], verifyForm, "Подтверждение Email");
        } else {
          showNotification(data.message, "error");
        }
      } catch (err) {
        showNotification("Ошибка соединения с сервером", "error");
      }
    });

    // Сброс красной рамки при вводе пароля
    document
      .getElementById("regPassword")
      ?.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
  }

  // ВВОД КОДА
  if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("verifyCode").value;
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentRegEmail, code }),
        });
        const data = await response.json();

        if (response.ok) {
          showNotification(
            "Почта успешно подтверждена! Теперь войдите с вашим паролем.",
            "success",
          );
          verifyForm.reset();
          swap([verifyForm], loginForm, "Вход в личный кабинет");
        } else {
          showNotification(data.message, "error");
        }
      } catch (err) {
        showNotification("Ошибка соединения с сервером", "error");
      }
    });
  }

  // ВХОД В АККАУНТ
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
          showNotification("Успешный вход!", "success");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showNotification(data.message, "error");
        }
      } catch (err) {
        showNotification("Ошибка соединения с сервером", "error");
      }
    });
  }

  // ЗАБЫЛИ ПАРОЛЬ
  if (forgotForm) {
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value;
      try {
        const btn = forgotForm.querySelector('button[type="submit"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        btn.disabled = true;

        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        btn.innerHTML = oldText;
        btn.disabled = false;

        if (res.ok) {
          showNotification(data.message, "success");
          forgotForm.reset();
          setTimeout(
            () => swap([forgotForm], loginForm, "Вход в личный кабинет"),
            2000,
          );
        } else {
          showNotification(data.message, "error");
        }
      } catch {
        showNotification("Ошибка соединения с сервером", "error");
      }
    });
  }
  // 7. ГЛОБАЛЬНАЯ ПРОВЕРКА АВТОРИЗАЦИИ (ШАПКА САЙТА)
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

// ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ИСТОРИЙ
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

async function loadComments(storyId) {
  const commentsList = document.getElementById("commentsList");
  const formContainer = document.getElementById("commentFormContainer");
  if (!commentsList || !formContainer) return;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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
        <button type="submit" class="btn btn-accent-glow py-2 px-4">Спросить</button>
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
            loadComments(storyId);
          }
        } catch (err) {
          console.error(err);
        }
      });
  }

  try {
    const res = await fetch(`/api/comments/${storyId}`);
    const comments = await res.json();

    if (comments.length === 0) {
      commentsList.innerHTML = `<div class="text-center text-muted-custom py-3">Вопросов пока нет. Спросите что-нибудь первыми!</div>`;
      return;
    }

    const currentUserId = user ? user.id : null;
    const isAdmin = user ? user.role === "admin" : false;

    commentsList.innerHTML = comments
      .map((c) => {
        const isOwner = currentUserId === c.userId || isAdmin;
        const deleteBtn = isOwner
          ? `
        <button class="btn btn-link text-danger p-0 ms-auto delete-comment-btn" data-id="${c._id}" title="Удалить вопрос"><i class="fas fa-trash-alt"></i></button>
      `
          : "";

        return `
        <div class="p-3 rounded-4 border custom-border text-start d-flex flex-column" style="background-color: var(--bg-dark);">
          <div class="d-flex align-items-center mb-2">
            <i class="fas fa-user-circle fs-4 text-cyan me-2"></i>
            <span class="fw-bold text-light small">${c.userName}</span>
            <span class="text-muted-custom small ms-2">${new Date(c.date).toLocaleDateString("ru-RU")}</span>
            ${deleteBtn}
          </div>
          <p class="mb-0 text-muted-custom small ms-1" style="line-height: 1.5; color: var(--text-main) !important;">${c.text}</p>
        </div>
      `;
      })
      .join("");

    document.querySelectorAll(".delete-comment-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const commentId = e.currentTarget.getAttribute("data-id");
        if (confirm("Удалить этот комментарий?")) {
          try {
            const res = await fetch(`/api/comments/${commentId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) loadComments(storyId);
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

    // Грузим комменты ПОД статьей
    loadComments(id);
  }
};
