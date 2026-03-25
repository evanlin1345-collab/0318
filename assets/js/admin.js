(function () {
  var STORAGE_KEY = "immba_admin_password";

  function getPassword() {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  }

  function setPassword(pwd) {
    if (pwd) sessionStorage.setItem(STORAGE_KEY, pwd);
    else sessionStorage.removeItem(STORAGE_KEY);
  }

  function authHeaders() {
    var pwd = getPassword();
    return {
      "Content-Type": "application/json",
      "X-Admin-Password": pwd,
    };
  }

  var loginSection = document.getElementById("admin-login-section");
  var panel = document.getElementById("admin-panel");
  var loginForm = document.getElementById("admin-login-form");
  var loginMsg = document.getElementById("admin-login-msg");
  var passwordInput = document.getElementById("admin-password");
  var tbody = document.getElementById("admin-tbody");
  var editForm = document.getElementById("admin-edit-form");
  var formMsg = document.getElementById("admin-form-msg");
  var formHeading = document.getElementById("admin-form-heading");
  var submitBtn = document.getElementById("admin-submit");
  var editId = document.getElementById("edit-id");
  var editDate = document.getElementById("edit-date");
  var editTag = document.getElementById("edit-tag");
  var editTitleZh = document.getElementById("edit-title-zh");
  var editTitleEn = document.getElementById("edit-title-en");
  var editTagEn = document.getElementById("edit-tag-en");
  var translateBtn = document.getElementById("admin-translate");
  var cancelEdit = document.getElementById("admin-cancel-edit");
  var logoutBtn = document.getElementById("admin-logout");

  function showPanel(show) {
    if (loginSection) loginSection.classList.toggle("admin-card--hidden", show);
    if (panel) panel.classList.toggle("admin-card--hidden", !show);
  }

  function resetForm() {
    editId.value = "";
    editDate.value = "";
    editTag.value = "";
    editTagEn.value = "";
    editTitleZh.value = "";
    editTitleEn.value = "";
    formHeading.textContent = "新增公告";
    submitBtn.textContent = "新增";
    formMsg.textContent = "";
  }

  function enterEdit(item) {
    editId.value = item.id;
    editDate.value = item.date || "";
    editTag.value = item.tag || "";
    editTagEn.value = item.tagEn != null ? item.tagEn : "";
    editTitleZh.value = item.titleZh || "";
    editTitleEn.value = item.titleEn || "";
    formHeading.textContent = "編輯公告";
    submitBtn.textContent = "儲存變更";
    formMsg.textContent = "";
    editForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function formatTableDate(iso) {
    if (!iso) return "";
    var d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    if (Number.isNaN(d.getTime())) return iso;
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "/" + m + "/" + day;
  }

  async function refreshList() {
    var res = await fetch("/api/announcements");
    if (!res.ok) throw new Error("載入列表失敗");
    var items = await res.json();
    tbody.innerHTML = "";

    items.forEach(function (item) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        formatTableDate(item.date) +
        "</td><td>" +
        (item.tag ? "<span class=\"admin-tag\">" + escapeHtml(item.tag) + "</span>" : "—") +
        "</td><td>" +
        escapeHtml(item.titleZh) +
        "</td><td>" +
        escapeHtml(item.titleEn) +
        "</td><td class=\"admin-table-actions\"></td>";

      var tdActions = tr.querySelector(".admin-table-actions");
      var btnEdit = document.createElement("button");
      btnEdit.type = "button";
      btnEdit.className = "btn btn--sm btn--ghost";
      btnEdit.textContent = "編輯";
      btnEdit.addEventListener("click", function () {
        enterEdit(item);
      });

      var btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "btn btn--sm admin-btn-danger";
      btnDel.textContent = "刪除";
      btnDel.addEventListener("click", function () {
        if (!confirm("確定刪除此則公告？")) return;
        deleteItem(item.id);
      });

      tdActions.appendChild(btnEdit);
      tdActions.appendChild(btnDel);
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  async function deleteItem(id) {
    formMsg.textContent = "";
    try {
      var res = await fetch("/api/announcements/" + encodeURIComponent(id), {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        setPassword("");
        showPanel(false);
        loginMsg.textContent = "登入已失效，請重新登入。";
        return;
      }
      if (!res.ok) {
        var err = await res.json().catch(function () {
          return {};
        });
        formMsg.textContent = err.error || "刪除失敗";
        return;
      }
      if (editId.value === id) resetForm();
      await refreshList();
    } catch (e) {
      formMsg.textContent = "無法連線到伺服器。";
    }
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    loginMsg.textContent = "";
    var pwd = passwordInput.value;
    try {
      var res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) {
        loginMsg.textContent = res.status === 401 ? "密碼錯誤" : "驗證失敗";
        return;
      }
      setPassword(pwd);
      passwordInput.value = "";
      showPanel(true);
      resetForm();
      await refreshList();
    } catch (err) {
      loginMsg.textContent = "無法連線，請確認已執行 python server.py 或 npm start。";
    }
  });

  translateBtn.addEventListener("click", async function () {
    formMsg.textContent = "";
    var titleZh = editTitleZh.value.trim();
    var tag = editTag.value.trim();
    if (!titleZh && !tag) {
      formMsg.textContent = "請先填寫中文標題或中文標籤。";
      return;
    }
    try {
      var res = await fetch("/api/translate", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ titleZh: titleZh, tag: tag }),
      });
      if (res.status === 401) {
        setPassword("");
        showPanel(false);
        loginMsg.textContent = "登入已失效，請重新登入。";
        return;
      }
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok) {
        formMsg.textContent = data.error || "翻譯失敗";
        return;
      }
      if (titleZh && data.titleEn) editTitleEn.value = data.titleEn;
      if (tag && data.tagEn != null) editTagEn.value = data.tagEn;
      if (!tag) editTagEn.value = "";
      formMsg.textContent = "已填入英文，請檢查是否正確後再儲存。";
    } catch (err) {
      formMsg.textContent = "無法連線或翻譯失敗。";
    }
  });

  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    formMsg.textContent = "";
    var body = {
      titleZh: editTitleZh.value.trim(),
      titleEn: editTitleEn.value.trim(),
      date: editDate.value,
      tag: editTag.value.trim(),
      tagEn: editTagEn.value.trim(),
    };

    var id = editId.value.trim();
    var url = id ? "/api/announcements/" + encodeURIComponent(id) : "/api/announcements";
    var method = id ? "PUT" : "POST";

    try {
      var res = await fetch(url, {
        method: method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        setPassword("");
        showPanel(false);
        loginMsg.textContent = "登入已失效，請重新登入。";
        return;
      }
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok) {
        formMsg.textContent = data.error || "操作失敗";
        return;
      }
      resetForm();
      await refreshList();
      formMsg.textContent = id ? "已更新。" : "已新增。";
    } catch (err) {
      formMsg.textContent = "無法連線到伺服器。";
    }
  });

  cancelEdit.addEventListener("click", resetForm);

  logoutBtn.addEventListener("click", function () {
    setPassword("");
    showPanel(false);
    resetForm();
    loginMsg.textContent = "已登出。";
  });

  function boot() {
    if (getPassword()) {
      showPanel(true);
      refreshList().catch(function () {
        formMsg.textContent = "無法載入列表，請確認伺服器已啟動。";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
