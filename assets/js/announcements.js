(function () {
  function formatDate(iso) {
    if (!iso || typeof iso !== "string") return "";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    if (Number.isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "/" + m + "/" + day;
  }

  function renderNewsItem(item) {
    const li = document.createElement("li");
    li.className = "news__item";

    const left = document.createElement("div");
    left.className = "news__left";

    if (item.tag || item.tagEn) {
      const tagZh = document.createElement("span");
      tagZh.className = "tag lang-zh";
      tagZh.textContent = item.tag || item.tagEn || "";
      const tagEn = document.createElement("span");
      tagEn.className = "tag lang-en";
      tagEn.textContent = item.tagEn || item.tag || "";
      left.appendChild(tagZh);
      left.appendChild(tagEn);
    }

    const zh = document.createElement("span");
    zh.className = "lang-zh";
    zh.textContent = item.titleZh || "";

    const en = document.createElement("span");
    en.className = "lang-en";
    en.textContent = item.titleEn || "";

    left.appendChild(zh);
    left.appendChild(en);

    const time = document.createElement("time");
    time.className = "news__date";
    time.dateTime = item.date || "";
    time.textContent = formatDate(item.date);

    li.appendChild(left);
    li.appendChild(time);
    return li;
  }

  function fillList(ul, items, limit) {
    ul.innerHTML = "";
    var list = limit != null ? items.slice(0, limit) : items;
    list.forEach(function (item) {
      ul.appendChild(renderNewsItem(item));
    });
  }

  function showLoadError(latest, all) {
    var msg =
      '<li class="news__item"><div class="news__left"><span class="lang-zh">無法載入公告。請使用 <code style="font-size:12px">npm start</code> 啟動網站伺服器（勿只用開啟檔案）。</span><span class="lang-en">Could not load announcements. Run <code style="font-size:12px">npm start</code> to serve this site.</span></div></li>';
    if (latest) latest.innerHTML = msg;
    if (all) all.innerHTML = msg;
  }

  async function loadAnnouncements() {
    var res = await fetch("/api/announcements");
    if (!res.ok) throw new Error("bad status");
    return res.json();
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var latest = document.getElementById("news-latest");
    var all = document.getElementById("announcements-all");
    if (!latest && !all) return;

    try {
      var items = await loadAnnouncements();
      if (latest) fillList(latest, items, 3);
      if (all) fillList(all, items, null);
    } catch (e) {
      showLoadError(latest, all);
    }
  });
})();
