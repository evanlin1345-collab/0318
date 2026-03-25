"""
imMBA 網站伺服器（僅用 Python 標準函式庫）。
API 與 Node 版 server.js 相同；若已安裝 Node，也可改用 npm start。

用法：
  python server.py

環境變數：
  PORT            預設 8080
  ADMIN_PASSWORD  後台密碼，預設 admin123
"""

from __future__ import annotations

import json
import os
import re
import uuid
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import quote, unquote, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "announcements.json"
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
PORT = int(os.environ.get("PORT", "8080"))


def read_announcements() -> list:
    raw = DATA_FILE.read_text(encoding="utf8")
    data = json.loads(raw)
    if not isinstance(data, list):
        raise ValueError("invalid announcements file")
    return data


def write_announcements(items: list) -> None:
    DATA_FILE.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf8")


def sort_announcements(items: list) -> list:
    return sorted(items, key=lambda x: x.get("date", ""), reverse=True)


def translate_zh_to_en(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    text = text[:450]
    q = quote(text)
    url = f"https://api.mymemory.translated.net/get?q={q}&langpair=zh-TW|en"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf8"))
    status = int(str(data.get("responseStatus", 0)))
    if status != 200:
        raise RuntimeError(data.get("responseDetails") or "翻譯失敗")
    out = (data.get("responseData") or {}).get("translatedText") or ""
    return str(out).strip()


def finalize_fields(body: dict) -> tuple[dict | None, str | None]:
    """Returns (value_dict, error_message)."""
    title_zh = str(body.get("titleZh") or "").strip()
    title_en = str(body.get("titleEn") or "").strip()
    date = str(body.get("date") or "").strip()
    tag = str(body.get("tag") or "").strip()
    tag_en = str(body.get("tagEn") or "").strip()

    if not title_zh or not date:
        return None, "請填寫中文標題與日期"
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
        return None, "日期格式須為 YYYY-MM-DD"

    if not title_en:
        try:
            title_en = translate_zh_to_en(title_zh)
        except Exception as e:
            print(e)
            return None, "英文標題為空且自動翻譯失敗，請按「產生英文翻譯」或手動填寫"

    if not tag:
        tag_en = ""
    elif not tag_en:
        try:
            tag_en = translate_zh_to_en(tag)
        except Exception as e:
            print(e)
            tag_en = tag

    return {"titleZh": title_zh, "titleEn": title_en, "date": date, "tag": tag, "tagEn": tag_en}, None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        print("[%s] %s - %s" % (self.log_date_time_string(), self.address_string(), format % args))

    def _json_body(self) -> dict | None:
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0:
            return {}
        try:
            raw = self.rfile.read(length).decode("utf8")
            return json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            return None

    def _send_json(self, status: int, obj) -> None:
        data = json.dumps(obj, ensure_ascii=False).encode("utf8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _send_empty(self, status: int) -> None:
        self.send_response(status)
        self.end_headers()

    def _check_admin(self) -> bool:
        pwd = self.headers.get("X-Admin-Password")
        return isinstance(pwd, str) and pwd == ADMIN_PASSWORD

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == "/api/announcements":
            try:
                items = sort_announcements(read_announcements())
                self._send_json(200, items)
            except Exception as e:
                print(e)
                self._send_json(500, {"error": "讀取公告失敗"})
            return

        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == "/api/auth/verify":
            body = self._json_body()
            if body is None:
                self._send_json(400, {"error": "JSON 格式錯誤"})
                return
            pwd = body.get("password")
            if isinstance(pwd, str) and pwd == ADMIN_PASSWORD:
                self._send_empty(204)
            else:
                self._send_json(401, {"error": "密碼錯誤"})
            return

        if path == "/api/translate":
            if not self._check_admin():
                self._send_json(401, {"error": "需要後台密碼或密碼錯誤"})
                return
            body = self._json_body()
            if body is None:
                self._send_json(400, {"error": "JSON 格式錯誤"})
                return
            title_zh = str(body.get("titleZh") or "").strip()
            tag = str(body.get("tag") or "").strip()
            if not title_zh and not tag:
                self._send_json(400, {"error": "請至少提供中文標題或中文標籤"})
                return
            title_en = ""
            if title_zh:
                try:
                    title_en = translate_zh_to_en(title_zh)
                except Exception as e:
                    print(e)
                    self._send_json(502, {"error": "標題翻譯失敗，請稍後再試"})
                    return
            tag_en = ""
            if tag:
                try:
                    tag_en = translate_zh_to_en(tag)
                except Exception as e:
                    print(e)
                    tag_en = tag
            self._send_json(200, {"titleEn": title_en, "tagEn": tag_en})
            return

        if path == "/api/announcements":
            if not self._check_admin():
                self._send_json(401, {"error": "需要後台密碼或密碼錯誤"})
                return
            body = self._json_body()
            if body is None:
                self._send_json(400, {"error": "JSON 格式錯誤"})
                return
            val, err = finalize_fields(body)
            if err:
                self._send_json(400, {"error": err})
                return
            try:
                items = read_announcements()
                item = {"id": str(uuid.uuid4()), **val}
                items.append(item)
                write_announcements(items)
                self._send_json(201, item)
            except Exception as e:
                print(e)
                self._send_json(500, {"error": "新增失敗"})
            return

        self.send_error(404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        prefix = "/api/announcements/"
        if path.startswith(prefix) and len(path) > len(prefix):
            if not self._check_admin():
                self._send_json(401, {"error": "需要後台密碼或密碼錯誤"})
                return
            aid = path[len(prefix) :]
            body = self._json_body()
            if body is None:
                self._send_json(400, {"error": "JSON 格式錯誤"})
                return
            try:
                items = read_announcements()
                idx = next((i for i, x in enumerate(items) if x.get("id") == aid), -1)
                if idx < 0:
                    self._send_json(404, {"error": "找不到公告"})
                    return
                cur = dict(items[idx])
                merged = dict(cur)
                if "titleZh" in body:
                    merged["titleZh"] = str(body["titleZh"]).strip()
                if "titleEn" in body:
                    merged["titleEn"] = str(body["titleEn"]).strip()
                if "date" in body:
                    merged["date"] = str(body["date"]).strip()
                if "tag" in body:
                    merged["tag"] = str(body["tag"]).strip()
                if "tagEn" in body:
                    merged["tagEn"] = str(body["tagEn"]).strip()
                val, err = finalize_fields(merged)
                if err:
                    self._send_json(400, {"error": err})
                    return
                items[idx] = {**cur, **val, "id": cur["id"]}
                write_announcements(items)
                self._send_json(200, cur)
            except Exception as e:
                print(e)
                self._send_json(500, {"error": "更新失敗"})
            return

        self.send_error(404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        prefix = "/api/announcements/"
        if path.startswith(prefix) and len(path) > len(prefix):
            if not self._check_admin():
                self._send_json(401, {"error": "需要後台密碼或密碼錯誤"})
                return
            aid = path[len(prefix) :]
            try:
                items = read_announcements()
                nxt = [x for x in items if x.get("id") != aid]
                if len(nxt) == len(items):
                    self._send_json(404, {"error": "找不到公告"})
                    return
                write_announcements(nxt)
                self._send_empty(204)
            except Exception as e:
                print(e)
                self._send_json(500, {"error": "刪除失敗"})
            return

        self.send_error(404)


def main():
    print(f"imMBA 網站與 API：http://localhost:{PORT}/")
    print(f"後台：http://localhost:{PORT}/admin.html")
    print("後台密碼：環境變數 ADMIN_PASSWORD（未設定時預設為 admin123）")
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
