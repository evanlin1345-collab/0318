const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

/** 使用 MyMemory 免費翻譯（有流量限制）；失敗時請改手動輸入英文 */
async function translateZhToEn(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return "";
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(trimmed.slice(0, 450)) +
    "&langpair=zh-TW|en";
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("翻譯服務無回應");
  const data = await r.json();
  const out = String(data.responseData?.translatedText ?? "").trim();
  if (!out) throw new Error("翻譯結果為空");
  const status = Number(data.responseStatus);
  if (status !== 200) throw new Error(data.responseDetails || "翻譯失敗");
  return out;
}

const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "data", "announcements.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const PORT = Number(process.env.PORT) || 8080;

const app = express();
app.use(express.json({ limit: "128kb" }));
app.use(express.static(ROOT));

async function readAnnouncements() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error("invalid data shape");
  return data;
}

async function writeAnnouncements(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2) + "\n", "utf8");
}

function sortedCopy(items) {
  return [...items].sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
}

function requireAdmin(req, res, next) {
  const pwd = req.headers["x-admin-password"];
  if (typeof pwd !== "string" || pwd !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "需要後台密碼或密碼錯誤" });
  }
  next();
}

async function finalizeAnnouncementFields(body) {
  const titleZh = String(body.titleZh ?? "").trim();
  let titleEn = String(body.titleEn ?? "").trim();
  const date = String(body.date ?? "").trim();
  const tag = body.tag != null ? String(body.tag).trim() : "";
  let tagEn = body.tagEn != null ? String(body.tagEn).trim() : "";

  if (!titleZh || !date) {
    return { error: "請填寫中文標題與日期" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "日期格式須為 YYYY-MM-DD" };
  }

  if (!titleEn) {
    try {
      titleEn = await translateZhToEn(titleZh);
    } catch (e) {
      console.error(e);
      return { error: "英文標題為空且自動翻譯失敗，請按「產生英文翻譯」或手動填寫" };
    }
  }

  if (!tag) {
    tagEn = "";
  } else if (!tagEn) {
    try {
      tagEn = await translateZhToEn(tag);
    } catch (e) {
      console.error(e);
      tagEn = tag;
    }
  }

  return { value: { titleZh, titleEn, date, tag, tagEn } };
}

app.get("/api/announcements", async (req, res) => {
  try {
    const items = await readAnnouncements();
    res.json(sortedCopy(items));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "讀取公告失敗" });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  const pwd = req.body && req.body.password;
  if (typeof pwd === "string" && pwd === ADMIN_PASSWORD) {
    return res.status(204).send();
  }
  res.status(401).json({ error: "密碼錯誤" });
});

app.post("/api/translate", requireAdmin, async (req, res) => {
  try {
    const titleZh = String(req.body?.titleZh ?? "").trim();
    const tag = req.body?.tag != null ? String(req.body.tag).trim() : "";
    if (!titleZh && !tag) {
      return res.status(400).json({ error: "請至少提供中文標題或中文標籤" });
    }
    const titleEn = titleZh ? await translateZhToEn(titleZh) : "";
    let tagEn = "";
    if (tag) {
      try {
        tagEn = await translateZhToEn(tag);
      } catch (e) {
        console.error(e);
        tagEn = tag;
      }
    }
    if (titleZh && !titleEn) {
      return res.status(502).json({ error: "標題翻譯失敗，請稍後再試" });
    }
    res.json({ titleEn, tagEn });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: e.message || "翻譯失敗，請檢查網路或改手動輸入英文" });
  }
});

app.post("/api/announcements", requireAdmin, async (req, res) => {
  try {
    const norm = await finalizeAnnouncementFields(req.body);
    if (norm.error) return res.status(400).json({ error: norm.error });

    const items = await readAnnouncements();
    const item = { id: randomUUID(), ...norm.value };
    items.push(item);
    await writeAnnouncements(items);
    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "新增失敗" });
  }
});

app.put("/api/announcements/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readAnnouncements();
    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: "找不到公告" });

    const cur = items[idx];
    const merged = {
      ...cur,
      ...(req.body.titleZh !== undefined ? { titleZh: String(req.body.titleZh).trim() } : {}),
      ...(req.body.titleEn !== undefined ? { titleEn: String(req.body.titleEn).trim() } : {}),
      ...(req.body.date !== undefined ? { date: String(req.body.date).trim() } : {}),
      ...(req.body.tag !== undefined ? { tag: String(req.body.tag).trim() } : {}),
      ...(req.body.tagEn !== undefined ? { tagEn: String(req.body.tagEn).trim() } : {}),
    };

    const norm = await finalizeAnnouncementFields(merged);
    if (norm.error) return res.status(400).json({ error: norm.error });

    items[idx] = { ...cur, ...norm.value, id: cur.id };
    await writeAnnouncements(items);
    res.json(items[idx]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "更新失敗" });
  }
});

app.delete("/api/announcements/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readAnnouncements();
    const next = items.filter((x) => x.id !== id);
    if (next.length === items.length) return res.status(404).json({ error: "找不到公告" });
    await writeAnnouncements(next);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "刪除失敗" });
  }
});

app.listen(PORT, () => {
  console.log(`imMBA 網站與 API：http://localhost:${PORT}/`);
  console.log(`後台：http://localhost:${PORT}/admin.html`);
  console.log(`後台密碼：環境變數 ADMIN_PASSWORD（未設定時預設為 admin123）`);
});
