# CoBuild PropTech - High Performance Server (Google Cloud Run & Local)
import http.server
import socketserver
import json
import urllib.parse
import os
import sys
import time
import mimetypes
from database import get_connection, init_db

# Default to 8080 for Google Cloud Run ($PORT injected dynamically by Cloud Run)
PORT = int(os.environ.get("PORT", 8080))
HOST = os.environ.get("HOST", "0.0.0.0")
STATIC_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

mimetypes.init()

class RestApiHandler(http.server.BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200, content_type="application/json", content_length=None):
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8" if "text" in content_type or "json" in content_type or "javascript" in content_type else content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache" if "/api/" in self.path else "public, max-age=3600")
        if content_length is not None:
            self.send_header("Content-Length", str(content_length))
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(204)

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self._set_cors_headers(status, "application/json", len(body))
        self.wfile.write(body)

    def _serve_file(self, file_path):
        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            content_type = mime_type or "application/octet-stream"
            with open(file_path, 'rb') as f:
                content = f.read()
            self._set_cors_headers(200, content_type, len(content))
            self.wfile.write(content)
            return True
        return False

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 0. Cloud Health Liveness / Readiness Probe
        if path == "/healthz":
            self._send_json({
                "status": "healthy",
                "service": "cobuild-proptech",
                "timestamp": time.time(),
                "environment": "google-cloud-ready"
            })
            return

        conn = get_connection()
        cursor = conn.cursor()

        try:
            # 1. Project info
            if path == "/api/project":
                cursor.execute("SELECT * FROM projects LIMIT 1")
                row = cursor.fetchone()
                if row:
                    self._send_json(dict(row))
                else:
                    self._send_json({"error": "Project not found"}, 404)

            # 2. Monthly Reports
            elif path == "/api/reports":
                cursor.execute("SELECT * FROM reports ORDER BY id ASC")
                rows = cursor.fetchall()
                self._send_json([dict(r) for r in rows])

            # 3. Milestones
            elif path == "/api/milestones":
                cursor.execute("SELECT * FROM milestones ORDER BY created_at DESC")
                rows = cursor.fetchall()
                self._send_json([dict(r) for r in rows])

            # 4. BIM Floor Inspections
            elif path == "/api/floors":
                cursor.execute("SELECT * FROM floor_inspections ORDER BY floor_num ASC")
                rows = cursor.fetchall()
                result = []
                for r in rows:
                    item = dict(r)
                    if item.get("snag_items"):
                        try:
                            item["snag_items"] = json.loads(item["snag_items"])
                        except:
                            item["snag_items"] = []
                    result.append(item)
                self._send_json(result)

            elif path.startswith("/api/floors/"):
                floor_id = path.split("/")[-1]
                cursor.execute("SELECT * FROM floor_inspections WHERE floor_num = ?", (floor_id,))
                row = cursor.fetchone()
                if row:
                    item = dict(row)
                    if item.get("snag_items"):
                        try:
                            item["snag_items"] = json.loads(item["snag_items"])
                        except:
                            item["snag_items"] = []
                    self._send_json(item)
                else:
                    self._send_json({"error": "Floor not found"}, 404)

            # 5. Budget & Invoices
            elif path == "/api/budget":
                cursor.execute("SELECT * FROM budget_invoices ORDER BY date DESC")
                invoices = [dict(r) for r in cursor.fetchall()]
                self._send_json({
                    "totalBudgetSAR": 15000000,
                    "currency": "ج.م",
                    "invoices": invoices
                })

            # 6. RFIs & Submittals
            elif path == "/api/rfis":
                cursor.execute("SELECT * FROM rfis ORDER BY date DESC")
                rows = cursor.fetchall()
                self._send_json([dict(r) for r in rows])

            # 7. Live IoT Telemetry
            elif path == "/api/telemetry/live":
                self._send_json({
                    "concrete_temp": 28.4,
                    "crane_tilt": 0.18,
                    "noise_db": 68.0,
                    "air_quality_aqi": 28,
                    "status": "healthy"
                })

            # 8. Web Page Routes
            elif path == "/" or path == "/index.html":
                index_path = os.path.join(STATIC_DIR, "index.html")
                if not self._serve_file(index_path):
                    self._send_json({
                        "status": "online",
                        "name": "CoBuild PropTech REST API",
                        "version": "2.1.0",
                        "endpoints": ["/api/project", "/api/reports", "/api/milestones", "/api/floors", "/api/budget", "/api/rfis", "/api/telemetry/live"]
                    })

            elif path == "/marketplace" or path == "/marketplace.html":
                mp_path = os.path.join(STATIC_DIR, "marketplace.html")
                if not self._serve_file(mp_path):
                    self._send_json({"error": "Marketplace page not found"}, 404)

            elif path == "/project-view" or path == "/project-view.html":
                pv_path = os.path.join(STATIC_DIR, "project-view.html")
                if not self._serve_file(pv_path):
                    self._send_json({"error": "Project view page not found"}, 404)

            # 9. Static Assets (CSS, JS, Images, Icons, SVGs)
            else:
                rel_path = path.lstrip("/")
                target_file = os.path.join(STATIC_DIR, rel_path)
                if not self._serve_file(target_file):
                    self._send_json({"error": "Resource not found", "path": path}, 404)

        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        try:
            payload = json.loads(body.decode('utf-8'))
        except:
            payload = {}

        conn = get_connection()
        cursor = conn.cursor()

        try:
            # Add new milestone
            if path == "/api/milestones":
                m_id = payload.get("id") or f"ev-{int(time.time())}"
                title = payload.get("title", "")
                subtitle = payload.get("subtitle", "")
                date = payload.get("date", "")
                priority = payload.get("priority", "medium")
                status = payload.get("status", "مجدول")

                cursor.execute("""
                INSERT INTO milestones (id, project_id, title, subtitle, date, status, priority)
                VALUES (?, 'CB-2023-NRG-01', ?, ?, ?, ?, ?)
                """, (m_id, title, subtitle, date, status, priority))
                conn.commit()

                self._send_json({
                    "success": True,
                    "message": "Milestone created successfully",
                    "milestone": {
                        "id": m_id,
                        "title": title,
                        "subtitle": subtitle,
                        "date": date,
                        "status": status,
                        "priority": priority
                    }
                }, 201)

            else:
                self._send_json({"error": "POST endpoint not supported"}, 404)

        finally:
            conn.close()

def run_server():
    init_db()
    with socketserver.ThreadingTCPServer((HOST, PORT), RestApiHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"===================================================")
        print(f" CoBuild PropTech Engine - Google Cloud Ready")
        print(f" Listening on: http://{HOST}:{PORT}")
        print(f" Health probe: http://{HOST}:{PORT}/healthz")
        print(f"===================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    run_server()
