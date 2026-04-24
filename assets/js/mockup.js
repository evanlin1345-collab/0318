(() => {
  const screenEls = Array.from(document.querySelectorAll(".screen"));
  const flowBtns = Array.from(document.querySelectorAll(".flow-btn"));
  const navLinks = Array.from(document.querySelectorAll("[data-go]"));
  const bottomTabs = Array.from(document.querySelectorAll(".bottom-nav a"));
  const statusTime = document.querySelector(".status-time");

  let currentId = "screen-1";
  const times = {
    "screen-1": "21:04",
    "screen-2": "21:05",
    "screen-3": "21:07",
    "screen-4": "21:09",
    "screen-5": "21:10",
  };

  function setActiveTab(id) {
    bottomTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.go === id);
    });
    flowBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.screen === id);
    });
    if (statusTime) statusTime.textContent = times[id] || "21:04";
  }

  function goToScreen(id) {
    if (!id || id === currentId) return;
    const nextEl = document.getElementById(id);
    const currentEl = document.getElementById(currentId);
    if (!nextEl || !currentEl) return;

    currentEl.classList.add("is-leaving");
    currentEl.classList.remove("is-active");

    requestAnimationFrame(() => {
      nextEl.classList.add("is-active");
      currentEl.classList.remove("is-leaving");
      currentId = id;
      setActiveTab(id);
    });
  }

  flowBtns.forEach((btn) => {
    btn.addEventListener("click", () => goToScreen(btn.dataset.screen));
  });

  navLinks.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goToScreen(el.dataset.go);
    });
  });

  setActiveTab(currentId);
})();
