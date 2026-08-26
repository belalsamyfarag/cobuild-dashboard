# CoBuild PropTech - SQLite Database & Models (Egyptian Arabic Edition)
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cobuild.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed=False):
    conn = get_connection()
    cursor = conn.cursor()

    if force_reseed:
        cursor.execute("DROP TABLE IF EXISTS projects")
        cursor.execute("DROP TABLE IF EXISTS reports")
        cursor.execute("DROP TABLE IF EXISTS milestones")
        cursor.execute("DROP TABLE IF EXISTS floor_inspections")
        cursor.execute("DROP TABLE IF EXISTS budget_invoices")
        cursor.execute("DROP TABLE IF EXISTS iot_telemetry")
        cursor.execute("DROP TABLE IF EXISTS rfis")

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
        sustainability_score TEXT DEFAULT 'A+ (معتمد ترشيد وبناء أخضر)'
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

    # Seed Initial Data
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    # Seed Project
    cursor.execute("""
    INSERT INTO projects (id, name, code, location, client, contractor, completion_pct, safe_days, sustainability_score)
    VALUES ('CB-2023-NRG-01', 'برج النرجس السكني والتجاري', 'CB-2023-NRG-01', 'القاهرة الجديدة - التجمع الخامس، شارع التسعين الشمالي', 'شركة التطوير العقاري وإدارة المشروعات', 'شركة المقاولات والأعمال الهندسية المتكاملة', 90.0, 200, 'A+ (معتمد ترشيد وبناء أخضر)')
    """)

    # Seed Reports
    reports = [
        ('rep-01', 'CB-2023-NRG-01', 'تقرير يناير 2023', 'يناير 2023', '2023', '4.2 ميجابايت', '2023-01-31', 'تقرير الإنجاز الشهري لأعمال حفر الموقع ودك التربة وصب اللبشة المسلحة وأعمدة البدروم مع نتائج تكسير مكعبات الخرسانة.', 'معتمد'),
        ('rep-02', 'CB-2023-NRG-01', 'تقرير فبراير 2023', 'فبراير 2023', '2023', '5.8 ميجابايت', '2023-02-28', 'استلام حديد وصب أسقف وأعمدة الدور الأرضي والأول، وتقارير السلامة الإنشائية ومطابقة تسليح حديد عز المعتمد.', 'معتمد'),
        ('rep-03', 'CB-2023-NRG-01', 'تقرير فبراير 2023 (المعدل)', 'فبراير 2023', '2023', '6.1 ميجابايت', '2023-03-05', 'الملحق الفني متضمناً نتائج اختبارات الكور تيست ومطابقة لوحات الشوب دروينج مع تمديدات الكهرباء والسباكة.', 'معتمد'),
        ('rep-04', 'CB-2023-NRG-01', 'تقرير مارس 2023', 'مارس 2023', '2023', '7.4 ميجابايت', '2023-03-31', 'متابعة أعمال المباني والعزل المائي، تمديد خطوط الحريق والصرف، وتركيب قطاعات الألوميتال والواجهات الزجاجية.', 'معتمد')
    ]
    cursor.executemany("INSERT INTO reports VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", reports)

    # Seed Milestones
    milestones = [
        ('ev-1', 'CB-2023-NRG-01', '27 مارس: استلام عزل الحمامات والأسطح', 'اختبار الغمر بالمياه لمدة 48 ساعة والتأكد من جودة طبقات الممبرين', '27 مارس 2023', 'مجدول', 'high', '2023-03-20 10:00:00'),
        ('ev-2', 'CB-2023-NRG-01', '28 مارس: صب خرسانة سقف الدور الرابع', 'استلام حديد التسليح من الاستشاري وطلب مضخات الخرسانة الجاهزة C40', '28 مارس 2023', 'قيد المراجعة', 'medium', '2023-03-21 11:00:00'),
        ('ev-3', 'CB-2023-NRG-01', '30 مارس: اختبار ضغط شبكة السباكة ومواسير الصرف', 'كبس خطوط التغذية وفحص غرف التفتيش والتأكد من مطابقة الكود المصري', '30 مارس 2023', 'معتمد', 'high', '2023-03-22 12:00:00')
    ]
    cursor.executemany("INSERT INTO milestones VALUES (?, ?, ?, ?, ?, ?, ?, ?)", milestones)

    # Seed Floors
    floors = [
        (0, 'CB-2023-NRG-01', 'الدور الأرضي والبدروم (الجراج)', 'completed', 100, '42 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%', 'تمديدات السباكة والكهرباء منجزة بنسبة 100%', 'أرضيات خرسانة هليكوبتر وإيبوكسي وعزل رطوبة معتمد', json.dumps(["فحص مصارف تصريف الأمطار", "اعتماد لوحات التوزيع وقواطع الكهرباء الرئيسية"]), 'معتمد بالكامل من الاستشاري المشرف على المشروع'),
        (1, 'CB-2023-NRG-01', 'الدور الأول (تجاري / إداري)', 'completed', 100, '38.5 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%', 'دكتات التكييف المركزي وشبكة الحريق منجزة بنسبة 95%', 'أعمال قواطع الجبس بورد وتركيب قطاعات الواجهات الزجاجية', json.dumps(["معاينة مخارج وأبواب الطوارئ المقاومة للحريق", "اختبار ضغط شبكة مكافحة الحريق"]), 'معتمد - تم إصدار شهادة استلام المرحلة'),
        (2, 'CB-2023-NRG-01', 'الدور الثاني (سكني)', 'completed', 100, '39.1 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%', 'تمديدات تغذية المياه والصرف وخراطيم الكهرباء منجزة بنسبة 90%', 'اكتمال بؤج وأوتار المحارة والطرطشة والدهانات التأسيسية', json.dumps(["فحص ميول تصريف مياه البلكونات", "استلام شرب وعُلب الكهرباء من الاستشاري"]), 'معتمد من استشاري المشروع'),
        (3, 'CB-2023-NRG-01', 'الدور الثالث (سكني)', 'completed', 100, '37.8 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%', 'تمديدات شبكة الكهرباء ومواسير التغذية منجزة بنسبة 85%', 'بدء أعمال مباني الطوب المصمت والمفرغ والطرطشة', json.dumps(["استلام شبكات الإنذار المبكر", "مطابقة العوازل الحرارية والصوتية للواجهات"]), 'معتمد جزئياً - جاري فحص أعمال التمديدات'),
        (4, 'CB-2023-NRG-01', 'الدور الرابع (قيد التنفيذ)', 'in-progress', 75, 'جاري انتظار نتيجة كسر مكعبات الخرسانة لعمر 28 يوم', 'تأسيس مسارات الجلب والفتحات الإنشائية (Sleeves) بالكمرات', 'مرحلة صب الأعمدة والكمرات الخرسانية', json.dumps(["فحص وزنة وشاقولية الأعمدة", "استلام حديد التسليح للسقف قبل الصب"]), 'قيد المتابعة الميدانية'),
        (5, 'CB-2023-NRG-01', 'الدور الخامس (أعمال الشدات)', 'in-progress', 40, 'لم يتم الصب بعد - تم اعتماد تصميم الخلطة الخرسانية C40', 'مراجعة لوحات الشوب دروينج للميكانيكا والكهرباء', 'تركيب السقالات والشدات المعدنية والخشبية', json.dumps(["مطابقة قطاعات وتخانة الكمرات الساقطة", "فحص البسكويت الخرساني والتخانة"]), 'مجدول للاستلام الميداني خلال 3 أيام'),
        (6, 'CB-2023-NRG-01', 'الرووف وغرفة المصاعد والخدمات', 'upcoming', 0, 'مرحلة التجهيز والربط الإنشائي', 'تأسيس قواعد غرف التكييف المركزية ومصاعد الركاب', 'لم تبدأ بعد', json.dumps(["اعتماد عينات ومواصفات عزل السطح المائي والحراري المزدوج"]), 'مخطط للتنفيذ ضمن الربع القادم')
    ]
    cursor.executemany("INSERT INTO floor_inspections VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", floors)

    # Seed Invoices
    invoices = [
        ('inv-101', 'CB-2023-NRG-01', 'المواد الخام', 'توريد حديد تسليح عز (أقطار مختلفة مشرشر)', '1,850,000 ج.م', 1850000, 'مجموعة حديد عز', '2023-01-12', 'مدفوع'),
        ('inv-102', 'CB-2023-NRG-01', 'المواد الخام', 'خرسانة جاهزة مقاومة للكبريتات والسيول (C40)', '2,650,000 ج.م', 2650000, 'الشركة المصرية للخرسانة الجاهزة', '2023-02-04', 'مدفوع'),
        ('inv-103', 'CB-2023-NRG-01', 'المصنعيات والعمالة', 'مصنعيات فرق النجارة المسلحة والحدادة والصب', '1,900,000 ج.م', 1900000, 'إدارة العمليات والتنفيذ الميداني', '2023-02-28', 'مدفوع'),
        ('inv-104', 'CB-2023-NRG-01', 'المصنعيات والعمالة', 'رواتب ومكافآت الطاقم الهندسي وضبط الجودة', '1,100,000 ج.م', 1100000, 'الإدارة الهندسية والمكتب الفني', '2023-03-01', 'مدفوع'),
        ('inv-105', 'CB-2023-NRG-01', 'مقاولي الباطن', 'مقاول دكتات التكييف والتهوية ومكافحة الحريق', '850,000 ج.م', 850000, 'المصرية للأعمال الكهروميكانيكية', '2023-03-15', 'معتمد للصرف'),
        ('inv-106', 'CB-2023-NRG-01', 'مقاولي الباطن', 'دفعة مقدمة لتوريد وتركيب مصاعد الركاب والخدمات', '650,000 ج.م', 650000, 'شركة شندلر للمصاعد مصر', '2023-03-20', 'دفعة مقدمة'),
        ('inv-107', 'CB-2023-NRG-01', 'التراخيص والاحتياطي', 'رسوم تراخيص الحفر والبناء والدفاع المدني والإشراف', '1,200,000 ج.م', 1200000, 'جهاز تنمية القاهرة الجديدة', '2023-01-05', 'مدفوع'),
        ('inv-108', 'CB-2023-NRG-01', 'التراخيص والاحتياطي', 'احتياطي الطوارئ ومخصص فروق أسعار الخامات', '4,800,000 ج.م', 4800000, 'حساب الضمان البنكي للمشروع', '2023-03-30', 'محجوز بنكياً')
    ]
    cursor.executemany("INSERT INTO budget_invoices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", invoices)

    # Seed RFIs
    rfis = [
        ('RFI-104', 'CB-2023-NRG-01', 'تعديل مسارات دكتات التكييف لتفادي سقوط الكمرات بممرات الدور الثاني', 'المصرية للأعمال الكهروميكانيكية', '2023-03-20', 'معتمد بملاحظات', 'high'),
        ('MAT-218', 'CB-2023-NRG-01', 'اعتماد عينات رخام المداخل وكسوة الواجهات وسيراميك الحمامات المعتمد', 'شركة الدلتا للتشطيبات والمقاولات', '2023-03-22', 'معتمد بالكامل', 'medium'),
        ('EIR-089', 'CB-2023-NRG-01', 'طلب استلام حديد تسليح سقف الدور الرابع قبل فتح إذن الصب الخرساني', 'شركة البناء الحديث للمقاولات', '2023-03-24', 'جاري المعاينة الميدانية', 'urgent')
    ]
    cursor.executemany("INSERT INTO rfis VALUES (?, ?, ?, ?, ?, ?, ?)", rfis)

if __name__ == "__main__":
    init_db(force_reseed=True)
    print("Database reseeded successfully with Egyptian Arabic dataset.")
