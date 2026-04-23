/* ===========================
   03_login.js — API 연동 버전
=========================== */
import api from '../api/axios'; // axios 설정 가져오기

(function () {
  "use strict";

  // ── DOM refs (기존과 동일) ──────────────────────────────────
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

  // ── Helpers (기존과 동일) ───────────────────────────────────
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  function setError(field, errorEl, msg) { field.classList.add("has-error"); errorEl.textContent = msg; }
  function clearError(field, errorEl) { field.classList.remove("has-error"); errorEl.textContent = ""; }
  function shakeCard() {
    formCard.style.animation = "none";
    formCard.offsetHeight; // reflow
    formCard.style.animation = "shake 0.4s ease";
  }

  // ── Form submit ───────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 유효성 검사
    let hasError = false;
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
      setError(fieldEmail, emailError, "올바른 이메일을 입력해주세요.");
      hasError = true;
    }
    if (!pwInput.value || pwInput.value.length < 6) {
      setError(fieldPw, pwError, "비밀번호는 최소 6자 이상이어야 합니다.");
      hasError = true;
    }

    if (hasError) {
      shakeCard();
      return;
    }

    //  로딩 상태 시작
    btnLogin.disabled = true;
    btnLogin.classList.add("loading");

    try {
      // 2. 가짜 Promise를 지우고 실제 백엔드 API 호출
      const response = await api.post('/api/auth/login', {
        email: emailInput.value,
        password: pwInput.value
      });

      // 3. 성공 시 처리
      if (response.status === 200) {
        console.log("로그인 성공!", response.data);
        
        // 유저 정보 저장 (선택 사항)
        localStorage.setItem("user", JSON.stringify(response.data));

        showSuccess();

        // 2초 뒤 메인으로 이동
        setTimeout(() => {
          window.location.href = "/"; 
        }, 2000);
      }
    } catch (error) {
      // 4. 로그인 실패 시 처리 (비밀번호 틀림 등)
      console.error("로그인 실패:", error);
      shakeCard();
      
      // 서버에서 보내는 에러 메시지가 있다면 그걸 사용하고, 없으면 기본 메시지 사용
      const errorMsg = error.response?.data?.message || "이메일 또는 비밀번호가 일치하지 않습니다.";
      setError(fieldPw, pwError, errorMsg);
      
    } finally {
      // 로딩 상태 해제
      btnLogin.disabled = false;
      btnLogin.classList.remove("loading");
    }
  });

  // (이하 Success state, Social button feedback, Focus 효과 코드는 기존과 동일하게 유지)
  function showSuccess() {
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

  // (나머지 코드들...)
  togglePw.addEventListener("click", () => {
    const isHidden = pwInput.type === "password";
    pwInput.type = isHidden ? "text" : "password";
    eyeOpen.style.display   = isHidden ? "none"  : "block";
    eyeClosed.style.display = isHidden ? "block" : "none";
    pwInput.focus();
  });

})();