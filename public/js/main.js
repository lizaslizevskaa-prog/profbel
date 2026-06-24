let globalStories = [];

// ГЕНЕРАТОР УВЕДОМЛЕНИЙ
window.showNotification = function (message, type = "success") {
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
  toast.className = `toast align-items-center text-white ${bgClass} border-0 mb-2 show shadow-lg`;
  toast.style.transition = "opacity 0.3s ease";
  toast.innerHTML = `<div class="d-flex"><div class="toast-body fw-bold fs-6"><i class="fas ${iconClass} me-2"></i> ${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. ТЕМА
  const themeBtn = document.getElementById("themeToggle");
  if (localStorage.getItem("profbel_theme") === "light")
    document.body.classList.add("light-theme");
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem(
      "profbel_theme",
      document.body.classList.contains("light-theme") ? "light" : "dark",
    );
  });

  // 2. ГЛАЗИКИ ДЛЯ ПАРОЛЕЙ
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  // 3. ФОРМА КОНТАКТОВ
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const body = {
        userName: document.getElementById("userName").value.trim(),
        userEmail: document.getElementById("userEmail").value.trim(),
        message: document.getElementById("userMessage").value.trim(),
      };
      if (
        body.userName.length < 2 ||
        body.userEmail === "" ||
        body.message === ""
      ) {
        showNotification("Заполните все поля корректно!", "error");
        return;
      }
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) {
          showNotification(data.message, "success");
          contactForm.reset();
        }
      } catch (err) {
        showNotification("Ошибка сервера!", "error");
      }
    });
  }

  // 4. СЛАЙДЕР ИСТОРИЙ УСПЕХА
  const sliderTrack = document.getElementById("sliderTrack");
  if (sliderTrack) {
    let currentX = 0;
    let isPaused = false;
    const loadSlider = async () => {
      const res = await fetch("/api/stories/approved");
      const stories = await res.json();
      if (stories.length === 0) return;
      sliderTrack.innerHTML = stories
        .map(
          (s) =>
            `<div class="story-slide"><div class="d-flex align-items-center mb-3"><img src="${s.photo}" class="story-img me-3"><div><h5 class="mb-0 fw-bold text-light">${s.name}</h5><span class="text-primary-custom small fw-bold">${s.profession}</span></div></div><p class="text-muted-custom story-text-preview mb-3">${s.shortText}</p><a href="stories.html?id=${s._id}" class="btn btn-outline-cyan btn-sm">Подробнее</a></div>`,
        )
        .join("");
      sliderTrack.innerHTML += sliderTrack.innerHTML;
      const animate = () => {
        if (!isPaused) {
          currentX += 0.5;
          if (currentX >= sliderTrack.scrollWidth / 2) currentX = 0;
          sliderTrack.style.transform = `translateX(-${currentX}px)`;
        }
        requestAnimationFrame(animate);
      };
      animate();
    };
    sliderTrack.parentElement.addEventListener(
      "mouseenter",
      () => (isPaused = true),
    );
    sliderTrack.parentElement.addEventListener(
      "mouseleave",
      () => (isPaused = false),
    );
    document
      .getElementById("sliderNext")
      ?.addEventListener("click", () => (currentX += 300));
    document
      .getElementById("sliderPrev")
      ?.addEventListener("click", () => (currentX -= 300));
    loadSlider();
  }

  // 5. ИСТОРИИ (ГРИД)
  const storiesGridView = document.getElementById("storiesGridView");
  if (storiesGridView) {
    const loadGrid = async () => {
      const res = await fetch("/api/stories/approved");
      globalStories = await res.json();
      storiesGridView.innerHTML = globalStories
        .map(
          (s) =>
            `<div class="col-md-6 col-lg-4"><div class="feature-card p-4 rounded-4 h-100 d-flex flex-column text-start"><div class="d-flex align-items-center mb-3"><img src="${s.photo}" class="story-img me-3"><h5 class="mb-0 fw-bold">${s.name}</h5></div><p class="text-primary-custom fw-bold mb-2">${s.profession}</p><p class="text-muted-custom flex-grow-1">${s.shortText}</p><button class="btn btn-accent-glow mt-3 align-self-start" onclick="openFullArticle('${s._id}')">Подробнее</button></div></div>`,
        )
        .join("");
      const storyId = new URLSearchParams(window.location.search).get("id");
      if (storyId) openFullArticle(storyId);
    };
    loadGrid();
    document.getElementById("backToGridBtn")?.addEventListener("click", () => {
      document.getElementById("fullArticleView").classList.add("d-none");
      storiesGridView.classList.remove("d-none");
      document.getElementById("suggestStoryBlock")?.classList.remove("d-none");
      window.scrollTo(0, 0);
    });
  }

  // 6. РЕЗУЛЬТАТЫ НА ГЛАВНОЙ
  const pastResultsSection = document.getElementById("pastResultsSection");
  const pastResultsContainer = document.getElementById("pastResultsContainer");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (pastResultsSection && pastResultsContainer) {
    if (!token) {
      pastResultsSection.classList.remove("d-none");
      pastResultsContainer.innerHTML = `<div class="col-12 text-center py-5"><div class="p-5 rounded-4 border custom-border bg-surface shadow-lg"><i class="fas fa-lock fa-3x text-muted-custom mb-3"></i><h3 class="h4 text-light fw-bold mb-3">Войдите, чтобы увидеть результаты</h3><button class="btn btn-outline-cyan px-4 py-2" data-bs-toggle="modal" data-bs-target="#authModal">Войти</button></div></div>`;
    } else {
      fetch("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((u) => {
          if (u.testResults?.length > 0) {
            pastResultsSection.classList.remove("d-none");
            pastResultsContainer.innerHTML = u.testResults
              .map((result, index) => {
                const attemptNum = u.testResults.length - index;
                const profList = result.topProfessions
                  .map(
                    (p) =>
                      `<li class="mb-1"><i class="fas fa-check text-primary-custom me-2 small"></i>${p}</li>`,
                  )
                  .join("");
                return `<div class="col-md-4 mt-4"><div class="custom-card card p-4 border border-secondary shadow-sm" style="background-color: var(--bg-dark);"><div class="badge rounded-pill bg-cyan text-dark mb-2">Попытка ${attemptNum}</div><ul class="list-unstyled text-muted-custom small">${profList}</ul></div></div>`;
              })
              .join("");
          }
        });
    }
  }

  // 7. ШАПКА АВТОРИЗАЦИИ
  const authBtns = document.querySelectorAll(
    'button[data-bs-target="#authModal"]',
  );
  if (token && user && authBtns.length > 0) {
    authBtns.forEach((btn) => {
      btn.parentElement.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-cyan dropdown-toggle" data-bs-toggle="dropdown"><i class="fas fa-user-circle"></i> ${user.name.split(" ")[0]}</button>
          <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end bg-surface border border-secondary shadow-lg">
            <li><a class="dropdown-item" href="profile.html">Профиль</a></li>
            ${user.role === "admin" ? '<li><a class="dropdown-item text-warning" href="admin.html">Админка</a></li>' : ""}
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger" onclick="localStorage.clear();location.reload()">Выйти</button></li>
          </ul>
        </div>`;
    });
  }

  // 8. ЛОГИКА ФОРМ АВТОРИЗАЦИИ
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registerForm");
  const verifyForm = document.getElementById("verifyForm");
  const forgotForm = document.getElementById("forgotForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  let currentRegEmail = "";

  const showF = (f, t) => {
    [loginForm, regForm, verifyForm, forgotForm, resetPasswordForm].forEach(
      (el) => {
        if (el) el.classList.replace("d-block", "d-none");
      },
    );
    if (f) f.classList.replace("d-none", "d-block");
    const title = document.getElementById("authModalTitle");
    if (title) title.textContent = t;
  };

  document
    .getElementById("showRegisterBtn")
    ?.addEventListener("click", () => showF(regForm, "Регистрация"));
  document
    .getElementById("showLoginBtn")
    ?.addEventListener("click", () => showF(loginForm, "Вход"));
  document
    .getElementById("showForgotBtn")
    ?.addEventListener("click", () => showF(forgotForm, "Сброс пароля"));
  document
    .querySelectorAll(".backToLoginBtn")
    .forEach((btn) =>
      btn.addEventListener("click", () => showF(loginForm, "Вход")),
    );

  if (regForm)
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // ПРОВЕРКА ВОЗРАСТА
      const ageInput = document.getElementById("regAge");
      const age = parseInt(ageInput.value);
      if (isNaN(age) || age < 14 || age > 100) {
        showNotification("Возраст должен быть от 14 до 100 лет", "error");
        ageInput.classList.add("is-invalid");
        return;
      }
      ageInput.classList.remove("is-invalid");

      // ПРОВЕРКА ПАРОЛЯ
      const passInput = document.getElementById("regPassword");
      const password = passInput.value;
      const passwordRegex = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        showNotification(
          "Пароль: мин. 6 символов, 1 ЗАГЛАВНАЯ буква и 1 цифра!",
          "error",
        );
        passInput.classList.add("is-invalid");
        return;
      }
      passInput.classList.remove("is-invalid");

      currentRegEmail = document.getElementById("regEmail").value;
      const body = {
        name: document.getElementById("regName").value,
        email: currentRegEmail,
        password: password,
        age: age,
        gender: document.getElementById("regGender").value,
        education: document.getElementById("regEdu").value,
      };

      const btn = regForm.querySelector('button[type="submit"]');
      btn.innerHTML = "Загрузка...";
      btn.disabled = true;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      btn.innerHTML = "Зарегистрироваться";
      btn.disabled = false;

      if (res.ok) {
        showF(verifyForm, "Подтверждение почты");
        showNotification(data.message);
      } else showNotification(data.message, "error");
    });

  if (verifyForm)
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentRegEmail,
          code: document.getElementById("verifyCode").value,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Успех! Войдите.");
        showF(loginForm, "Вход");
      } else showNotification(data.message, "error");
    });

  if (loginForm)
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputs = loginForm.querySelectorAll(".custom-input");
      const email = inputs[0].value;
      const password = inputs[1].value;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.reload();
      } else showNotification(data.message, "error");
    });

  if (forgotForm)
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      tempEmail = document.getElementById("forgotEmail").value;
      const btn = forgotForm.querySelector('button[type="submit"]');
      btn.innerHTML = "Загрузка...";
      btn.disabled = true;
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail }),
      });
      const data = await res.json();
      btn.innerHTML = "Получить код";
      btn.disabled = false;
      if (res.ok) {
        showNotification(data.message);
        showF(resetPasswordForm, "Новый пароль");
      } else showNotification(data.message, "error");
    });

  if (resetPasswordForm)
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("resetCode").value;
      const newPassword = document.getElementById("resetNewPassword").value;
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message);
        showF(loginForm, "Вход");
      } else showNotification(data.message, "error");
    });
});

