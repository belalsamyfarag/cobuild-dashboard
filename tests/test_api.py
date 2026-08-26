# CoBuild PropTech - Backend REST API & Database Test Suite
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

API_URL = "http://127.0.0.1:5000/api"

class TestCoBuildBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Verify database initialization
        database.init_db()

    def test_01_database_tables_exist(self):
        """Verify all 7 relational tables exist in SQLite database"""
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()

        expected_tables = ['projects', 'reports', 'milestones', 'floor_inspections', 'budget_invoices', 'iot_telemetry', 'rfis']
        for table in expected_tables:
            self.assertIn(table, tables, f"Table {table} must exist in database")

    def test_02_get_project_api(self):
        """Verify GET /api/project returns project metadata"""
        try:
            req = urllib.request.Request(f"{API_URL}/project")
            with urllib.request.urlopen(req, timeout=3) as res:
                self.assertEqual(res.status, 200)
                data = json.loads(res.read().decode('utf-8'))
                self.assertIn("name", data)
                self.assertIn("completion_pct", data)
                self.assertEqual(data["id"], "CB-2023-NRG-01")
        except urllib.error.URLError:
            self.skipTest("Backend server is not currently running on port 5000")

    def test_03_get_reports_api(self):
        """Verify GET /api/reports returns monthly reports list"""
        try:
            req = urllib.request.Request(f"{API_URL}/reports")
            with urllib.request.urlopen(req, timeout=3) as res:
                self.assertEqual(res.status, 200)
                data = json.loads(res.read().decode('utf-8'))
                self.assertIsInstance(data, list)
                self.assertGreater(len(data), 0)
        except urllib.error.URLError:
            self.skipTest("Backend server is not currently running on port 5000")

    def test_04_create_and_get_milestone_api(self):
        """Verify POST /api/milestones persists new record to SQLite"""
        try:
            test_milestone = {
                "id": f"test-ev-{int(time.time())}",
                "title": "معلم اختباري للتحقق",
                "subtitle": "فحص مسارات الأنابيب وتدقيق المطابقة",
                "date": "2023-04-10",
                "priority": "high",
                "status": "مجدول"
            }
            body = json.dumps(test_milestone).encode('utf-8')
            req = urllib.request.Request(f"{API_URL}/milestones", data=body, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=3) as res:
                self.assertEqual(res.status, 201)
                res_data = json.loads(res.read().decode('utf-8'))
                self.assertTrue(res_data.get("success"))

            # Verify it exists in GET
            req_get = urllib.request.Request(f"{API_URL}/milestones")
            with urllib.request.urlopen(req_get, timeout=3) as res:
                milestones = json.loads(res.read().decode('utf-8'))
                ids = [m["id"] for m in milestones]
                self.assertIn(test_milestone["id"], ids)
        except urllib.error.URLError:
            self.skipTest("Backend server is not currently running on port 5000")

    def test_05_get_floors_api(self):
        """Verify GET /api/floors returns BIM inspection data"""
        try:
            req = urllib.request.Request(f"{API_URL}/floors")
            with urllib.request.urlopen(req, timeout=3) as res:
                self.assertEqual(res.status, 200)
                floors = json.loads(res.read().decode('utf-8'))
                self.assertGreaterEqual(len(floors), 6)
        except urllib.error.URLError:
            self.skipTest("Backend server is not currently running on port 5000")

if __name__ == "__main__":
    unittest.main()
