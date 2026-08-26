# CoBuild PropTech - SQLite Database & Models
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cobuild.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Projects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        location TEXT,
        client TEXT,
        contractor TEXT,
        completion_pct REAL DEFAULT 90.0,
        safe_days INTEGER DEFAULT 200,
        sustainability_score TEXT DEFAULT 'A+ (مستدام متقدم)'
    )
    """)

    # 2. Monthly Reports Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT NOT NULL,
        month TEXT,
        year TEXT,
        size TEXT,
        date TEXT,
        summary TEXT,
        status TEXT DEFAULT 'معتمد',
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 3. Milestones Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS milestones (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT NOT NULL,
        subtitle TEXT,
        date TEXT,
        status TEXT DEFAULT 'مجدول',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 4. BIM Floor Inspections Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS floor_inspections (
        floor_num INTEGER PRIMARY KEY,
        project_id TEXT,
        name TEXT,
        status TEXT,
        progress INTEGER,
        concrete_test TEXT,
        mep_status TEXT,
        finishing_status TEXT,
        snag_items TEXT,
        engineer_approval TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 5. Budget Invoices Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS budget_invoices (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        category TEXT,
        item TEXT,
        amount TEXT,
        amount_num REAL,
        supplier TEXT,
        date TEXT,
        status TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 6. IoT Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iot_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        concrete_temp REAL,
        crane_tilt REAL,
        noise_db REAL,
        air_quality_aqi INTEGER
    )
    """)

    # 7. RFIs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rfis (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        subject TEXT,
        contractor TEXT,
        date TEXT,
        status TEXT,
        priority TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # Seed Initial Data if empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    # Seed Project
    cursor.execute("""
    INSERT INTO projects (id, name, code, location, client, contractor, completion_pct, safe_days, sustainability_score)
    VALUES ('CB-2023-YAS-01', 'برج الياسمين الإسكاني والمهني', 'CB-2023-YAS-01', 'الرياض - طريق الملك سلمان', 'شركة التطوير العقاري المتقدمة', 'شركة البناء الحديث للإنشاءات', 90.0, 200, 'A+ (مستدام متقدم)')
    """)

    # Seed Reports
    reports = [
        ('rep-01', 'CB-2023-YAS-01', 'تقرير يناير 2023', 'يناير 2023', '2023', '4.2 MB', '2023-01-31', 'تقرير الإنجاز الشهري لأعمال الأساسات وصب اللبشة المسلحة وأعمدة القبو مع اختبارات جودة الخرسانة.', 'معتمد'),
        ('rep-02', 'CB-2023-YAS-01', 'تقرير فبراير 2023', 'فبراير 2023', '2023', '5.8 MB', '2023-02-28', 'تقرير فحص صب أسقف الطابقين الأول والثاني، وتقارير السلامة الإنشائية ومطابقة حديد التسليح.', 'معتمد'),
        ('rep-03', 'CB-2023-YAS-01', 'تقرير فبراير 2023 (المعدل)', 'فبراير 2023', '2023', '6.1 MB', '2023-03-05', 'الملحق الفني لتقرير فبراير متضمناً نتائج فحوصات الكور والمطابقة الهندسية للتمديدات الميكانيكية.', 'معتمد'),
        ('rep-04', 'CB-2023-YAS-01', 'تقرير مارس 2023', 'مارس 2023', '2023', '7.4 MB', '2023-03-31', 'تقرير متابعة أعمال التشطيبات الأولية، تمديد خطوط الإطفاء، وتركيب قطاعات الألومنيوم والزجاج.', 'معتمد')
    ]
    cursor.executemany("INSERT INTO reports VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", reports)

    # Seed Milestones
    milestones = [
        ('ev-1', 'CB-2023-YAS-01', '27 عون العروبة', 'التشطيب في المساحة المعاني 2022 وشق البناء (فحص أعمال العزل المائي)', '27 مارس 2023', 'مجدول', 'high', '2023-03-20 10:00:00'),
        ('ev-2', 'CB-2023-YAS-01', '28 حمود العضمة', 'صيانة حقول وتثبيت الشدات والخرسانة المسلحة', '28 مارس 2023', 'قيد المراجعة', 'medium', '2023-03-21 11:00:00'),
        ('ev-3', 'CB-2023-YAS-01', '30 علند المناسب', 'فحص ومطابقة معايير مركز الشفافية للبناء والسلامة', '30 مارس 2023', 'معتمد', 'high', '2023-03-22 12:00:00')
    ]
    cursor.executemany("INSERT INTO milestones VALUES (?, ?, ?, ?, ?, ?, ?, ?)", milestones)

    # Seed Floors
    floors = [
        (0, 'CB-2023-YAS-01', 'الطابق الأرضي والمواقف', 'completed', 100, '42 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%', 'تمديدات السباكة والكهرباء منجزة بنسبة 100%', 'أرضيات إيبوكسي وعزل مائي معتمد', json.dumps(["فحص مصارف تصريف السيول", "اعتماد لوحات التوزيع الرئيسية"]), 'معتمد بالكامل من مكتب خطيب وعلمي للاستشارات'),
        (1, 'CB-2023-YAS-01', 'الطابق الأول', 'completed', 100, '38.5 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%', 'مجاري التكييف ومكافحة الحريق منجزة بنسبة 95%', 'أعمال القواطع الجبسية والواجهات الزجاجية', json.dumps(["معاينة مخارج الطوارئ", "فحص ضغط شبكة مكافحة الحريق"]), 'معتمد - تم إصدار شهادة استلام المرحلة'),
        (2, 'CB-2023-YAS-01', 'الطابق الثاني', 'completed', 100, '39.1 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%', 'تمديدات التغذية والصرف والتكييف منجزة بنسبة 90%', 'اكتمال أعمال اللياسة والدهانات التأسيسية', json.dumps(["فحص ميول تصريف الشرفات", "استلام علب الكهرباء"]), 'معتمد من استشاري المشروع'),
        (3, 'CB-2023-YAS-01', 'الطابق الثالث', 'completed', 100, '37.8 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%', 'تمديدات الكهرباء والأنابيب منجزة بنسبة 85%', 'بدء أعمال البلوك واللياسة الداخلية', json.dumps(["استلام شبكات الإنذار المبكر", "مطابقة العوازل الحرارية"]), 'معتمد جزئياً - جاري فحص أعمال التمديدات'),
        (4, 'CB-2023-YAS-01', 'الطابق الرابع', 'in-progress', 75, 'جاري انتظار نتيجة كسر المكعبات (عمر 28 يوم)', 'تأسيس مسارات الأنابيب والفتحات الإنشائية (Sleeves)', 'مرحلة صب الأعمدة والجسور الخرسانية', json.dumps(["فحص شاقولية الأعمدة", "استلام حديد التسليح للسقف"]), 'قيد المتابعة الميدانية'),
        (5, 'CB-2023-YAS-01', 'الطابق الخامس', 'in-progress', 40, 'لم يتم الصب بعد - اعتماد خلطة الخرسانة C40', 'مراجعة المخططات التنفيذية (Shop Drawings)', 'تركيب السقالات والشدات الخشبية والمعدنية', json.dumps(["مطابقة أبعاد الجسور الساقطة", "فحص مباعدات حديد التسليح"]), 'مجدول للاستلام خلال 3 أيام'),
        (6, 'CB-2023-YAS-01', 'طابق الخدمات والسطح', 'upcoming', 0, 'مرحلة التجهيز والربط الإنشائي', 'تأسيس قواعد غرف التكييف المركزية والمصاعد', 'لم تبدأ بعد', json.dumps(["اعتماد مواصفات عزل السطح المائي والحراري"]), 'مخطط ضمن الربع القادم')
    ]
    cursor.executemany("INSERT INTO floor_inspections VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", floors)

    # Seed Invoices
    invoices = [
        ('inv-101', 'CB-2023-YAS-01', 'المواد', 'توريد حديد تسليح سابك (Grade 60)', '1,850,000 ر.س', 1850000, 'شركة الراجحي للصلب', '2023-01-12', 'مدفوع'),
        ('inv-102', 'CB-2023-YAS-01', 'المواد', 'خرسانة جاهزة مقاومة للكبريتات (C40)', '2,650,000 ر.س', 2650000, 'شركة الخرسانة السعودية', '2023-02-04', 'مدفوع'),
        ('inv-103', 'CB-2023-YAS-01', 'العمالة', 'أجور فرق النجارة والحدادة والصب', '1,900,000 ر.س', 1900000, 'إدارة العمليات الميدانية', '2023-02-28', 'مدفوع'),
        ('inv-104', 'CB-2023-YAS-01', 'العمالة', 'رواتب الفريق الهندسي وضبط الجودة', '1,100,000 ر.س', 1100000, 'الكادر الاستشاري', '2023-03-01', 'مدفوع'),
        ('inv-105', 'CB-2023-YAS-01', 'المقاولين', 'مقاول التكييف ومجاري الهواء (MEP)', '850,000 ر.س', 850000, 'المتحدة للأنظمة الكهروميكانيكية', '2023-03-15', 'معتمد للصرف'),
        ('inv-106', 'CB-2023-YAS-01', 'المقاولين', 'مقاول المصاعد والسلالم الكهربائية', '650,000 ر.س', 650000, 'أوتيس السعودية', '2023-03-20', 'دفعة مقدمة'),
        ('inv-107', 'CB-2023-YAS-01', 'التراخيص والاحتياطي', 'رسوم الإشراف والدفاع المدني والبلدية', '1,200,000 ر.س', 1200000, 'أمانة منطقة الرياض', '2023-01-05', 'مدفوع'),
        ('inv-108', 'CB-2023-YAS-01', 'التراخيص والاحتياطي', 'مخصص الطوارئ وتقلبات الأسعار', '4,800,000 ر.س', 4800000, 'صندوق الضمان المالي للمشروع', '2023-03-30', 'محجوز بنكياً')
    ]
    cursor.executemany("INSERT INTO budget_invoices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", invoices)

    # Seed RFIs
    rfis = [
        ('RFI-104', 'CB-2023-YAS-01', 'تعديل مسارات دكتات التكييف في ممرات الطابق 2', 'المتحدة للميكانيك', '2023-03-20', 'معتمد بملاحظات', 'high'),
        ('MAT-218', 'CB-2023-YAS-01', 'اعتماد عينات رخام الواجهات والجرانيت للأرضيات', 'العامة للتشطيبات', '2023-03-22', 'معتمد بالكامل', 'medium'),
        ('EIR-089', 'CB-2023-YAS-01', 'طلب فحص حديد تسليح سقف الطابق الرابع قبل الصب', 'البناء الحديث', '2023-03-24', 'جاري المعاينة الميدانية', 'urgent')
    ]
    cursor.executemany("INSERT INTO rfis VALUES (?, ?, ?, ?, ?, ?, ?)", rfis)

if __name__ == "__main__":
    init_db()
    print("Database initialized and seeded successfully.")
