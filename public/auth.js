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

document.body.insertAdjacentHTML("beforeend", `
<dialog id="auth-modal" class="auth-modal" aria-labelledby="auth-title">
  <button id="auth-close" type="button" aria-label="Cerrar cuenta">×</button>
  <h2 id="auth-title">Tu cuenta</h2>
  <div class="auth-tabs">
    <button type="button" class="tab-btn active" data-tab="login" aria-pressed="true">Iniciar sesión</button>
    <button type="button" class="tab-btn" data-tab="register" aria-pressed="false">Registrarse</button>
  </div>
  <form id="login-form" class="auth-form">
    <label>Correo electrónico<input id="login-email" name="login-email" type="email" autocomplete="username" required autofocus></label>
    <label>Contraseña<input id="login-password" name="login-password" type="password" autocomplete="current-password" required></label>
    <p id="login-msg" class="auth-msg" role="status"></p>
    <button type="submit" class="btn-primary">Entrar</button>
  </form>
  <form id="register-form" class="auth-form hidden">
    <fieldset>
      <legend>Datos de la cuenta</legend>
      <div class="auth-grid">
        <label>Nombre(s)<input id="register-name" name="register-name" autocomplete="given-name" required></label>
        <label>Apellido(s)<input id="register-last-name" name="register-last-name" autocomplete="family-name" required></label>
        <label>Teléfono celular<input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="shipping tel" required aria-describedby="phone-hint">
          <small id="phone-hint">Escribe 10 dígitos. Puedes incluir el prefijo +52.</small>
        </label>
        <label>Contraseña<input id="register-password" name="register-password" type="password" autocomplete="new-password" minlength="8" required placeholder="Mínimo 8 caracteres"></label>
        <label class="auth-wide">Correo electrónico<input id="register-email" name="register-email" type="email" autocomplete="username" required></label>
      </div>
    </fieldset>
    <fieldset>
      <legend>Domicilio de envío en México</legend>
      <div class="auth-grid">
        <label class="auth-wide">Calle<input id="street" name="street" autocomplete="shipping address-line1" required></label>
        <label>Número exterior<input id="exteriorNumber" name="exteriorNumber" required placeholder="Ej. 123, 123 A o S/N"></label>
        <label>Número interior (opcional)<input id="interiorNumber" name="interiorNumber" autocomplete="shipping address-line2"></label>
        <label>Colonia o asentamiento<input id="neighborhood" name="neighborhood" autocomplete="shipping address-level3" required></label>
        <label>Código postal<input id="postalCode" name="postalCode" inputmode="numeric" autocomplete="shipping postal-code" pattern="[0-9]{5}" maxlength="5" required placeholder="5 dígitos"></label>
        <label>Ciudad o localidad<input id="locality" name="locality" autocomplete="shipping address-level2" required></label>
        <label>Municipio o alcaldía<input id="municipality" name="municipality" required></label>
        <label class="auth-wide">Estado
          <select name="state" autocomplete="shipping address-level1" required>
            <option value="">Selecciona tu estado</option>
            <option>Aguascalientes</option>
            <option>Baja California</option>
            <option>Baja California Sur</option>
            <option>Campeche</option>
            <option>Chiapas</option>
            <option>Chihuahua</option>
            <option>Ciudad de México</option>
            <option>Coahuila</option>
            <option>Colima</option>
            <option>Durango</option>
            <option>Estado de México</option>
            <option>Guanajuato</option>
            <option>Guerrero</option>
            <option>Hidalgo</option>
            <option>Jalisco</option>
            <option>Michoacán</option>
            <option>Morelos</option>
            <option>Nayarit</option>
            <option>Nuevo León</option>
            <option>Oaxaca</option>
            <option>Puebla</option>
            <option>Querétaro</option>
            <option>Quintana Roo</option>
            <option>San Luis Potosí</option>
            <option>Sinaloa</option>
            <option>Sonora</option>
            <option>Tabasco</option>
            <option>Tamaulipas</option>
            <option>Tlaxcala</option>
            <option>Veracruz</option>
            <option>Yucatán</option>
            <option>Zacatecas</option>
          </select>
        </label>
        <label class="auth-wide">Referencias de entrega (opcional)
          <textarea name="references" rows="2" placeholder="Ej. Entre calles, color de fachada o indicaciones de acceso"></textarea>
        </label>
      </div>
    </fieldset>
    <p class="auth-note">Registro de prueba. Usa datos ficticios, ya que se guardan en este navegador.</p>
    <p id="register-msg" class="auth-msg" role="status"></p>
    <button type="submit" class="btn-primary">Crear cuenta</button>
  </form>
</dialog>
`);

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
