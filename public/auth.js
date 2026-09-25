// Autenticación de demostración: se guarda en el navegador (localStorage),
// NO es una base de datos real ni segura para producción.
function getUsers() {
  return JSON.parse(localStorage.getItem("drift_users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("drift_users", JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("drift_current_user") || "null");
}
function setCurrentUser(user) {
  localStorage.setItem("drift_current_user", JSON.stringify(user));
}

const authModal = document.getElementById("auth-modal");
const authOverlay = document.getElementById("auth-overlay");
const accountBtn = document.getElementById("account-btn");
const accountLabel = document.getElementById("account-label");
const authClose = document.getElementById("auth-close");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginMsg = document.getElementById("login-msg");
const registerMsg = document.getElementById("register-msg");
const tabBtns = document.querySelectorAll(".tab-btn");

function openAuth() { authModal.classList.add("open"); authOverlay.classList.add("open"); }
function closeAuth() { authModal.classList.remove("open"); authOverlay.classList.remove("open"); }

function updateAccountLabel() {
  const user = getCurrentUser();
  accountLabel.textContent = user ? `Hola, ${user.name}` : "Cuenta";
}

accountBtn.addEventListener("click", () => {
  const user = getCurrentUser();
  if (user) {
    if (confirm(`¿Cerrar sesión de ${user.name}?`)) {
      localStorage.removeItem("drift_current_user");
      updateAccountLabel();
    }
  } else {
    openAuth();
  }
});

authClose.addEventListener("click", closeAuth);
authOverlay.addEventListener("click", closeAuth);

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (btn.dataset.tab === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    }
  });
});

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim().toLowerCase();
  const password = document.getElementById("register-password").value;

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    registerMsg.textContent = "Ya existe una cuenta con ese correo.";
    return;
  }
  users.push({ name, email, password });
  saveUsers(users);
  setCurrentUser({ name, email });
  updateAccountLabel();
  registerMsg.textContent = "";
  closeAuth();
});

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    loginMsg.textContent = "Correo o contraseña incorrectos.";
    return;
  }
  setCurrentUser({ name: user.name, email: user.email });
  updateAccountLabel();
  loginMsg.textContent = "";
  closeAuth();
});

updateAccountLabel();
