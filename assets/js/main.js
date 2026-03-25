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
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const item = btn.closest(".nav__item.has-dropdown");
      if (!item) return;

      const willOpen = !item.classList.contains("is-open");
      closeAllDropdowns(item);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
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
