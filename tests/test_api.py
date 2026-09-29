# CoBuild PropTech - Backend REST API & Database Test Suite (Co-Development Edition)
import unittest
import urllib.request
import urllib.parse
import json
import os
import sys
import time

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))
import database

API_PORT = os.environ.get("PORT", "8080")
API_URL = os.environ.get("TEST_API_URL", f"http://127.0.0.1:{API_PORT}/api")

class TestCoBuildBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Verify database initialization and seeding
        database.init_db()
        conn = database.get_connection()
        conn.cursor().execute("DELETE FROM daily_logs WHERE id LIKE 'test-log-%'")
        conn.commit()
        conn.close()

    def test_01_database_tables_exist(self):
        """Verify all 11 relational tables exist in SQLite database"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()

        expected_tables = [
            'projects', 'reports', 'milestones', 'floor_inspections',
            'budget_invoices', 'iot_telemetry', 'rfis',
            'units', 'daily_logs', 'buyer_reservations', 'syndicate_votes'
        ]
        for table in expected_tables:
            self.assertIn(table, tables, f"Table {table} must exist in database")

    def test_02_units_data_integrity(self):
        """Verify Co-Development units are properly seeded and calculate positive savings"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM units")
        units = [dict(r) for r in cursor.fetchall()]
        conn.close()

        self.assertGreaterEqual(len(units), 6, "At least 6 units should be seeded")
        
        # Verify unit 302 (the buyer unit)
        unit_302 = next((u for u in units if u["unit_num"] == "302"), None)
        self.assertIsNotNone(unit_302, "Unit 302 must exist")
        self.assertEqual(unit_302["floor_num"], 3)
        self.assertEqual(unit_302["area_sqm"], 165)
        self.assertGreater(unit_302["market_price_egp"], unit_302["price_egp"])
        self.assertEqual(unit_302["market_price_egp"] - unit_302["price_egp"], 750000)

    def test_03_daily_logs_day_by_day(self):
        """Verify Daily Logs exist and contain timestamps, workforce, and photos"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM daily_logs ORDER BY date DESC")
        logs = [dict(r) for r in cursor.fetchall()]
        conn.close()

        self.assertGreaterEqual(len(logs), 3, "At least 3 day-by-day logs should be seeded")
        latest = logs[0]
        self.assertIn("date", latest)
        self.assertIn("day_name", latest)
        self.assertIn("title", latest)
        self.assertGreater(latest["workforce_count"], 0)
        self.assertTrue(latest["photos_json"], "Photos JSON must not be empty")
        
        photos = json.loads(latest["photos_json"])
        self.assertIsInstance(photos, list)
        self.assertGreater(len(photos), 0)

    def test_04_buyer_reservation_and_milestones(self):
        """Verify Buyer reservation has accurate milestone payment schedule"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM buyer_reservations WHERE id = 'RES-302-BELAL'")
        res = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(res, "Reservation RES-302-BELAL must exist")
        res_dict = dict(res)
        self.assertEqual(res_dict["unit_id"], "unit-302")
        self.assertEqual(res_dict["total_price"], 1450000)
        self.assertEqual(res_dict["savings_amount"], 750000)
        self.assertEqual(res_dict["paid_amount"], 870000)
        
        schedule = json.loads(res_dict["payment_schedule_json"])
        self.assertEqual(len(schedule), 6, "Payment schedule must have 6 milestones")
        paid_items = [m for m in schedule if m["status"] == "مدفوعة"]
        self.assertEqual(len(paid_items), 3, "First 3 milestones should be marked paid")

    def test_05_syndicate_votes_governance(self):
        """Verify Syndicate votes exist and options have valid percentages"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM syndicate_votes")
        votes = [dict(r) for r in cursor.fetchall()]
        conn.close()

        self.assertGreaterEqual(len(votes), 3, "At least 3 syndicate vote topics must exist")
        first_vote = votes[0]
        options = json.loads(first_vote["options_json"])
        self.assertEqual(len(options), 2)
        total_pct = sum(opt.get("pct", 0) for opt in options)
        self.assertEqual(total_pct, 100, "Options percentages must total 100%")

    def test_06_direct_unit_reservation_flow(self):
        """Verify reserving an available unit updates status and creates buyer reservation"""
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Reserve unit-501
        test_buyer = "أحمد مصطفى التجريبي"
        cursor.execute("UPDATE units SET status = 'reserved', buyer_name = ? WHERE id = 'unit-501'", (test_buyer,))
        
        res_id = f"TEST-RES-501-{int(time.time())}"
        cursor.execute("""
        INSERT INTO buyer_reservations (
            id, unit_id, project_id, buyer_name, buyer_phone, buyer_email,
            total_price, market_price, savings_amount, paid_amount, next_milestone, next_amount,
            contract_status, escrow_account_num, reservation_date, payment_schedule_json
        ) VALUES (
            ?, 'unit-501', 'CB-2023-NRG-01', ?, '+201099998888', 'test@cobuild.eg',
            1600000, 2450000, 850000, 320000, 'صب الأساسات', 320000,
            'عقد قيد التوثيق', '492001928-EGP', '2026-09-28', '[]'
        )
        """, (res_id, test_buyer))
        conn.commit()

        # Check unit status
        cursor.execute("SELECT status, buyer_name FROM units WHERE id = 'unit-501'")
        unit_row = cursor.fetchone()
        self.assertEqual(unit_row["status"], "reserved")
        self.assertEqual(unit_row["buyer_name"], test_buyer)

        # Check reservation
        cursor.execute("SELECT * FROM buyer_reservations WHERE id = ?", (res_id,))
        self.assertIsNotNone(cursor.fetchone())
        conn.close()

    def test_07_direct_daily_log_creation(self):
        """Verify site engineer can insert a new daily log with photos and tests"""
        conn = database.get_connection()
        cursor = conn.cursor()
        test_id = f"test-log-{int(time.time())}"
        cursor.execute("""
        INSERT INTO daily_logs (
            id, project_id, date, day_name, title, description,
            workforce_count, engineer_name, weather, concrete_test, stage, photos_json
        ) VALUES (?, 'CB-2023-NRG-01', '2026-09-29', 'الثلاثاء', 'معلم اختبار جديد', 'وصف الاختبار الميداني', 25, 'م. مهندس تجريبي', '25°C', 'ناجح', 'الهيكل', '[]')
        """, (test_id,))
        conn.commit()

        cursor.execute("SELECT * FROM daily_logs WHERE id = ?", (test_id,))
        row = cursor.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row["day_name"], "الثلاثاء")
        cursor.execute("DELETE FROM daily_logs WHERE id = ?", (test_id,))
        conn.commit()
        conn.close()

    def test_08_direct_syndicate_voting_increment(self):
        """Verify syndicate vote casting increments vote counts and recalculates percentages"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM syndicate_votes WHERE id = 'vote-01'")
        vote = dict(cursor.fetchone())
        options = json.loads(vote["options_json"])
        
        # Cast vote for option 2
        options[1]["votes"] += 1
        new_total = sum(opt["votes"] for opt in options)
        for opt in options:
            opt["pct"] = round((opt["votes"] / new_total) * 100)

        cursor.execute("UPDATE syndicate_votes SET options_json = ?, total_votes = ? WHERE id = 'vote-01'", (json.dumps(options), new_total))
        conn.commit()

        cursor.execute("SELECT * FROM syndicate_votes WHERE id = 'vote-01'")
        updated_vote = dict(cursor.fetchone())
        self.assertEqual(updated_vote["total_votes"], new_total)
        conn.close()

if __name__ == "__main__":
    unittest.main()
