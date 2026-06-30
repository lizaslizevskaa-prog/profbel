let globalStories = [];

// 1. ГЕНЕРАТОР УВЕДОМЛЕНИЙ
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

document.addEventListener("DOMContentLoaded", () => {
  // 2. ТЕМА И ГЛАЗИКИ ПАРОЛЕЙ
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

  // 3. ФОРМА ОБРАТНОЙ СВЯЗИ
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const body = {
        userName: document.getElementById("userName").value.trim(),
        userEmail: document.getElementById("userEmail").value.trim(),
        message: document.getElementById("userMessage").value.trim(),
      };
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          alert("Сообщение отправлено!");
          contactForm.reset();
        }
      } catch (err) {
        alert("Ошибка сервера!");
      }
    });
  }

  // 4. СЛАЙДЕР И ГРИД ИСТОРИЙ
  const sliderTrack = document.getElementById("sliderTrack");
  if (sliderTrack) {
    let currentX = 0;
    let isPaused = false;
    const loadSlider = async () => {
      try {
        const res = await fetch("/api/stories/approved");
        const stories = await res.json();
        if (stories.length === 0) return;
        sliderTrack.innerHTML = stories
          .map(
            (s) =>
              `<div class="story-slide"><div class="d-flex align-items-center mb-3"><img src="${s.photo}" class="story-img me-3"><div><h5 class="mb-0 fw-bold text-light">${s.name}</h5><span class="text-primary-custom small fw-bold">${s.profession}</span></div></div><p class="text-muted-custom story-text-preview mb-3">${s.shortText}</p><a href="stories.html?id=${s._id}" class="btn btn-outline-cyan btn-sm">Подробнее</a></div>`,
          )
          .join("");
      } catch (e) {}
    };
    loadSlider();
  }

  const storiesGridView = document.getElementById("storiesGridView");
  if (storiesGridView) {
    const loadGrid = async () => {
      try {
        const res = await fetch("/api/stories/approved");
        globalStories = await res.json();
        storiesGridView.innerHTML = globalStories
          .map(
            (s) =>
              `<div class="col-md-6 col-lg-4"><div class="feature-card p-4 rounded-4 h-100 d-flex flex-column text-start"><div class="d-flex align-items-center mb-3"><img src="${s.photo}" class="story-img me-3"><h5 class="mb-0 fw-bold">${s.name}</h5></div><p class="text-primary-custom fw-bold mb-2">${s.profession}</p><p class="text-muted-custom flex-grow-1">${s.shortText}</p><button class="btn btn-accent-glow mt-3 align-self-start" onclick="openFullArticle('${s._id}')">Подробнее</button></div></div>`,
          )
          .join("");
      } catch (e) {}
    };
    loadGrid();
  }

  // 5. РЕЗУЛЬТАТЫ НА ГЛАВНОЙ
  const pastResCont = document.getElementById("pastResultsContainer");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (pastResCont) {
    if (!token) {
      if (pastResCont.parentElement)
        pastResCont.parentElement.classList.remove("d-none");
      pastResCont.innerHTML = `<div class="col-12 text-center py-5"><div class="p-5 rounded-4 border custom-border bg-surface shadow-lg"><i class="fas fa-lock fa-3x text-muted-custom mb-3"></i><h3 class="h4 text-light fw-bold mb-3">Войдите в личный кабинет</h3><p class="text-muted-custom mb-4">Чтобы увидеть свои результаты.</p><button class="btn btn-outline-cyan px-4 py-2" data-bs-toggle="modal" data-bs-target="#authModal">Войти</button></div></div>`;
    } else {
      fetch("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((u) => {
          if (u.testResults && u.testResults.length > 0) {
            if (pastResCont.parentElement)
              pastResCont.parentElement.classList.remove("d-none");
            fetch("/api/professions")
              .then((r) => r.json())
              .then((allProfs) => {
                pastResCont.innerHTML = u.testResults
                  .map((result, index) => {
                    const profList = result.topProfessions
                      .map((pName) => {
                        const pData = allProfs.find((x) => x.title === pName);
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
        .catch((e) => console.error(e));
    }
  }

  // 6. ШАПКА И ВЫХОД
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

  // 7. ЛОГИКА ФОРМ АВТОРИЗАЦИИ
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registerForm");
  const verifyForm = document.getElementById("verifyForm");
  const forgotForm = document.getElementById("forgotForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const authModalTitle = document.getElementById("authModalTitle");
  let currentRegEmail = "";

  const showF = (f, t) => {
    [loginForm, regForm, verifyForm, forgotForm, resetPasswordForm].forEach(
      (el) => {
        if (el) {
          el.classList.add("d-none");
          el.classList.remove("d-block");
        }
      },
    );
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
        alert("Возраст от 14 до 100 лет");
        return;
      }
      const pass = document.getElementById("regPassword").value;
      if (!/^(?=.*[A-ZА-ЯЁ])(?=.*\d).{6,}$/.test(pass)) {
        alert(
          "Слабый пароль! Нужно: мин 6 символов, 1 заглавная буква и 1 цифра.",
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

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (res.ok) {
          alert("Отлично! " + data.message);
          showF(verifyForm, "Подтверждение");
        } else {
          alert("Ошибка: " + data.message);
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert("Ошибка сервера!");
      }
    });
  }

  // --- ПОДТВЕРЖДЕНИЕ ---
  if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = verifyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      try {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Проверка...';
        submitBtn.disabled = true;

        const res = await fetch("/api/auth/verify", {
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
          alert("Почта подтверждена!");
          showF(loginForm, "Вход");
        } else {
          alert("Неверный код!");
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert("Ошибка связи");
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

        const res = await fetch("/api/auth/login", {
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
          alert("Ошибка: " + data.message);
        }
      } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert("Ошибка связи");
      }
    });
  }
});
