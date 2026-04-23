/* ===========================
   app.js — Login Page Logic
=========================== */

(function () {
  "use strict";

  // ── DOM refs ──────────────────────────────────────────────
  const form       = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const pwInput    = document.getElementById("password");
  const togglePw   = document.getElementById("togglePw");
  const eyeOpen    = document.getElementById("eyeOpen");
  const eyeClosed  = document.getElementById("eyeClosed");
  const btnLogin   = document.getElementById("btnLogin");
  const formCard   = document.getElementById("formCard");

  const fieldEmail = document.getElementById("fieldEmail");
  const fieldPw    = document.getElementById("fieldPassword");
  const emailError = document.getElementById("emailError");
  const pwError    = document.getElementById("passwordError");

  // ── Helpers ───────────────────────────────────────────────
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  function setError(field, errorEl, msg) {
    field.classList.add("has-error");
    errorEl.textContent = msg;
  }

  function clearError(field, errorEl) {
    field.classList.remove("has-error");
    errorEl.textContent = "";
  }

  function shakeCard() {
    formCard.style.animation = "none";
    formCard.offsetHeight; // reflow
    formCard.style.animation = "shake 0.4s ease";
  }

  // Add shake keyframes dynamically
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ── Real-time validation ──────────────────────────────────
  emailInput.addEventListener("blur", () => {
    if (!emailInput.value) {
      setError(fieldEmail, emailError, "이메일을 입력해주세요.");
    } else if (!isValidEmail(emailInput.value)) {
      setError(fieldEmail, emailError, "올바른 이메일 형식이 아닙니다.");
    } else {
      clearError(fieldEmail, emailError);
    }
  });

  emailInput.addEventListener("input", () => {
    if (fieldEmail.classList.contains("has-error") && isValidEmail(emailInput.value)) {
      clearError(fieldEmail, emailError);
    }
  });

  pwInput.addEventListener("blur", () => {
    if (!pwInput.value) {
      setError(fieldPw, pwError, "비밀번호를 입력해주세요.");
    } else if (pwInput.value.length < 6) {
      setError(fieldPw, pwError, "비밀번호는 최소 6자 이상이어야 합니다.");
    } else {
      clearError(fieldPw, pwError);
    }
  });

  pwInput.addEventListener("input", () => {
    if (fieldPw.classList.contains("has-error") && pwInput.value.length >= 6) {
      clearError(fieldPw, pwError);
    }
  });

  // ── Password toggle ───────────────────────────────────────
  togglePw.addEventListener("click", () => {
    const isHidden = pwInput.type === "password";
    pwInput.type = isHidden ? "text" : "password";
    eyeOpen.style.display   = isHidden ? "none"  : "block";
    eyeClosed.style.display = isHidden ? "block" : "none";
    pwInput.focus();
  });

  // ── Form submit ───────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate
    let hasError = false;

    if (!emailInput.value) {
      setError(fieldEmail, emailError, "이메일을 입력해주세요.");
      hasError = true;
    } else if (!isValidEmail(emailInput.value)) {
      setError(fieldEmail, emailError, "올바른 이메일 형식이 아닙니다.");
      hasError = true;
    }

    if (!pwInput.value) {
      setError(fieldPw, pwError, "비밀번호를 입력해주세요.");
      hasError = true;
    } else if (pwInput.value.length < 6) {
      setError(fieldPw, pwError, "비밀번호는 최소 6자 이상이어야 합니다.");
      hasError = true;
    }

    if (hasError) {
      shakeCard();
      return;
    }

    // Loading state
    btnLogin.disabled = true;
    btnLogin.classList.add("loading");

    // Simulate async login (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Demo: any valid input succeeds
    btnLogin.disabled = false;
    btnLogin.classList.remove("loading");
    showSuccess();
  });

  // ── Success state ─────────────────────────────────────────
  function showSuccess() {
    // Inject success message once
    if (!document.querySelector(".success-message")) {
      const successEl = document.createElement("div");
      successEl.className = "success-message";
      successEl.innerHTML = `
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="success-title">로그인 성공!</h3>
        <p class="success-sub">환영합니다. 잠시 후 이동합니다.</p>
      `;
      formCard.appendChild(successEl);
    }

    formCard.classList.add("success-state");
  }

  // ── Social button feedback ────────────────────────────────
  document.querySelectorAll(".btn-social").forEach((btn) => {
    btn.addEventListener("click", () => {
      const original = btn.innerHTML;
      btn.style.opacity = "0.6";
      btn.disabled = true;
      setTimeout(() => {
        btn.style.opacity = "";
        btn.disabled = false;
      }, 1200);
    });
  });

  // ── Input focus icon colour enhancement ──────────────────
  [emailInput, pwInput].forEach((input) => {
    const icon = input.closest(".input-wrap").querySelector(".input-icon");
    input.addEventListener("focus",  () => { icon.style.color = "var(--p4)"; });
    input.addEventListener("blur",   () => { icon.style.color = ""; });
  });

})();
