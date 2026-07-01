// Путь к файлу: public/js/main.js

let globalStories = [];

// 1. ГЕНЕРАТОР УВЕДОМЛЕНИЙ (КРАСИВЫЕ АЛЕРТЫ-ТОСТЫ)
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
  toast.innerHTML = `<div class="d-flex"><div class="toast-body fw-bold fs-6"><i class="fas ${iconClass} me-2"></i> ${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};

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
    const suggestBlock = document.getElementById("suggestStoryBlock");
    if (suggestBlock) suggestBlock.classList.add("d-none");
    document.getElementById("fullArticleView").classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.loadComments(id);
  }
};

window.loadComments = async function (storyId) {
  const commentsList = document.getElementById("commentsList");
  const formContainer = document.getElementById("commentFormContainer");
  if (!commentsList || !formContainer) return;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    formContainer.innerHTML = `<div class="p-3 rounded-3 border custom-border text-center" style="background-color: var(--bg-dark);"><p class="text-muted-custom small mb-0">Войдите в личный кабинет, чтобы задать вопрос.</p></div>`;
  } else {
    formContainer.innerHTML = `<form id="addCommentForm" class="d-flex gap-2"><input type="text" id="commentText" class="form-control custom-input text-light" placeholder="Задайте ваш вопрос..." style="background-color: var(--bg-dark) !important; border-radius: 12px; height: 50px;" required><button type="submit" class="btn btn-accent-glow py-2 px-4">Спросить</button></form>`;
    document.getElementById("addCommentForm").onsubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`${API_URL}/api/comments`, {
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
          window.loadComments(storyId);
        }
      } catch (err) {
        console.error(err);
      }
    };
  }

  try {
    const res = await fetch(`${API_URL}/api/comments/${storyId}`);
    const comments = await res.json();
    if (comments.length === 0) {
      commentsList.innerHTML = `<div class="text-center text-muted-custom py-3">Вопросов пока нет.</div>`;
      return;
    }
    const currentUserId = user ? user.id : null;
    const isAdmin = user ? user.role === "admin" : false;

    commentsList.innerHTML = comments
      .map((c) => {
        const isOwner = currentUserId === c.userId || isAdmin;
        const deleteBtn = isOwner
          ? `<button class="btn btn-link text-danger p-0 ms-auto" onclick="window.deleteComment('${c._id}', '${storyId}')" title="Удалить"><i class="fas fa-trash-alt"></i></button>`
          : "";
        const repliesHtml = (c.replies || [])
          .map((r) => {
            const isReplyOwner = currentUserId === r.userId || isAdmin;
            const delReplyBtn = isReplyOwner
              ? `<button class="btn btn-link text-danger p-0 ms-auto" onclick="window.deleteReply('${c._id}', '${r._id}', '${storyId}')"><i class="fas fa-trash-alt"></i></button>`
              : "";
            return `<div class="p-3 mt-2 rounded-4 border custom-border" style="background-color: var(--bg-surface); margin-left: 30px;"><div class="d-flex align-items-center mb-2"><i class="fas fa-reply text-purple me-2"></i><span class="fw-bold text-light small">${r.userName}</span><span class="text-muted-custom small ms-2">${new Date(r.date).toLocaleDateString("ru-RU")}</span>${delReplyBtn}</div><p class="mb-0 text-muted-custom small ms-4">${r.text}</p></div>`;
          })
          .join("");
        const replyFormHtml = token
          ? `<div class="mt-3 d-none" id="rf-${c._id}"><form class="d-flex gap-2" onsubmit="window.sendReply(event, '${c._id}', '${storyId}')"><input type="text" class="form-control custom-input text-light ri-${c._id}" placeholder="Ответ..." style="background-color: var(--bg-surface)!important; height: 40px;" required><button type="submit" class="btn btn-accent-glow py-1 btn-sm">OK</button></form></div><button class="btn btn-link text-cyan p-0 mt-2 small text-decoration-none" onclick="document.getElementById('rf-${c._id}').classList.toggle('d-none')"><i class="fas fa-reply me-1"></i>Ответить</button>`
          : "";
        return `<div class="p-3 rounded-4 border custom-border text-start d-flex flex-column" style="background-color: var(--bg-dark);"><div class="d-flex align-items-center mb-2"><i class="fas fa-user-circle fs-4 text-cyan me-2"></i><span class="fw-bold text-light small">${c.userName}</span><span class="text-muted-custom small ms-2">${new Date(c.date).toLocaleDateString("ru-RU")}</span>${deleteBtn}</div><p class="mb-0 text-muted-custom small ms-1">${c.text}</p>${repliesHtml}${replyFormHtml}</div>`;
      })
      .join("");
  } catch (err) {
    console.error(err);
  }
};

window.sendReply = async function (e, commentId, storyId) {
  e.preventDefault();
  const text = document.querySelector(`.ri-${commentId}`).value;
  const res = await fetch(`${API_URL}/api/comments/${commentId}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      text,
      userName: JSON.parse(localStorage.getItem("user")).name,
    }),
  });
  if (res.ok) window.loadComments(storyId);
};