// ==========================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ (ИСТОРИИ И КОММЕНТАРИИ)
// ==========================================
window.openFullArticle = function (id) {
  const story = globalStories.find((s) => s._id === id);
  if (story) {
    document.getElementById("articlePagePhoto").src = story.photo;
    document.getElementById("articlePageName").textContent = story.name;
    document.getElementById("articlePageProfession").textContent =
      story.profession;
    document.getElementById("articlePageContent").innerHTML = story.fullText;
    document.getElementById("storiesGridView").classList.add("d-none");
    document.getElementById("suggestStoryBlock")?.classList.add("d-none");
    document.getElementById("fullArticleView").classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadComments(id);
  }
};

window.loadComments = async function (storyId) {
  const commentsList = document.getElementById("commentsList");
  const formContainer = document.getElementById("commentFormContainer");
  if (!commentsList || !formContainer) return;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Форма ввода (Главный вопрос)
  if (!token || !user) {
    formContainer.innerHTML = `<div class="p-3 rounded-3 border custom-border text-center" style="background-color: var(--bg-dark);"><p class="text-muted-custom small mb-0">Войдите в личный кабинет, чтобы задать вопрос.</p></div>`;
  } else {
    formContainer.innerHTML = `
      <form id="addCommentForm" class="d-flex gap-2">
        <input type="text" id="commentText" class="form-control custom-input text-light" placeholder="Задайте ваш вопрос..." style="background-color: var(--bg-dark) !important; border-radius: 12px; height: 50px;" required>
        <button type="submit" class="btn btn-accent-glow py-2 px-4">Спросить</button>
      </form>`;

    document
      .getElementById("addCommentForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const res = await fetch("/api/comments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              storyId,
              text: document.getElementById("commentText").value,
              userName: user.name,
            }),
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

  // 2. Загрузка вопросов и ответов
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
          ? `<button class="btn btn-link text-danger p-0 ms-auto delete-comment-btn" data-id="${c._id}" title="Удалить"><i class="fas fa-trash-alt"></i></button>`
          : "";

        // Вложенные ответы
        const repliesHtml =
          c.replies && c.replies.length > 0
            ? c.replies
                .map((r) => {
                  const isReplyOwner = currentUserId === r.userId || isAdmin;
                  const deleteReplyBtn = isReplyOwner
                    ? `<button class="btn btn-link text-danger p-0 ms-auto delete-reply-btn" data-comment-id="${c._id}" data-reply-id="${r._id}" title="Удалить ответ"><i class="fas fa-trash-alt"></i></button>`
                    : "";
                  return `
          <div class="p-3 mt-2 rounded-4 border custom-border text-start d-flex flex-column" style="background-color: var(--bg-surface); margin-left: 30px;">
              <div class="d-flex align-items-center mb-2">
                <i class="fas fa-reply text-purple me-2"></i>
                <span class="fw-bold text-light small">${r.userName} ${r.userId === c.userId ? '<span class="badge bg-purple-soft text-purple ms-1 px-2">Автор</span>' : ""}</span>
                <span class="text-muted-custom small ms-2">${new Date(r.date).toLocaleDateString("ru-RU")}</span>
                ${deleteReplyBtn}
              </div>
              <p class="mb-0 text-muted-custom small ms-4" style="color: var(--text-main) !important;">${r.text}</p>
          </div>`;
                })
                .join("")
            : "";

        // Форма для ответа на комментарий (скрыта)
        const replyFormHtml = token
          ? `
        <div class="mt-3 d-none reply-form-container" id="reply-form-${c._id}">
            <form class="d-flex gap-2 reply-form" data-comment-id="${c._id}" data-story-id="${storyId}">
                <input type="text" class="form-control custom-input text-light reply-input" placeholder="Написать ответ..." style="background-color: var(--bg-surface) !important; border-radius: 12px; height: 40px;" required>
                <button type="submit" class="btn btn-accent-glow py-1 px-3 btn-sm">Ответить</button>
            </form>
        </div>
        <button class="btn btn-link text-cyan p-0 mt-2 small text-decoration-none toggle-reply-btn" data-target="reply-form-${c._id}">
            <i class="fas fa-reply me-1"></i>Ответить
        </button>
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
          <p class="mb-0 text-muted-custom small ms-1" style="color: var(--text-main) !important;">${c.text}</p>
          ${repliesHtml}
          ${replyFormHtml}
        </div>
      `;
      })
      .join("");

    // Слушатели: Удаление комментария
    document.querySelectorAll(".delete-comment-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const commentId = e.currentTarget.getAttribute("data-id");
        if (confirm("Удалить этот комментарий?")) {
          try {
            await fetch(`/api/comments/${commentId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            showNotification("Комментарий удален");
            loadComments(storyId);
          } catch (err) {
            console.error(err);
          }
        }
      });
    });

    // Слушатели: Удаление ответа
    document.querySelectorAll(".delete-reply-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const commentId = e.currentTarget.getAttribute("data-comment-id");
        const replyId = e.currentTarget.getAttribute("data-reply-id");
        if (confirm("Удалить этот ответ?")) {
          try {
            await fetch(`/api/comments/${commentId}/reply/${replyId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            showNotification("Ответ удален");
            loadComments(storyId);
          } catch (err) {
            console.error(err);
          }
        }
      });
    });

    // Слушатели: Показать форму ответа
    document.querySelectorAll(".toggle-reply-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-target");
        document.getElementById(targetId).classList.toggle("d-none");
      });
    });

    // Слушатели: Отправить ответ
    document.querySelectorAll(".reply-form").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const commentId = form.getAttribute("data-comment-id");
        const sId = form.getAttribute("data-story-id");
        const text = form.querySelector(".reply-input").value;
        try {
          const res = await fetch(`/api/comments/${commentId}/reply`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text, userName: user.name }),
          });
          if (res.ok) {
            showNotification("Ответ добавлен!");
            loadComments(sId);
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};
