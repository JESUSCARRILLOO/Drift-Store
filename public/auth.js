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
const accountBtn = document.getElementById("account-btn");
const accountLabel = document.getElementById("account-label");
const authClose = document.getElementById("auth-close");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginMsg = document.getElementById("login-msg");
const registerMsg = document.getElementById("register-msg");
const tabBtns = authModal.querySelectorAll(".tab-btn");

function closeAuth() { authModal.close(); }

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
    authModal.showModal();
  }
});

authClose.addEventListener("click", closeAuth);
authModal.addEventListener("click", event => {
  if (event.target !== authModal) return;
  const bounds = authModal.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) {
    closeAuth();
  }
});

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const isRegister = btn.dataset.tab === "register";
    tabBtns.forEach(tab => {
      tab.classList.toggle("active", tab === btn);
      tab.setAttribute("aria-pressed", String(tab === btn));
    });
    authModal.classList.toggle("auth-register", isRegister);
    loginForm.classList.toggle("hidden", isRegister);
    registerForm.classList.toggle("hidden", !isRegister);
    authModal.scrollTop = 0;
  });
});

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  registerMsg.textContent = "";
  const fields = new FormData(registerForm);
  const firstName = fields.get("register-name").trim();
  const lastName = fields.get("register-last-name").trim();
  const email = fields.get("register-email").trim().toLowerCase();
  const password = fields.get("register-password");
  const rawPhone = fields.get("phone").trim();
  const phone = rawPhone.replace(/^\+52/, "").replace(/[\s()-]/g, "");
  const shippingAddress = {
    country: "MX",
    state: fields.get("state"),
    municipality: fields.get("municipality").trim(),
    locality: fields.get("locality").trim(),
    neighborhood: fields.get("neighborhood").trim(),
    postalCode: fields.get("postalCode"),
    street: fields.get("street").trim(),
    exteriorNumber: fields.get("exteriorNumber").trim(),
    interiorNumber: fields.get("interiorNumber").trim(),
    references: fields.get("references").trim()
  };

  const requiredTextFields = ["register-name", "register-last-name", "municipality", "locality", "neighborhood", "street", "exteriorNumber"];
  const emptyField = requiredTextFields.find(field => !fields.get(field).trim());
  if (emptyField) {
    registerMsg.textContent = "Completa el campo marcado con datos válidos.";
    registerForm.elements.namedItem(emptyField).focus();
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    registerMsg.textContent = "Escribe un teléfono válido de 10 dígitos.";
    registerForm.elements.phone.focus();
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    registerMsg.textContent = "Ya existe una cuenta con ese correo.";
    return;
  }
  const profile = { name: firstName + " " + lastName, firstName, lastName, email, phone: "+52" + phone, shippingAddress };
  users.push({ ...profile, password });
  saveUsers(users);
  setCurrentUser(profile);
  registerForm.reset();
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
  const { name, firstName, lastName, phone, shippingAddress } = user;
  setCurrentUser({ name, firstName, lastName, email: user.email, phone, shippingAddress });
  updateAccountLabel();
  loginMsg.textContent = "";
  closeAuth();
});

updateAccountLabel();
