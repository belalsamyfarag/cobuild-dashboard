# CoBuild PropTech - High Performance Server (Co-Development & Day-by-Day Platform)
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
        query = urllib.parse.parse_qs(parsed.query)

        # 0. Cloud Health Liveness / Readiness Probe
        if path == "/healthz":
            self._send_json({
                "status": "healthy",
                "service": "cobuild-proptech-codevelopment",
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

            # 8. Daily Logs (Day-by-Day Construction Diary)
            elif path == "/api/daily-logs":
                cursor.execute("SELECT * FROM daily_logs ORDER BY date DESC")
                rows = cursor.fetchall()
                result = []
                for r in rows:
                    item = dict(r)
                    if item.get("photos_json"):
                        try:
                            item["photos"] = json.loads(item["photos_json"])
                        except:
                            item["photos"] = []
                    else:
                        item["photos"] = []
                    result.append(item)
                self._send_json(result)

            elif path == "/api/daily-logs/today":
                cursor.execute("SELECT * FROM daily_logs ORDER BY date DESC LIMIT 1")
                row = cursor.fetchone()
                if row:
                    item = dict(row)
                    if item.get("photos_json"):
                        try:
                            item["photos"] = json.loads(item["photos_json"])
                        except:
                            item["photos"] = []
                    else:
                        item["photos"] = []
                    self._send_json(item)
                else:
                    self._send_json({"error": "No daily logs found"}, 404)

            # 9. Co-Development Units
            elif path == "/api/units":
                status_filter = query.get("status", [None])[0]
                if status_filter:
                    cursor.execute("SELECT * FROM units WHERE status = ? ORDER BY floor_num ASC, unit_num ASC", (status_filter,))
                else:
                    cursor.execute("SELECT * FROM units ORDER BY floor_num ASC, unit_num ASC")
                rows = cursor.fetchall()
                self._send_json([dict(r) for r in rows])

            elif path.startswith("/api/units/"):
                unit_id = path.split("/")[-1]
                cursor.execute("SELECT * FROM units WHERE id = ? OR unit_num = ?", (unit_id, unit_id))
                row = cursor.fetchone()
                if row:
                    self._send_json(dict(row))
                else:
                    self._send_json({"error": "Unit not found"}, 404)

            # 10. Buyer Portal: My Unit & Milestone Payments
            elif path == "/api/buyer/my-unit":
                res_id = query.get("id", ["RES-302-BELAL"])[0]
                cursor.execute("""
                SELECT r.*, u.unit_num, u.floor_num, u.area_sqm, u.bedrooms, u.bathrooms, u.facade, u.floorplan_desc, u.completion_pct
                FROM buyer_reservations r
                JOIN units u ON r.unit_id = u.id
                WHERE r.id = ? OR r.unit_id = ?
                LIMIT 1
                """, (res_id, res_id))
                row = cursor.fetchone()
                if row:
                    data = dict(row)
                    if data.get("payment_schedule_json"):
                        try:
                            data["payment_schedule"] = json.loads(data["payment_schedule_json"])
                        except:
                            data["payment_schedule"] = []
                    self._send_json(data)
                else:
                    self._send_json({"error": "Reservation not found"}, 404)

            # 11. Syndicate Votes
            elif path == "/api/syndicate/votes":
                cursor.execute("SELECT * FROM syndicate_votes ORDER BY deadline ASC")
                rows = cursor.fetchall()
                result = []
                for r in rows:
                    item = dict(r)
                    if item.get("options_json"):
                        try:
                            item["options"] = json.loads(item["options_json"])
                        except:
                            item["options"] = []
                    result.append(item)
                self._send_json(result)

            # 12. Web Page Routes
            elif path == "/" or path == "/index.html":
                index_path = os.path.join(STATIC_DIR, "index.html")
                if not self._serve_file(index_path):
                    self._send_json({
                        "status": "online",
                        "name": "CoBuild PropTech Co-Development REST API",
                        "version": "2.5.0",
                        "endpoints": ["/api/project", "/api/daily-logs", "/api/units", "/api/buyer/my-unit", "/api/syndicate/votes", "/api/reports", "/api/milestones", "/api/floors", "/api/budget", "/api/rfis", "/api/telemetry/live"]
                    })

            elif path == "/marketplace" or path == "/marketplace.html":
                mp_path = os.path.join(STATIC_DIR, "marketplace.html")
                if not self._serve_file(mp_path):
                    self._send_json({"error": "Marketplace page not found"}, 404)

            elif path == "/project-view" or path == "/project-view.html":
                pv_path = os.path.join(STATIC_DIR, "project-view.html")
                if not self._serve_file(pv_path):
                    self._send_json({"error": "Project view page not found"}, 404)

            elif path == "/buyer-portal" or path == "/buyer-portal.html":
                bp_path = os.path.join(STATIC_DIR, "buyer-portal.html")
                if not self._serve_file(bp_path):
                    self._send_json({"error": "Buyer portal page not found"}, 404)

            elif path == "/engineer-entry" or path == "/engineer-entry.html":
                ee_path = os.path.join(STATIC_DIR, "engineer-entry.html")
                if not self._serve_file(ee_path):
                    self._send_json({"error": "Engineer entry page not found"}, 404)

            # 13. Static Assets (CSS, JS, Images, Icons, SVGs)
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

            # Add Daily Construction Log (From Site Engineer)
            elif path == "/api/daily-logs":
                log_id = payload.get("id") or f"log-{payload.get('date', time.strftime('%Y-%m-%d'))}-{int(time.time())%1000}"
                date = payload.get("date") or time.strftime("%Y-%m-%d")
                day_name = payload.get("day_name", "اليوم")
                title = payload.get("title", "تقرير يومي ميداني")
                description = payload.get("description", "")
                workforce_count = int(payload.get("workforce_count", 20))
                engineer_name = payload.get("engineer_name", "مهندس التنفيذ الميداني")
                weather = payload.get("weather", "26°C - معتدل")
                concrete_test = payload.get("concrete_test", "")
                stage = payload.get("stage", "الأعمال الميدانية")
                photos = payload.get("photos", [])

                cursor.execute("""
                INSERT INTO daily_logs (
                    id, project_id, date, day_name, title, description,
                    workforce_count, engineer_name, weather, concrete_test, stage, photos_json
                ) VALUES (?, 'CB-2023-NRG-01', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (log_id, date, day_name, title, description, workforce_count, engineer_name, weather, concrete_test, stage, json.dumps(photos, ensure_ascii=False)))
                conn.commit()

                self._send_json({
                    "success": True,
                    "message": "تم نشر وتوثيق التقرير الميداني اليومي بنجاح وإتاحته لجميع المشترين",
                    "log_id": log_id
                }, 201)

            # Reserve an Apartment Unit (Co-Development Booking)
            elif path == "/api/units/reserve":
                unit_id = payload.get("unit_id")
                buyer_name = payload.get("buyer_name", "").strip()
                buyer_phone = payload.get("buyer_phone", "").strip()
                buyer_email = payload.get("buyer_email", "").strip()

                if not unit_id or not buyer_name:
                    self._send_json({"error": "Unit ID and Buyer Name are required"}, 400)
                    return

                cursor.execute("SELECT * FROM units WHERE id = ?", (unit_id,))
                unit_row = cursor.fetchone()
                if not unit_row:
                    self._send_json({"error": "Unit not found"}, 404)
                    return

                # Update unit status
                cursor.execute("UPDATE units SET status = 'reserved', buyer_name = ? WHERE id = ?", (buyer_name, unit_id))

                # Create Reservation record
                res_id = f"RES-{unit_row['unit_num']}-{int(time.time())%10000}"
                total_price = unit_row["price_egp"]
                market_price = unit_row["market_price_egp"]
                savings = market_price - total_price
                downpayment = total_price * 0.20

                default_schedule = [
                    {"stage": "دفعة جدية الحجز والتعاقد التشاركي", "amount": downpayment, "percentage": "20%", "status": "مدفوعة", "date": time.strftime("%Y-%m-%d"), "notes": "حساب الضمان البنكي"},
                    {"stage": "دفعة إتمام أعمال الحفر والأساسات", "amount": total_price * 0.20, "percentage": "20%", "status": "مجدولة", "date": "المرحلة القادمة", "notes": "باعتماد الاستشاري"},
                    {"stage": "دفعة صب سقف دور شقتك", "amount": total_price * 0.20, "percentage": "20%", "status": "مجدولة", "date": "مرحلة الهيكل", "notes": "بعد كسر المكعبات"},
                    {"stage": "دفعة أعمال المباني والمحارة", "amount": total_price * 0.20, "percentage": "20%", "status": "مجدولة", "date": "مرحلة التشطيبات", "notes": "المعاينة الميدانية"},
                    {"stage": "دفعة الواجهات والمصاعد والرووف", "amount": total_price * 0.15, "percentage": "15%", "status": "مجدولة", "date": "مرحلة الواجهات", "notes": "تركيب الألوميتال"},
                    {"stage": "دفعة الاستلام النهائي والمفتاح والصك", "amount": total_price * 0.05, "percentage": "5%", "status": "مجدولة", "date": "الاستلام النهائي", "notes": "شهادة الصلاحية"}
                ]

                cursor.execute("""
                INSERT OR REPLACE INTO buyer_reservations (
                    id, unit_id, project_id, buyer_name, buyer_phone, buyer_email,
                    total_price, market_price, savings_amount, paid_amount, next_milestone, next_amount,
                    contract_status, escrow_account_num, reservation_date, payment_schedule_json
                ) VALUES (
                    ?, ?, 'CB-2023-NRG-01', ?, ?, ?,
                    ?, ?, ?, ?, 'أعمال الحفر والأساسات', ?,
                    'عقد تشاركي معتمد وقيد التوثيق', '492001928-EGP (البنك الأهلي المصري)', ?, ?
                )
                """, (
                    res_id, unit_id, buyer_name, buyer_phone, buyer_email,
                    total_price, market_price, savings, downpayment, total_price * 0.20,
                    time.strftime("%Y-%m-%d"), json.dumps(default_schedule, ensure_ascii=False)
                ))

                # Increment project reserved count
                cursor.execute("UPDATE projects SET co_building_reserved_units = co_building_reserved_units + 1 WHERE id = 'CB-2023-NRG-01'")
                conn.commit()

                self._send_json({
                    "success": True,
                    "message": f"تهانينا! تم حجز الشقة رقم {unit_row['unit_num']} بنجاح وتوثيق العقد التشاركي",
                    "reservation_id": res_id,
                    "unit_num": unit_row["unit_num"],
                    "savings_egp": savings
                }, 201)

            # Syndicate Vote Submission
            elif path.startswith("/api/syndicate/votes/") and path.endswith("/vote"):
                parts = path.split("/")
                vote_id = parts[4]
                option_id = int(payload.get("option_id", 1))

                cursor.execute("SELECT * FROM syndicate_votes WHERE id = ?", (vote_id,))
                vote_row = cursor.fetchone()
                if not vote_row:
                    self._send_json({"error": "Vote not found"}, 404)
                    return

                options = json.loads(vote_row["options_json"])
                for opt in options:
                    if opt["id"] == option_id:
                        opt["votes"] = opt.get("votes", 0) + 1

                new_total = sum(opt.get("votes", 0) for opt in options)
                for opt in options:
                    opt["pct"] = round((opt.get("votes", 0) / new_total) * 100) if new_total > 0 else 0

                cursor.execute("""
                UPDATE syndicate_votes SET options_json = ?, total_votes = ? WHERE id = ?
                """, (json.dumps(options, ensure_ascii=False), new_total, vote_id))
                conn.commit()

                self._send_json({
                    "success": True,
                    "message": "تم تسجيل صوتك التشاركي بنجاح وتحديث نسب القرارات للملاك",
                    "options": options,
                    "total_votes": new_total
                })

            else:
                self._send_json({"error": "POST endpoint not supported"}, 404)

        finally:
            conn.close()

def run_server():
    init_db()
    with socketserver.ThreadingTCPServer((HOST, PORT), RestApiHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"===================================================")
        print(f" CoBuild PropTech Engine - Co-Development Edition")
        print(f" Listening on: http://{HOST}:{PORT}")
        print(f" Health probe: http://{HOST}:{PORT}/healthz")
        print(f" Endpoints: /api/daily-logs, /api/units, /api/buyer/my-unit, /api/syndicate/votes")
        print(f"===================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    run_server()
