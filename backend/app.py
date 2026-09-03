# CoBuild PropTech - REST API Server (Python + SQLite)
import http.server
import socketserver
import json
import urllib.parse
import os
import sys
import time
from database import get_connection, init_db

PORT = int(os.environ.get("PORT", 5000))
HOST = os.environ.get("HOST", "0.0.0.0")
STATIC_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class RestApiHandler(http.server.BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(204)

    def _send_json(self, data, status=200):
        self._set_cors_headers(status)
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
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

            # 4. BIM Floors
            elif path == "/api/floors":
                cursor.execute("SELECT * FROM floor_inspections ORDER BY floor_num ASC")
                rows = cursor.fetchall()
                floors = []
                for r in rows:
                    item = dict(r)
                    if item.get("snag_items"):
                        try:
                            item["snag_items"] = json.loads(item["snag_items"])
                        except:
                            pass
                    floors.append(item)
                self._send_json(floors)

            elif path.startswith("/api/floors/"):
                floor_id = path.split("/")[-1]
                cursor.execute("SELECT * FROM floor_inspections WHERE floor_num = ?", (floor_id,))
                row = cursor.fetchone()
                if row:
                    item = dict(row)
                    if item.get("snag_items"):
                        item["snag_items"] = json.loads(item["snag_items"])
                    self._send_json(item)
                else:
                    self._send_json({"error": "Floor not found"}, 404)

            # 5. Budget & Invoices
            elif path == "/api/budget":
                cursor.execute("SELECT * FROM budget_invoices ORDER BY date DESC")
                invoices = [dict(r) for r in cursor.fetchall()]
                self._send_json({
                    "totalBudgetSAR": 15000000,
                    "currency": "ر.س",
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

            elif path == "/" or path == "/index.html":
                index_path = os.path.join(STATIC_DIR, "index.html")
                if os.path.exists(index_path):
                    with open(index_path, 'rb') as f:
                        content = f.read()
                    self._set_cors_headers(200, "text/html")
                    self.wfile.write(content)
                    return
                else:
                    self._send_json({
                        "status": "online",
                        "name": "CoBuild PropTech REST API",
                        "version": "2.0.0",
                        "endpoints": ["/api/project", "/api/reports", "/api/milestones", "/api/floors", "/api/budget", "/api/rfis", "/api/telemetry/live"]
                    })

            elif path == "/marketplace" or path == "/marketplace.html":
                mp_path = os.path.join(STATIC_DIR, "marketplace.html")
                if os.path.exists(mp_path):
                    with open(mp_path, 'rb') as f:
                        content = f.read()
                    self._set_cors_headers(200, "text/html")
                    self.wfile.write(content)
                    return
                else:
                    self._send_json({"error": "Marketplace page not found"}, 404)

            elif path.startswith("/css/") or path.startswith("/js/"):
                file_path = os.path.join(STATIC_DIR, path.lstrip("/"))
                if os.path.exists(file_path) and os.path.isfile(file_path):
                    content_type = "text/css" if path.endswith(".css") else "application/javascript"
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    self._set_cors_headers(200, content_type)
                    self.wfile.write(content)
                    return
                else:
                    self._send_json({"error": "File not found"}, 404)

            else:
                self._send_json({"error": "Endpoint not found"}, 404)

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
    with socketserver.TCPServer((HOST, PORT), RestApiHandler) as httpd:
        print("===================================================")
        print(f" [*] CoBuild PropTech REST API Server running at:")
        print(f"     http://{HOST}:{PORT}")
        print(f"     Database: {os.path.join(os.path.dirname(__file__), 'cobuild.db')}")
        print("===================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            sys.exit(0)

if __name__ == "__main__":
    run_server()
