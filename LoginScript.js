import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Referências aos campos
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");

const auth = getAuth();

// 🔹 Carregar dados salvos (se existir)
window.addEventListener("load", () => {
  const savedEmail = localStorage.getItem("savedEmail");
  const savedPassword = localStorage.getItem("savedPassword");

  if (savedEmail && savedPassword) {
    emailInput.value = savedEmail;
    passwordInput.value = savedPassword;
    rememberMeCheckbox.checked = true;
  }
});

// 🔹 Login
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Se marcar "Lembrar senha", salvar no localStorage
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("savedPassword", password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }

    // Redireciona para calendário
    window.location.href = "calendario.html";

  } catch (error) {
    alert("Erro ao entrar: " + error.message);
  }
});