window.deleteComment = async function (id, sId) {
  if (confirm("Удалить вопрос?")) {
    await fetch(`${API_URL}/api/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    window.loadComments(sId);
  }
};

window.deleteReply = async function (cId, rId, sId) {
  if (confirm("Удалить ответ?")) {
    await fetch(`${API_URL}/api/comments/${cId}/reply/${rId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    window.loadComments(sId);
  }
};

// ==========================================
// ОСНОВНОЙ СКРИПТ САЙТА
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // ТЕМА И ПАРОЛИ
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

  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      this.classList.toggle("fa-eye-slash");
      this.classList.toggle("fa-eye");
    });
  });

  // ФОРМА ОБРАТНОЙ СВЯЗИ
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const emailVal = document.getElementById("userEmail").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        window.showNotification(
          "Пожалуйста, введите корректный Email адрес!",
          "error",
        );
        return;
      }
      const body = {
        userName: document.getElementById("userName").value.trim(),
        userEmail: emailVal,
        message: document.getElementById("userMessage").value.trim(),
      };
      try {
        const res = await fetch(`${API_URL}/api/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          window.showNotification("Сообщение отправлено!", "success");
          contactForm.reset();
        }
      } catch (err) {
        window.showNotification("Ошибка сервера!", "error");
      }
    });
  }

  // СЛАЙДЕР ИСТОРИЙ УСПЕХА
  const sliderTrack = document.getElementById("sliderTrack");
  if (sliderTrack) {
    let currentX = 0;
    let isPaused = false;
    const loadSlider = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stories/approved`);
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
      } catch (e) {
        console.log(e);
      }
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

  // ИСТОРИИ (ГРИД)
  const storiesGridView = document.getElementById("storiesGridView");
  if (storiesGridView) {
    const loadGrid = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stories/approved`);
        globalStories = await res.json();
        storiesGridView.innerHTML = globalStories
          .map(
            (s) =>
              `<div class="col-md-6 col-lg-4"><div class="feature-card p-4 rounded-4 h-100 d-flex flex-column text-start"><div class="d-flex align-items-center mb-3"><img src="${s.photo}" class="story-img me-3"><h5 class="mb-0 fw-bold">${s.name}</h5></div><p class="text-primary-custom fw-bold mb-2">${s.profession}</p><p class="text-muted-custom flex-grow-1">${s.shortText}</p><button class="btn btn-accent-glow mt-3 align-self-start" onclick="window.openFullArticle('${s._id}')">Подробнее</button></div></div>`,
          )
          .join("");
        const storyId = new URLSearchParams(window.location.search).get("id");
        if (storyId) window.openFullArticle(storyId);
      } catch (e) {
        console.log(e);
      }
    };
    loadGrid();
    document.getElementById("backToGridBtn")?.addEventListener("click", () => {
      document.getElementById("fullArticleView").classList.add("d-none");
      storiesGridView.classList.remove("d-none");
      const suggestBlock = document.getElementById("suggestStoryBlock");
      if (suggestBlock) suggestBlock.classList.remove("d-none");
      window.scrollTo(0, 0);
    });
  }

  // РЕЗУЛЬТАТЫ НА ГЛАВНОЙ
  const pastResCont = document.getElementById("pastResultsContainer");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (pastResCont) {
    if (!token) {
      if (pastResCont.parentElement)
        pastResCont.parentElement.classList.remove("d-none");
      pastResCont.innerHTML = `<div class="col-12 text-center py-5"><div class="p-5 rounded-4 border custom-border bg-surface shadow-lg"><i class="fas fa-lock fa-3x text-muted-custom mb-3"></i><h3 class="h4 text-light fw-bold mb-3">Войдите в личный кабинет</h3><p class="text-muted-custom mb-4">Чтобы увидеть свои результаты.</p><button class="btn btn-outline-cyan px-4 py-2" data-bs-toggle="modal" data-bs-target="#authModal">Войти</button></div></div>`;
    } else {
      fetch(`${API_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((u) => {
          if (u.testResults && u.testResults.length > 0) {
            if (pastResCont.parentElement)
              pastResCont.parentElement.classList.remove("d-none");
                fetch(`${API_URL}/api/professions`)
              .then((r) => r.json())
              .then((allProfessions) => {
                pastResCont.innerHTML = u.testResults
                  .map((result, index) => {
                    const profList = result.topProfessions
                      .map((pName) => {
                        const pData = allProfessions.find(
                          (x) => x.title === pName,
                        );
                        const profUrl = pData
                          ? `profession.html?id=${pData._id}`
                          : "catalog.html";
                        return `<li class="mb-2 d-flex align-items-center"><i class="fas fa-check-circle text-primary-custom me-2"></i><a href="${profUrl}" class="text-light text-decoration-none hover-primary small">${pName}</a></li>`;
                      })
                      .join("");
                    return `<div class="col-md-4 d-flex align-items-stretch mt-4"><div class="custom-card card p-4 w-100 border custom-border position-relative" style="background-color: var(--bg-surface); border-radius: 20px;"><div class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-cyan text-dark px-3 py-2 shadow">Попытка ${u.testResults.length - index}</div><div class="mt-2 mb-3 border-bottom custom-border pb-2 d-flex justify-content-between align-items-center"><span class="text-main fw-bold small">Ваш Топ-3:</span><span class="text-muted-custom extra-small">${new Date(result.date).toLocaleDateString("ru-RU")}</span></div><ul class="list-unstyled mb-0">${profList}</ul></div></div>`;
                  })
                  .join("");
              });
          }
        })
        .catch((e) => console.log(e));
    }
  }

  // ШАПКА И ВЫХОД
  if (token && user) {
    document
      .querySelectorAll('button[data-bs-target="#authModal"]')
      .forEach((btn) => {
        btn.parentElement.innerHTML = `<div class="dropdown"><button class="btn btn-outline-cyan dropdown-toggle" data-bs-toggle="dropdown"><i class="fas fa-user-circle"></i> ${user.name.split(" ")[0]}</button><ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end bg-surface border border-secondary shadow-lg"><li><a class="dropdown-item" href="profile.html">Профиль</a></li>${user.role === "admin" ? '<li><a class="dropdown-item text-warning" href="admin.html">Админка</a></li>' : ""}<li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" id="logoutBtn">Выйти</button></li></ul></div>`;
      });
    document.body.addEventListener("click", (e) => {
      if (e.target.id === "logoutBtn") {
        localStorage.clear();
        location.href = "index.html";
      }
    });
  }

  // ЛОГИКА ФОРМ АВТОРИЗАЦИИ
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registerForm");
  const verifyForm = document.getElementById("verifyForm");
  const forgotForm = document.getElementById("forgotForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const authModalTitle = document.getElementById("authModalTitle");
  let currentRegEmail = "";

  const showF = (f, t) => {
    [loginForm, regForm, verifyForm, forgotForm, resetPasswordForm].forEach((el) => {
      if (el) {
        el.classList.add("d-none");
        el.classList.remove("d-block");
      }
    });
    if (f) {
      f.classList.remove("d-none");
      f.classList.add("d-block");
    }
    if (authModalTitle) authModalTitle.textContent = t;
  };

  document.getElementById("showRegisterBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showF(regForm, "Регистрация");
  });
  document.getElementById("showLoginBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showF(loginForm, "Вход");
  });
  document.getElementById("showForgotBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showF(forgotForm, "Сброс пароля");
  });
  document.querySelectorAll(".backToLoginBtn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showF(loginForm, "Вход");
    }),
  );

  // --- РЕГИСТРАЦИЯ ---
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const age = parseInt(document.getElementById("regAge").value);
      if (isNaN(age) || age < 14 || age > 100) {
        window.showNotification(
          "Возраст должен быть от 14 до 100 лет",
          "error",
        );
        return;
      }
      const pass = document.getElementById("regPassword").value;
      if (!/^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/.test(pass)) {
        window.showNotification(
          "Слабый пароль! Нужно: мин 6 символов, 1 заглавная буква и 1 цифра.",
          "error",
        );
        return;
      }

      currentRegEmail = document.getElementById("regEmail").value;
      const body = {
        name: document.getElementById("regName").value,
        email: currentRegEmail,
        password: pass,
        gender: document.getElementById("regGender").value,
        age: age,
        education: document.getElementById("regEdu").value,
      };

      const submitBtn = regForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      try {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
        submitBtn.disabled = true;

        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (res.ok) {
          window.showNotification(data.message, "success");
          showF(verifyForm, "Подтверждение почты");
        } else {
          window.showNotification("Ошибка: " + data.message, "error");
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        window.showNotification("Ошибка сервера!", "error");
      }
    });
  }

  // --- ПОДТВЕРЖДЕНИЕ ПОЧТЫ ---
  if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = verifyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      try {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Проверка...';
        submitBtn.disabled = true;

        const res = await fetch(`${API_URL}/api/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentRegEmail,
            code: document.getElementById("verifyCode").value,
          }),
        });
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (res.ok) {
          window.showNotification("Почта подтверждена!", "success");
          showF(loginForm, "Вход");
        } else {
          window.showNotification("Неверный код!", "error");
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        window.showNotification("Ошибка связи", "error");
      }
    });
  }

  // --- ВХОД ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputs = loginForm.querySelectorAll("input");
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
        submitBtn.disabled = true;

        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: inputs[0].value,
            password: inputs[1].value,
          }),
        });
        const data = await res.json();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.reload();
        } else {
          window.showNotification(data.message, "error");
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        window.showNotification("Сервер не отвечает. Подождите 30 сек и попробуйте снова.", "error");
      }
    });
  }

  // --- ЗАБЫЛИ ПАРОЛЬ (ШАГ 1) ---
  if (forgotForm) {
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      currentRegEmail = document.getElementById("forgotEmail").value;
      const submitBtn = forgotForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      try {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentRegEmail }),
        });
        const data = await res.json();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (res.ok) {
          window.showNotification(data.message, "success");
          showF(resetPasswordForm, "Новый пароль");
        } else {
          window.showNotification("Ошибка: " + data.message, "error");
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        window.showNotification("Ошибка сервера!", "error");
      }
    });
  }

  // --- СБРОС ПАРОЛЯ (ШАГ 2) ---
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("resetCode").value;
      const newPassword = document.getElementById("resetNewPassword").value;
      const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      try {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Проверка...';
        submitBtn.disabled = true;

        const res = await fetch(`${API_URL}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentRegEmail, code, newPassword }),
        });
        const data = await res.json();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (res.ok) {
          window.showNotification(data.message, "success");
          resetPasswordForm.reset();
          showF(loginForm, "Вход");
        } else {
          window.showNotification("Ошибка: " + data.message, "error");
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        window.showNotification("Ошибка сервера!", "error");
      }
    });
  }
});
