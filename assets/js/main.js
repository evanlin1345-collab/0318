function setLang(lang) {
  document.documentElement.setAttribute("lang", lang);

  const zhBtn = document.getElementById("lang-zh-btn");
  const enBtn = document.getElementById("lang-en-btn");
  if (zhBtn && enBtn) {
    zhBtn.classList.toggle("is-active", lang === "zh");
    enBtn.classList.toggle("is-active", lang === "en");
  }
}

function closeAllDropdowns(exceptEl) {
  const items = document.querySelectorAll(".nav__item.has-dropdown.is-open");
  items.forEach((item) => {
    if (exceptEl && (item === exceptEl || item.contains(exceptEl))) return;
    item.classList.remove("is-open");
    const btn = item.querySelector(":scope > .nav__btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

/** 寬螢幕且為滑鼠操作時，下拉改由 CSS :hover 控制，點擊不切換 */
function useHoverDropdowns() {
  return window.matchMedia("(min-width: 981px) and (hover: hover) and (pointer: fine)").matches;
}

function setupNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeAllDropdowns();
    });
  }

  const dropdownButtons = document.querySelectorAll(".nav__item.has-dropdown > .nav__btn");
  dropdownButtons.forEach((btn) => {
    const item = btn.closest(".nav__item.has-dropdown");
    if (!item) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (useHoverDropdowns()) return;
      const willOpen = !item.classList.contains("is-open");
      closeAllDropdowns(item);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });

    item.addEventListener("mouseenter", () => {
      if (!useHoverDropdowns()) return;
      btn.setAttribute("aria-expanded", "true");
    });
    item.addEventListener("mouseleave", () => {
      if (!useHoverDropdowns()) return;
      if (item.contains(document.activeElement)) return;
      btn.setAttribute("aria-expanded", "false");
    });
    item.addEventListener("focusin", () => {
      if (!useHoverDropdowns()) return;
      btn.setAttribute("aria-expanded", "true");
    });
    item.addEventListener("focusout", () => {
      if (!useHoverDropdowns()) return;
      setTimeout(() => {
        if (!item.contains(document.activeElement)) {
          btn.setAttribute("aria-expanded", "false");
        }
      }, 0);
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const item = btn.closest(".nav__item.has-dropdown");
        if (!item) return;
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.closest(".nav")) return;
    closeAllDropdowns();

    const navEl = document.querySelector(".nav");
    const navToggle = document.getElementById("nav-toggle");
    if (navEl && navToggle && navEl.classList.contains("is-open")) {
      navEl.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAllDropdowns();

    const navEl = document.querySelector(".nav");
    const navToggle = document.getElementById("nav-toggle");
    if (navEl && navToggle && navEl.classList.contains("is-open")) {
      navEl.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });
}

function setupLanguage() {
  const zhBtn = document.getElementById("lang-zh-btn");
  const enBtn = document.getElementById("lang-en-btn");

  if (zhBtn) zhBtn.addEventListener("click", () => setLang("zh"));
  if (enBtn) enBtn.addEventListener("click", () => setLang("en"));
}

setupLanguage();
setupNav();
